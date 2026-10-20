import { create } from 'zustand';
import { User, Workshop, Customer, Vehicle, ServiceOrder, Estimate, EstimateItem, Message, Notification, OrderStatus, AuthorizationStatus, EstimateStatus, Role, OrderMedia, Diagnostic, Authorization, OrderEvent, Subscription } from '../types';
import { demoUsers, demoWorkshops, demoCustomers, demoVehicles, demoOrders, demoEstimates, demoMessages, demoNotifications, demoMedia, demoDiagnostics, demoAuthorizations, demoEvents, demoSubscriptions } from '../data/demo';

interface AppState {
  // Auth
  currentUser: User | null;
  currentWorkshop: Workshop | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;

  // Data
  workshops: Workshop[];
  users: User[];
  customers: Customer[];
  vehicles: Vehicle[];
  orders: ServiceOrder[];
  estimates: Estimate[];
  messages: Message[];
  notifications: Notification[];
  media: OrderMedia[];
  diagnostics: Diagnostic[];
  authorizations: Authorization[];
  events: OrderEvent[];
  subscriptions: Subscription[];

  // Customers CRUD
  addCustomer: (customer: Omit<Customer, 'id' | 'createdAt' | 'trackingToken'>) => void;
  updateCustomer: (id: string, data: Partial<Customer>) => void;
  deleteCustomer: (id: string) => void;

  // Vehicles CRUD
  addVehicle: (vehicle: Omit<Vehicle, 'id' | 'createdAt'>) => void;
  updateVehicle: (id: string, data: Partial<Vehicle>) => void;
  deleteVehicle: (id: string) => void;

  // Orders CRUD
  addOrder: (order: Omit<ServiceOrder, 'id' | 'createdAt' | 'updatedAt' | 'orderNumber'>) => void;
  updateOrderStatus: (orderId: string, newStatus: OrderStatus, userId: string, reason?: string) => boolean;
  updateOrder: (id: string, data: Partial<ServiceOrder>) => void;

  // Estimates
  addEstimate: (estimate: Omit<Estimate, 'id' | 'createdAt'>) => void;
  updateEstimateStatus: (id: string, status: EstimateStatus) => void;

  // Authorizations
  authorizeItem: (estimateId: string, itemId: string, customerId: string, decision: AuthorizationStatus, version: number, notes?: string) => void;

  // Messages
  addMessage: (message: Omit<Message, 'id' | 'createdAt' | 'read'>) => void;
  markMessageRead: (id: string) => void;

  // Notifications
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: (userId: string) => void;

  // Media
  addMedia: (media: Omit<OrderMedia, 'id' | 'createdAt'>) => void;

  // Diagnostics
  addDiagnostic: (diag: Omit<Diagnostic, 'id' | 'createdAt'>) => void;

  // Users
  addUser: (user: Omit<User, 'id' | 'createdAt'>) => void;
  updateUser: (id: string, data: Partial<User>) => void;
  toggleUserActive: (id: string) => void;

  // Workshops
  toggleWorkshopActive: (id: string) => void;
  updateWorkshopPlan: (id: string, plan: any) => void;
}

const generateId = () => Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
const generateToken = () => 'tk_' + Math.random().toString(36).substring(2, 30);

const getStatusTransitions = (current: OrderStatus): OrderStatus[] => {
  const transitions: Record<OrderStatus, OrderStatus[]> = {
    received: ['diagnosing', 'cancelled'],
    diagnosing: ['awaiting_approval', 'cancelled'],
    awaiting_approval: ['authorized', 'cancelled'],
    authorized: ['repairing', 'cancelled'],
    repairing: ['on_hold', 'testing', 'cancelled'],
    on_hold: ['repairing', 'cancelled'],
    testing: ['ready', 'repairing', 'cancelled'],
    ready: ['delivered', 'cancelled'],
    delivered: [],
    cancelled: [],
  };
  return transitions[current] || [];
};

export const useStore = create<AppState>((set, get) => ({
  currentUser: null,
  currentWorkshop: null,
  workshops: demoWorkshops,
  users: demoUsers,
  customers: demoCustomers,
  vehicles: demoVehicles,
  orders: demoOrders,
  estimates: demoEstimates,
  messages: demoMessages,
  notifications: demoNotifications,
  media: demoMedia,
  diagnostics: demoDiagnostics,
  authorizations: demoAuthorizations,
  events: demoEvents,
  subscriptions: demoSubscriptions,

  login: (email, password) => {
    const user = get().users.find(u => u.email === email && u.password === password && u.active);
    if (!user) return false;
    const workshop = user.workshopId ? get().workshops.find(w => w.id === user.workshopId) || null : null;
    set({ currentUser: user, currentWorkshop: workshop });
    return true;
  },

  logout: () => set({ currentUser: null, currentWorkshop: null }),

  addCustomer: (data) => {
    const customer: Customer = { ...data, id: generateId(), createdAt: new Date().toISOString(), trackingToken: generateToken() };
    set(state => ({ customers: [...state.customers, customer] }));
  },

  updateCustomer: (id, data) => set(state => ({
    customers: state.customers.map(c => c.id === id ? { ...c, ...data } : c)
  })),

  deleteCustomer: (id) => set(state => ({
    customers: state.customers.map(c => c.id === id ? { ...c, active: false } : c)
  })),

  addVehicle: (data) => {
    const vehicle: Vehicle = { ...data, id: generateId(), createdAt: new Date().toISOString() };
    set(state => ({ vehicles: [...state.vehicles, vehicle] }));
  },

  updateVehicle: (id, data) => set(state => ({
    vehicles: state.vehicles.map(v => v.id === id ? { ...v, ...data } : v)
  })),

  deleteVehicle: (id) => set(state => ({
    vehicles: state.vehicles.filter(v => v.id !== id)
  })),

  addOrder: (data) => {
    const workshopOrders = get().orders.filter(o => o.workshopId === data.workshopId);
    const year = new Date().getFullYear();
    const orderNumber = `OT-${year}-${String(workshopOrders.length + 1).padStart(3, '0')}`;
    const order: ServiceOrder = { ...data, id: generateId(), orderNumber, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    set(state => ({ orders: [...state.orders, order] }));
    // Add initial event
    const event: OrderEvent = { id: generateId(), orderId: order.id, fromStatus: 'received' as OrderStatus, toStatus: 'received', changedBy: data.advisorId, createdAt: new Date().toISOString() };
    set(state => ({ events: [...state.events, event] }));
  },

  updateOrderStatus: (orderId, newStatus, userId, reason) => {
    const order = get().orders.find(o => o.id === orderId);
    if (!order) return false;
    const allowed = getStatusTransitions(order.status);
    if (!allowed.includes(newStatus)) return false;
    
    // Check authorization rule: can't go to repairing if there are pending auth items
    if (newStatus === 'repairing') {
      const estimate = get().estimates.find(e => e.orderId === orderId);
      if (estimate) {
        const pendingAuth = estimate.items.some(i => i.requiresAuth && i.authStatus === 'pending');
        if (pendingAuth) return false;
      }
    }

    const event: OrderEvent = { id: generateId(), orderId, fromStatus: order.status, toStatus: newStatus, changedBy: userId, reason, createdAt: new Date().toISOString() };
    set(state => ({
      orders: state.orders.map(o => o.id === orderId ? { ...o, status: newStatus, updatedAt: new Date().toISOString() } : o),
      events: [...state.events, event]
    }));
    return true;
  },

  updateOrder: (id, data) => set(state => ({
    orders: state.orders.map(o => o.id === id ? { ...o, ...data, updatedAt: new Date().toISOString() } : o)
  })),

  addEstimate: (data) => {
    const estimate: Estimate = { ...data, id: generateId(), createdAt: new Date().toISOString() };
    set(state => ({ estimates: [...state.estimates, estimate] }));
  },

  updateEstimateStatus: (id, status) => set(state => ({
    estimates: state.estimates.map(e => e.id === id ? { ...e, status } : e)
  })),

  authorizeItem: (estimateId, itemId, customerId, decision, version, notes) => {
    const auth: Authorization = { id: generateId(), estimateId, itemId, customerId, decision, version, notes, createdAt: new Date().toISOString() };
    set(state => {
      const newAuths = [...state.authorizations, auth];
      const newEstimates = state.estimates.map(e => {
        if (e.id !== estimateId) return e;
        const newItems = e.items.map(item => {
          if (item.id !== itemId) return item;
          return { ...item, authStatus: decision };
        });
        // Recalculate status
        const allApproved = newItems.filter(i => i.requiresAuth).every(i => i.authStatus === 'approved');
        const allRejected = newItems.filter(i => i.requiresAuth).every(i => i.authStatus === 'rejected');
        const somePending = newItems.filter(i => i.requiresAuth).some(i => i.authStatus === 'pending');
        let newStatus: EstimateStatus = e.status;
        if (somePending) newStatus = 'partially_approved';
        else if (allApproved) newStatus = 'approved';
        else if (allRejected) newStatus = 'rejected';
        else newStatus = 'partially_approved';
        return { ...e, items: newItems, status: newStatus };
      });
      return { authorizations: newAuths, estimates: newEstimates };
    });
  },

  addMessage: (data) => {
    const message: Message = { ...data, id: generateId(), read: false, createdAt: new Date().toISOString() };
    set(state => ({ messages: [...state.messages, message] }));
  },

  markMessageRead: (id) => set(state => ({
    messages: state.messages.map(m => m.id === id ? { ...m, read: true } : m)
  })),

  addNotification: (data) => {
    const notification: Notification = { ...data, id: generateId(), read: false, createdAt: new Date().toISOString() };
    set(state => ({ notifications: [...state.notifications, notification] }));
  },

  markNotificationRead: (id) => set(state => ({
    notifications: state.notifications.map(n => n.id === id ? { ...n, read: true } : n)
  })),

  markAllNotificationsRead: (userId) => set(state => ({
    notifications: state.notifications.map(n => n.userId === userId ? { ...n, read: true } : n)
  })),

  addMedia: (data) => {
    const media: OrderMedia = { ...data, id: generateId(), createdAt: new Date().toISOString() };
    set(state => ({ media: [...state.media, media] }));
  },

  addDiagnostic: (data) => {
    const diag: Diagnostic = { ...data, id: generateId(), createdAt: new Date().toISOString() };
    set(state => ({ diagnostics: [...state.diagnostics, diag] }));
  },

  addUser: (data) => {
    const user: User = { ...data, id: generateId(), createdAt: new Date().toISOString() };
    set(state => ({ users: [...state.users, user] }));
  },

  updateUser: (id, data) => set(state => ({
    users: state.users.map(u => u.id === id ? { ...u, ...data } : u)
  })),

  toggleUserActive: (id) => set(state => ({
    users: state.users.map(u => u.id === id ? { ...u, active: !u.active } : u)
  })),

  toggleWorkshopActive: (id) => set(state => ({
    workshops: state.workshops.map(w => w.id === id ? { ...w, active: !w.active } : w)
  })),

  updateWorkshopPlan: (id, plan) => set(state => ({
    workshops: state.workshops.map(w => w.id === id ? { ...w, plan } : w)
  })),
}));

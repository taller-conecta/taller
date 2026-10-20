export type Role = 'admin' | 'owner' | 'advisor' | 'mechanic' | 'customer';
export type OrderStatus = 'received' | 'diagnosing' | 'awaiting_approval' | 'authorized' | 'repairing' | 'on_hold' | 'testing' | 'ready' | 'delivered' | 'cancelled';
export type PlanType = 'starter' | 'pro' | 'business';
export type VehicleType = 'car' | 'motorcycle' | 'other';
export type EstimateStatus = 'draft' | 'sent' | 'approved' | 'partially_approved' | 'rejected';
export type AuthorizationStatus = 'pending' | 'approved' | 'rejected';
export type MessageReadStatus = 'sent' | 'delivered' | 'read';

export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  role: Role;
  workshopId: string | null;
  avatar?: string;
  phone?: string;
  active: boolean;
  createdAt: string;
}

export interface Workshop {
  id: string;
  name: string;
  nit: string;
  address: string;
  city: string;
  phone: string;
  email: string;
  logo?: string;
  plan: PlanType;
  active: boolean;
  createdAt: string;
  subscriptionEnd?: string;
}

export interface Customer {
  id: string;
  workshopId: string;
  name: string;
  document: string;
  email: string;
  phone: string;
  address?: string;
  active: boolean;
  trackingToken?: string;
  createdAt: string;
}

export interface Vehicle {
  id: string;
  workshopId: string;
  customerId: string;
  type: VehicleType;
  plate: string;
  brand: string;
  model: string;
  year: number;
  color: string;
  mileage: number;
  notes?: string;
  createdAt: string;
}

export interface ServiceOrder {
  id: string;
  workshopId: string;
  orderNumber: string;
  customerId: string;
  vehicleId: string;
  advisorId: string;
  mechanicId?: string;
  status: OrderStatus;
  receptionDate: string;
  mileage: number;
  reason: string;
  symptoms: string;
  visibleDamage?: string;
  diagnosis?: string;
  estimatedDelivery?: string;
  internalNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Diagnostic {
  id: string;
  orderId: string;
  workshopId: string;
  mechanicId: string;
  problems: string;
  technicalDescription: string;
  causes?: string;
  recommendations: string;
  requiredWork: string;
  suggestedParts?: string;
  createdAt: string;
}

export interface Estimate {
  id: string;
  orderId: string;
  workshopId: string;
  version: number;
  items: EstimateItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  status: EstimateStatus;
  notes?: string;
  expiresAt?: string;
  createdAt: string;
}

export interface EstimateItem {
  id: string;
  description: string;
  type: 'part' | 'labor' | 'service';
  quantity: number;
  unitPrice: number;
  total: number;
  requiresAuth: boolean;
  authStatus: AuthorizationStatus;
  originalPrice?: number;
  homologatedPrice?: number;
}

export interface Authorization {
  id: string;
  estimateId: string;
  itemId: string;
  customerId: string;
  decision: AuthorizationStatus;
  version: number;
  createdAt: string;
  notes?: string;
}

export interface OrderMedia {
  id: string;
  orderId: string;
  workshopId: string;
  category: 'initial' | 'damage' | 'process' | 'replaced' | 'final';
  url: string;
  description?: string;
  visibleToCustomer: boolean;
  uploadedBy: string;
  createdAt: string;
}

export interface Message {
  id: string;
  orderId: string;
  workshopId: string;
  senderId: string;
  senderName: string;
  content: string;
  read: boolean;
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  workshopId: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  read: boolean;
  orderId?: string;
  createdAt: string;
}

export interface Subscription {
  id: string;
  workshopId: string;
  plan: PlanType;
  status: 'active' | 'cancelled' | 'expired';
  startDate: string;
  endDate: string;
  monthlyPrice: number;
}

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  workshopId: string;
  action: string;
  entity: string;
  entityId: string;
  details?: string;
  createdAt: string;
}

export interface OrderEvent {
  id: string;
  orderId: string;
  fromStatus: OrderStatus;
  toStatus: OrderStatus;
  changedBy: string;
  reason?: string;
  createdAt: string;
}

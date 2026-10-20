import { User, Workshop, Customer, Vehicle, ServiceOrder, Diagnostic, Estimate, Message, Notification, Subscription, OrderMedia, Authorization, OrderEvent, AuditLog } from '../types';

export const demoWorkshops: Workshop[] = [
  { id: 'w1', name: 'AutoServicio Bogotá', nit: '900.123.456-7', address: 'Cra 7 #45-12', city: 'Bogotá', phone: '601-555-0101', email: 'info@autoserviciobogota.com', plan: 'pro', active: true, createdAt: '2024-01-15', subscriptionEnd: '2026-12-31' },
  { id: 'w2', name: 'MotoTech Medellín', nit: '900.234.567-8', address: 'Cl 50 #33-21', city: 'Medellín', phone: '604-555-0202', email: 'contacto@mototech.com', plan: 'business', active: true, createdAt: '2024-03-20', subscriptionEnd: '2026-11-30' },
  { id: 'w3', name: 'Taller Express Cali', nit: '900.345.678-9', address: 'Av 6N #20-15', city: 'Cali', phone: '602-555-0303', email: 'taller@expresscali.com', plan: 'starter', active: true, createdAt: '2024-06-01' },
];

export const demoUsers: User[] = [
  { id: 'u1', email: 'admin@tallerconecta.com', password: 'admin123', name: 'Carlos Administrador', role: 'admin', workshopId: null, phone: '300-111-0001', active: true, createdAt: '2024-01-01' },
  { id: 'u2', email: 'dueno@autoservicio.com', password: 'dueno123', name: 'Roberto Martínez', role: 'owner', workshopId: 'w1', phone: '300-222-0002', active: true, createdAt: '2024-01-15' },
  { id: 'u3', email: 'asesor@autoservicio.com', password: 'asesor123', name: 'Ana López', role: 'advisor', workshopId: 'w1', phone: '300-333-0003', active: true, createdAt: '2024-02-01' },
  { id: 'u4', email: 'mecanico@autoservicio.com', password: 'mec123', name: 'Pedro García', role: 'mechanic', workshopId: 'w1', phone: '300-444-0004', active: true, createdAt: '2024-02-10' },
  { id: 'u5', email: 'mecanico2@autoservicio.com', password: 'mec123', name: 'Luis Torres', role: 'mechanic', workshopId: 'w1', phone: '300-444-0005', active: true, createdAt: '2024-03-01' },
  { id: 'u6', email: 'cliente1@email.com', password: 'cliente123', name: 'María Fernández', role: 'customer', workshopId: 'w1', phone: '310-555-0006', active: true, createdAt: '2024-03-15' },
  { id: 'u7', email: 'cliente2@email.com', password: 'cliente123', name: 'Juan Rodríguez', role: 'customer', workshopId: 'w1', phone: '310-555-0007', active: true, createdAt: '2024-04-01' },
  { id: 'u8', email: 'dueno@mototech.com', password: 'dueno123', name: 'Sandra Vega', role: 'owner', workshopId: 'w2', phone: '320-666-0008', active: true, createdAt: '2024-03-20' },
  { id: 'u9', email: 'cliente3@email.com', password: 'cliente123', name: 'Andrés Mejía', role: 'customer', workshopId: 'w2', phone: '320-777-0009', active: true, createdAt: '2024-05-01' },
];

export const demoCustomers: Customer[] = [
  { id: 'c1', workshopId: 'w1', name: 'María Fernández', document: '1020304050', email: 'maria.fernandez@email.com', phone: '310-555-0006', address: 'Calle 100 #15-20, Bogotá', active: true, trackingToken: 'tk_abc123xyz789', createdAt: '2024-03-15' },
  { id: 'c2', workshopId: 'w1', name: 'Juan Rodríguez', document: '79812345', email: 'juan.rodriguez@email.com', phone: '310-555-0007', address: 'Cra 15 #80-10, Bogotá', active: true, trackingToken: 'tk_def456uvw321', createdAt: '2024-04-01' },
  { id: 'c3', workshopId: 'w1', name: 'Laura Gómez', document: '1030506070', email: 'laura.gomez@email.com', phone: '315-888-0010', address: 'Av Caracas #50-30, Bogotá', active: true, trackingToken: 'tk_ghi789rst654', createdAt: '2024-05-10' },
  { id: 'c4', workshopId: 'w1', name: 'Diego Herrera', document: '80123456', email: 'diego.herrera@email.com', phone: '320-999-0011', address: 'Cl 72 #10-45, Bogotá', active: true, trackingToken: 'tk_jkl012opq987', createdAt: '2024-06-20' },
  { id: 'c5', workshopId: 'w2', name: 'Andrés Mejía', document: '1040607080', email: 'andres.mejia@email.com', phone: '320-777-0009', address: 'Cl 30 #45-12, Medellín', active: true, trackingToken: 'tk_mno345lmn123', createdAt: '2024-05-01' },
  { id: 'c6', workshopId: 'w2', name: 'Carolina Ruiz', document: '1050708090', email: 'carolina.ruiz@email.com', phone: '315-666-0012', address: 'Cra 43 #20-55, Medellín', active: true, trackingToken: 'tk_pqr678stu456', createdAt: '2024-07-15' },
];

export const demoVehicles: Vehicle[] = [
  { id: 'v1', workshopId: 'w1', customerId: 'c1', type: 'car', plate: 'ABC123', brand: 'Chevrolet', model: 'Spark GT', year: 2020, color: 'Blanco', mileage: 45000, createdAt: '2024-03-15' },
  { id: 'v2', workshopId: 'w1', customerId: 'c2', type: 'car', plate: 'DEF456', brand: 'Renault', model: 'Logan', year: 2019, color: 'Gris', mileage: 78000, createdAt: '2024-04-01' },
  { id: 'v3', workshopId: 'w1', customerId: 'c3', type: 'motorcycle', plate: 'GHI789', brand: 'Yamaha', model: 'FZ 16', year: 2022, color: 'Negro', mileage: 12000, createdAt: '2024-05-10' },
  { id: 'v4', workshopId: 'w1', customerId: 'c4', type: 'car', plate: 'JKL012', brand: 'Toyota', model: 'Corolla', year: 2021, color: 'Plata', mileage: 35000, createdAt: '2024-06-20' },
  { id: 'v5', workshopId: 'w1', customerId: 'c1', type: 'car', plate: 'MNO345', brand: 'Mazda', model: 'CX-3', year: 2023, color: 'Rojo', mileage: 18000, createdAt: '2024-07-01' },
  { id: 'v6', workshopId: 'w2', customerId: 'c5', type: 'motorcycle', plate: 'PQR678', brand: 'Honda', model: 'CBR 250R', year: 2021, color: 'Azul', mileage: 22000, createdAt: '2024-05-01' },
  { id: 'v7', workshopId: 'w2', customerId: 'c6', type: 'motorcycle', plate: 'STU901', brand: 'KTM', model: 'Duke 200', year: 2023, color: 'Naranja', mileage: 8000, createdAt: '2024-07-15' },
];

export const demoOrders: ServiceOrder[] = [
  { id: 'o1', workshopId: 'w1', orderNumber: 'OT-2025-001', customerId: 'c1', vehicleId: 'v1', advisorId: 'u3', mechanicId: 'u4', status: 'repairing', receptionDate: '2025-01-10T08:30:00', mileage: 45000, reason: 'Mantenimiento preventivo', symptoms: 'Ruido en frenos delanteros, vibración al frenar', visibleDamage: 'Pastillas de freno desgastadas visibles', diagnosis: 'Cambio de pastillas y discos de freno delanteros', estimatedDelivery: '2025-01-15', createdAt: '2025-01-10', updatedAt: '2025-01-12' },
  { id: 'o2', workshopId: 'w1', orderNumber: 'OT-2025-002', customerId: 'c2', vehicleId: 'v2', advisorId: 'u3', mechanicId: 'u5', status: 'awaiting_approval', receptionDate: '2025-01-11T09:00:00', mileage: 78000, reason: 'Falla de motor', symptoms: 'El carro pierde potencia, humo blanco por escape', visibleDamage: 'Sin daños visibles externos', estimatedDelivery: '2025-01-20', createdAt: '2025-01-11', updatedAt: '2025-01-13' },
  { id: 'o3', workshopId: 'w1', orderNumber: 'OT-2025-003', customerId: 'c3', vehicleId: 'v3', advisorId: 'u3', mechanicId: 'u4', status: 'ready', receptionDate: '2025-01-08T10:00:00', mileage: 12000, reason: 'Cambio de aceite y filtros', symptoms: 'Mantenimiento de los 12.000 km', diagnosis: 'Cambio de aceite, filtro de aceite, filtro de aire y bujías', estimatedDelivery: '2025-01-10', createdAt: '2025-01-08', updatedAt: '2025-01-10' },
  { id: 'o4', workshopId: 'w1', orderNumber: 'OT-2025-004', customerId: 'c4', vehicleId: 'v4', advisorId: 'u3', mechanicId: 'u5', status: 'diagnosing', receptionDate: '2025-01-13T14:00:00', mileage: 35000, reason: 'Check engine encendido', symptoms: 'Luz check engine, leve pérdida de potencia', createdAt: '2025-01-13', updatedAt: '2025-01-13' },
  { id: 'o5', workshopId: 'w1', orderNumber: 'OT-2025-005', customerId: 'c1', vehicleId: 'v5', advisorId: 'u3', status: 'received', receptionDate: '2025-01-14T08:00:00', mileage: 18000, reason: 'Revisión general', symptoms: 'El cliente reporta un ruido extraño en suspensión trasera', createdAt: '2025-01-14', updatedAt: '2025-01-14' },
  { id: 'o6', workshopId: 'w1', orderNumber: 'OT-2025-006', customerId: 'c2', vehicleId: 'v2', advisorId: 'u3', mechanicId: 'u4', status: 'delivered', receptionDate: '2025-01-02T09:00:00', mileage: 77500, reason: 'Alineación y balanceo', symptoms: 'Vibración en volante a alta velocidad', diagnosis: 'Alineación completa y balanceo de las 4 ruedas', estimatedDelivery: '2025-01-03', createdAt: '2025-01-02', updatedAt: '2025-01-03' },
  { id: 'o7', workshopId: 'w2', orderNumber: 'OT-2025-001', customerId: 'c5', vehicleId: 'v6', advisorId: 'u8', mechanicId: 'u8', status: 'repairing', receptionDate: '2025-01-09T10:00:00', mileage: 22000, reason: 'Cambio de kit de arrastre', symptoms: 'Cadena estirada, piñón y corona desgastados', diagnosis: 'Reemplazo completo de kit de arrastre', estimatedDelivery: '2025-01-12', createdAt: '2025-01-09', updatedAt: '2025-01-11' },
  { id: 'o8', workshopId: 'w2', orderNumber: 'OT-2025-002', customerId: 'c6', vehicleId: 'v7', advisorId: 'u8', status: 'on_hold', receptionDate: '2025-01-12T11:00:00', mileage: 8000, reason: 'Revisión de suspensión', symptoms: 'Ruido en curva, posible rodamiento dañado', diagnosis: 'Rodamiento de rueda delantera izquierda dañado. Repuesto en pedido.', estimatedDelivery: '2025-01-18', createdAt: '2025-01-12', updatedAt: '2025-01-14' },
];

export const demoDiagnostics: Diagnostic[] = [
  { id: 'd1', orderId: 'o1', workshopId: 'w1', mechanicId: 'u4', problems: 'Frenos delanteros desgastados', technicalDescription: 'Las pastillas de freno delanteras presentan desgaste superior al 80%. Los discos muestran surcos profundos que afectan la frenada.', causes: 'Desgaste natural por uso, conducción agresiva', recommendations: 'Reemplazo inmediato de pastillas y rectificado o reemplazo de discos', requiredWork: 'Cambio pastillas freno delanteros, rectificado discos', suggestedParts: 'Pastillas Brembo P83062, Discos freno Chevrolet Spark', createdAt: '2025-01-11' },
  { id: 'd2', orderId: 'o2', workshopId: 'w1', mechanicId: 'u5', problems: 'Empaque de culata deteriorado', technicalDescription: 'Se detectó fuga de refrigerante hacia la cámara de combustión. El humo blanco confirma la mezcla de agua con el aceite.', causes: 'Sobrecalentamiento previo, kilometraje alto', recommendations: 'Cambio de empaque de culata, rectificación de culata, cambio de aceite y refrigerante', requiredWork: 'Rectificación culata, cambio empaque, servicio de aceite', suggestedParts: 'Empaque culata Renault Logan, Aceite 5W30, Refrigerante', createdAt: '2025-01-12' },
  { id: 'd3', orderId: 'o3', workshopId: 'w1', mechanicId: 'u4', problems: 'Mantenimiento de 12.000 km', technicalDescription: 'Vehículo requiere mantenimiento programado. Aceite degradado, filtros saturados.', recommendations: 'Cambio de aceite sintético, filtros y bujías', requiredWork: 'Servicio completo 12K', suggestedParts: 'Aceite Motul 5W30, Filtro aceite, Filtro aire, Bujías NGK', createdAt: '2025-01-09' },
];

export const demoEstimates: Estimate[] = [
  {
    id: 'e1', orderId: 'o1', workshopId: 'w1', version: 1, status: 'approved',
    items: [
      { id: 'ei1', description: 'Pastillas de freno delanteras Brembo', type: 'part', quantity: 1, unitPrice: 180000, total: 180000, requiresAuth: true, authStatus: 'approved' },
      { id: 'ei2', description: 'Rectificado de discos de freno', type: 'service', quantity: 2, unitPrice: 75000, total: 150000, requiresAuth: true, authStatus: 'approved' },
      { id: 'ei3', description: 'Mano de obra cambio de frenos', type: 'labor', quantity: 1, unitPrice: 120000, total: 120000, requiresAuth: true, authStatus: 'approved' },
    ],
    subtotal: 450000, tax: 85500, discount: 0, total: 535500,
    notes: 'Se recomienda verificar estado de frenos traseros en próximo servicio',
    createdAt: '2025-01-11'
  },
  {
    id: 'e2', orderId: 'o2', workshopId: 'w1', version: 2, status: 'partially_approved',
    items: [
      { id: 'ei4', description: 'Rectificación de culata', type: 'service', quantity: 1, unitPrice: 350000, total: 350000, requiresAuth: true, authStatus: 'approved' },
      { id: 'ei5', description: 'Empaque de culata nuevo', type: 'part', quantity: 1, unitPrice: 180000, total: 180000, requiresAuth: true, authStatus: 'approved' },
      { id: 'ei6', description: 'Aceite motor 5W30 (4L)', type: 'part', quantity: 1, unitPrice: 220000, total: 220000, requiresAuth: true, authStatus: 'pending' },
      { id: 'ei7', description: 'Refrigerante nuevo', type: 'part', quantity: 1, unitPrice: 65000, total: 65000, requiresAuth: true, authStatus: 'pending' },
      { id: 'ei8', description: 'Mano de obra reparación motor', type: 'labor', quantity: 1, unitPrice: 450000, total: 450000, requiresAuth: true, authStatus: 'approved' },
    ],
    subtotal: 1265000, tax: 240350, discount: 50000, total: 1455350,
    notes: 'Versión 2: Se ajustó precio de mano de obra. Versión 1: Presupuesto inicial.',
    expiresAt: '2025-01-20',
    createdAt: '2025-01-13'
  },
  {
    id: 'e3', orderId: 'o3', workshopId: 'w1', version: 1, status: 'approved',
    items: [
      { id: 'ei9', description: 'Aceite sintético Motul 5W30', type: 'part', quantity: 1, unitPrice: 195000, total: 195000, requiresAuth: true, authStatus: 'approved' },
      { id: 'ei10', description: 'Filtro de aceite', type: 'part', quantity: 1, unitPrice: 35000, total: 35000, requiresAuth: false, authStatus: 'approved' },
      { id: 'ei11', description: 'Filtro de aire', type: 'part', quantity: 1, unitPrice: 45000, total: 45000, requiresAuth: false, authStatus: 'approved' },
      { id: 'ei12', description: 'Bujías NGK (4 unidades)', type: 'part', quantity: 1, unitPrice: 96000, total: 96000, requiresAuth: true, authStatus: 'approved' },
      { id: 'ei13', description: 'Mano de obra servicio 12K', type: 'labor', quantity: 1, unitPrice: 80000, total: 80000, requiresAuth: true, authStatus: 'approved' },
    ],
    subtotal: 451000, tax: 85690, discount: 0, total: 536690,
    createdAt: '2025-01-09'
  },
];

export const demoAuthorizations: Authorization[] = [
  { id: 'a1', estimateId: 'e1', itemId: 'ei1', customerId: 'c1', decision: 'approved', version: 1, createdAt: '2025-01-11T15:30:00' },
  { id: 'a2', estimateId: 'e1', itemId: 'ei2', customerId: 'c1', decision: 'approved', version: 1, createdAt: '2025-01-11T15:30:00' },
  { id: 'a3', estimateId: 'e1', itemId: 'ei3', customerId: 'c1', decision: 'approved', version: 1, createdAt: '2025-01-11T15:31:00' },
  { id: 'a4', estimateId: 'e2', itemId: 'ei4', customerId: 'c2', decision: 'approved', version: 2, createdAt: '2025-01-13T10:00:00' },
  { id: 'a5', estimateId: 'e2', itemId: 'ei5', customerId: 'c2', decision: 'approved', version: 2, createdAt: '2025-01-13T10:00:00' },
  { id: 'a6', estimateId: 'e2', itemId: 'ei8', customerId: 'c2', decision: 'approved', version: 2, createdAt: '2025-01-13T10:01:00' },
];

export const demoMessages: Message[] = [
  { id: 'm1', orderId: 'o1', workshopId: 'w1', senderId: 'u3', senderName: 'Ana López (Asesor)', content: 'Buenos días María, su vehículo ya está en diagnóstico. Le enviaremos el presupuesto hoy.', read: true, createdAt: '2025-01-11T09:00:00' },
  { id: 'm2', orderId: 'o1', workshopId: 'w1', senderId: 'c1', senderName: 'María Fernández', content: 'Muchas gracias Ana. Quedo atenta al presupuesto.', read: true, createdAt: '2025-01-11T09:15:00' },
  { id: 'm3', orderId: 'o1', workshopId: 'w1', senderId: 'u3', senderName: 'Ana López (Asesor)', content: 'El presupuesto ya fue enviado. Por favor revíselo y apruébelo desde el portal.', read: true, createdAt: '2025-01-11T14:00:00' },
  { id: 'm4', orderId: 'o2', workshopId: 'w1', senderId: 'u3', senderName: 'Ana López (Asesor)', content: 'Señor Juan, encontramos el problema. Es el empaque de la culata. Le enviamos el presupuesto actualizado.', read: false, createdAt: '2025-01-13T11:00:00' },
  { id: 'm5', orderId: 'o2', workshopId: 'w1', senderId: 'c2', senderName: 'Juan Rodríguez', content: '¿Cuánto tiempo más demora? Necesito el carro para el lunes.', read: false, createdAt: '2025-01-14T08:00:00' },
  { id: 'm6', orderId: 'o4', workshopId: 'w1', senderId: 'u3', senderName: 'Ana López (Asesor)', content: 'Señor Diego, estamos realizando el diagnóstico de su Toyota. Le informaremos pronto.', read: false, createdAt: '2025-01-13T16:00:00' },
];

export const demoNotifications: Notification[] = [
  { id: 'n1', userId: 'u2', workshopId: 'w1', title: 'Nuevo vehículo recibido', message: 'Se registró el ingreso del Mazda CX-3 (MNO345)', type: 'info', read: false, orderId: 'o5', createdAt: '2025-01-14T08:00:00' },
  { id: 'n2', userId: 'u3', workshopId: 'w1', title: 'Presupuesto pendiente', message: 'OT-2025-002 tiene conceptos pendientes de aprobación', type: 'warning', read: false, orderId: 'o2', createdAt: '2025-01-14T08:30:00' },
  { id: 'n3', userId: 'u4', workshopId: 'w1', title: 'Trabajo asignado', message: 'Se le asignó la orden OT-2025-004 para diagnóstico', type: 'info', read: true, orderId: 'o4', createdAt: '2025-01-13T14:30:00' },
  { id: 'n4', userId: 'u2', workshopId: 'w1', title: 'Vehículo listo', message: 'La Yamaha FZ 16 (GHI789) está lista para entrega', type: 'success', read: false, orderId: 'o3', createdAt: '2025-01-10T16:00:00' },
  { id: 'n5', userId: 'u3', workshopId: 'w1', title: 'Mensaje nuevo', message: 'Juan Rodríguez envió un mensaje sobre OT-2025-002', type: 'info', read: false, orderId: 'o2', createdAt: '2025-01-14T08:00:00' },
  { id: 'n6', userId: 'u2', workshopId: 'w1', title: 'Autorización recibida', message: 'María Fernández aprobó el presupuesto de OT-2025-001', type: 'success', read: true, orderId: 'o1', createdAt: '2025-01-11T15:31:00' },
];

export const demoMedia: OrderMedia[] = [
  { id: 'med1', orderId: 'o1', workshopId: 'w1', category: 'initial', url: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400', description: 'Estado inicial del vehículo', visibleToCustomer: true, uploadedBy: 'u3', createdAt: '2025-01-10' },
  { id: 'med2', orderId: 'o1', workshopId: 'w1', category: 'damage', url: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=400', description: 'Pastillas de freno desgastadas', visibleToCustomer: true, uploadedBy: 'u4', createdAt: '2025-01-11' },
  { id: 'med3', orderId: 'o1', workshopId: 'w1', category: 'process', url: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=400', description: 'Proceso de cambio de frenos', visibleToCustomer: true, uploadedBy: 'u4', createdAt: '2025-01-12' },
  { id: 'med4', orderId: 'o3', workshopId: 'w1', category: 'final', url: 'https://images.unsplash.com/photo-1487754180451-c456f719a6fc?w=400', description: 'Servicio completado', visibleToCustomer: true, uploadedBy: 'u4', createdAt: '2025-01-10' },
];

export const demoSubscriptions: Subscription[] = [
  { id: 's1', workshopId: 'w1', plan: 'pro', status: 'active', startDate: '2025-01-01', endDate: '2026-12-31', monthlyPrice: 89000 },
  { id: 's2', workshopId: 'w2', plan: 'business', status: 'active', startDate: '2025-01-01', endDate: '2026-11-30', monthlyPrice: 189000 },
  { id: 's3', workshopId: 'w3', plan: 'starter', status: 'active', startDate: '2025-01-01', endDate: '2026-12-31', monthlyPrice: 0 },
];

export const demoEvents: OrderEvent[] = [
  { id: 'ev1', orderId: 'o1', fromStatus: 'received', toStatus: 'diagnosing', changedBy: 'u3', createdAt: '2025-01-10T10:00:00' },
  { id: 'ev2', orderId: 'o1', fromStatus: 'diagnosing', toStatus: 'awaiting_approval', changedBy: 'u4', createdAt: '2025-01-11T14:00:00' },
  { id: 'ev3', orderId: 'o1', fromStatus: 'awaiting_approval', toStatus: 'authorized', changedBy: 'u3', createdAt: '2025-01-11T15:31:00' },
  { id: 'ev4', orderId: 'o1', fromStatus: 'authorized', toStatus: 'repairing', changedBy: 'u4', createdAt: '2025-01-12T08:00:00' },
  { id: 'ev5', orderId: 'o3', fromStatus: 'received', toStatus: 'diagnosing', changedBy: 'u3', createdAt: '2025-01-08T11:00:00' },
  { id: 'ev6', orderId: 'o3', fromStatus: 'diagnosing', toStatus: 'authorized', changedBy: 'u3', createdAt: '2025-01-09T09:00:00' },
  { id: 'ev7', orderId: 'o3', fromStatus: 'authorized', toStatus: 'repairing', changedBy: 'u4', createdAt: '2025-01-09T10:00:00' },
  { id: 'ev8', orderId: 'o3', fromStatus: 'repairing', toStatus: 'testing', changedBy: 'u4', createdAt: '2025-01-10T14:00:00' },
  { id: 'ev9', orderId: 'o3', fromStatus: 'testing', toStatus: 'ready', changedBy: 'u4', createdAt: '2025-01-10T16:00:00' },
];

export const demoAuditLogs: AuditLog[] = [
  { id: 'al1', userId: 'u2', userName: 'Roberto Martínez', workshopId: 'w1', action: 'CREATE', entity: 'workshop', entityId: 'w1', details: 'Taller creado', createdAt: '2024-01-15T10:00:00' },
  { id: 'al2', userId: 'u3', userName: 'Ana López', workshopId: 'w1', action: 'CREATE', entity: 'order', entityId: 'o1', details: 'Orden OT-2025-001 creada', createdAt: '2025-01-10T08:30:00' },
  { id: 'al3', userId: 'u1', userName: 'Carlos Administrador', workshopId: 'w1', action: 'UPDATE', entity: 'subscription', entityId: 's1', details: 'Plan actualizado a Pro', createdAt: '2025-01-01T00:00:00' },
];

export const statusLabels: Record<string, string> = {
  received: 'Recibido',
  diagnosing: 'En diagnóstico',
  awaiting_approval: 'Esperando aprobación',
  authorized: 'Autorizado',
  repairing: 'En reparación',
  on_hold: 'En espera',
  testing: 'En pruebas',
  ready: 'Listo para entregar',
  delivered: 'Entregado',
  cancelled: 'Cancelado',
};

export const statusColors: Record<string, string> = {
  received: 'bg-blue-100 text-blue-800',
  diagnosing: 'bg-purple-100 text-purple-800',
  awaiting_approval: 'bg-yellow-100 text-yellow-800',
  authorized: 'bg-green-100 text-green-800',
  repairing: 'bg-orange-100 text-orange-800',
  on_hold: 'bg-gray-100 text-gray-800',
  testing: 'bg-indigo-100 text-indigo-800',
  ready: 'bg-emerald-100 text-emerald-800',
  delivered: 'bg-teal-100 text-teal-800',
  cancelled: 'bg-red-100 text-red-800',
};

export const planInfo = {
  starter: { name: 'Plan Starter', price: 0, maxOrders: 10, maxUsers: 1, features: ['Máximo 10 órdenes/mes', '1 usuario (solo dueño)', 'Solo texto en evidencias', 'Recordatorios manuales', 'Soporte comunidad'] },
  pro: { name: 'Plan Pro', price: 89000, maxOrders: -1, maxUsers: 5, features: ['Órdenes ilimitadas', 'Hasta 5 usuarios', 'Comparativa Original vs Homologado', 'Fotos y videos', 'Recordatorios automáticos', 'Soporte prioritario'] },
  business: { name: 'Plan Business', price: 189000, maxOrders: -1, maxUsers: -1, features: ['Órdenes ilimitadas + múltiples sedes', 'Usuarios ilimitados + roles', 'Comparativa Original vs Homologado', 'Fotos, videos y almacenamiento extendido', 'Recordatorios avanzados + campañas', 'Soporte dedicado + onboarding'] },
};

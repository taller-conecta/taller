import { useStore } from '../../store';
import { statusLabels, statusColors } from '../../data/demo';
import { ClipboardList, Car, Users, AlertTriangle, CheckCircle, Clock, TrendingUp, Package } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { currentUser, currentWorkshop, orders, customers, vehicles, notifications } = useStore();
  if (!currentWorkshop) return null;

  const workshopOrders = orders.filter(o => o.workshopId === currentWorkshop.id);
  const activeOrders = workshopOrders.filter(o => !['delivered', 'cancelled'].includes(o.status));
  const todayOrders = workshopOrders.filter(o => o.receptionDate.startsWith(new Date().toISOString().split('T')[0]));
  const diagnosing = workshopOrders.filter(o => o.status === 'diagnosing');
  const awaitingApproval = workshopOrders.filter(o => o.status === 'awaiting_approval');
  const repairing = workshopOrders.filter(o => o.status === 'repairing');
  const onHold = workshopOrders.filter(o => o.status === 'on_hold');
  const ready = workshopOrders.filter(o => o.status === 'ready');
  const delivered = workshopOrders.filter(o => o.status === 'delivered');

  const stats = [
    { label: 'Órdenes activas', value: activeOrders.length, icon: ClipboardList, color: 'bg-blue-500', link: '/taller/ordenes' },
    { label: 'En diagnóstico', value: diagnosing.length, icon: Clock, color: 'bg-purple-500', link: '/taller/ordenes' },
    { label: 'Aprobaciones pendientes', value: awaitingApproval.length, icon: AlertTriangle, color: 'bg-yellow-500', link: '/taller/ordenes' },
    { label: 'En reparación', value: repairing.length, icon: TrendingUp, color: 'bg-orange-500', link: '/taller/ordenes' },
    { label: 'En espera', value: onHold.length, icon: Package, color: 'bg-gray-500', link: '/taller/ordenes' },
    { label: 'Listos para entregar', value: ready.length, icon: CheckCircle, color: 'bg-emerald-500', link: '/taller/ordenes' },
    { label: 'Entregados', value: delivered.length, icon: CheckCircle, color: 'bg-teal-500', link: '/taller/ordenes' },
    { label: 'Clientes activos', value: customers.filter(c => c.workshopId === currentWorkshop.id && c.active).length, icon: Users, color: 'bg-indigo-500', link: '/taller/clientes' },
  ];

  const recentOrders = [...workshopOrders].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)).slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-6 text-white">
        <h1 className="text-2xl font-bold">¡Buen día, {currentUser?.name.split(' ')[0]}!</h1>
        <p className="text-blue-100 mt-1">Bienvenido a {currentWorkshop.name}. Aquí tienes el resumen de hoy.</p>
        <div className="flex gap-3 mt-4">
          <Link to="/taller/ordenes/nueva" className="px-4 py-2 bg-white text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-50 transition-colors">+ Nueva orden</Link>
          <Link to="/taller/clientes" className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-400 transition-colors">Ver clientes</Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <Link key={i} to={stat.link} className="bg-white rounded-xl p-4 border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className={`w-10 h-10 rounded-lg ${stat.color} flex items-center justify-center`}>
                <stat.icon className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-bold text-gray-800">{stat.value}</span>
            </div>
            <p className="text-sm text-gray-500 mt-2">{stat.label}</p>
          </Link>
        ))}
      </div>

      {/* Recent Activity & Quick Actions */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <h3 className="font-semibold text-gray-800 mb-4">Actividad reciente</h3>
          {recentOrders.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-8">No hay órdenes registradas aún</p>
          ) : (
            <div className="space-y-3">
              {recentOrders.map(order => {
                const customer = customers.find(c => c.id === order.customerId);
                const vehicle = vehicles.find(v => v.id === order.vehicleId);
                return (
                  <Link key={order.id} to={`/taller/ordenes/${order.id}`} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <div>
                      <p className="text-sm font-medium text-gray-800">{order.orderNumber}</p>
                      <p className="text-xs text-gray-500">{customer?.name} • {vehicle?.brand} {vehicle?.model}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full font-medium ${statusColors[order.status]}`}>
                      {statusLabels[order.status]}
                    </span>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* Quick Stats */}
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <h3 className="font-semibold text-gray-800 mb-4">Resumen operativo</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Órdenes este mes</span>
                <span className="font-medium">{workshopOrders.length}</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${Math.min(100, (workshopOrders.length / 30) * 100)}%` }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Tasa de aprobación</span>
                <span className="font-medium">{workshopOrders.length > 0 ? Math.round((delivered.length / workshopOrders.length) * 100) : 0}%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: `${workshopOrders.length > 0 ? (delivered.length / workshopOrders.length) * 100 : 0}%` }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Vehículos registrados</span>
                <span className="font-medium">{vehicles.filter(v => v.workshopId === currentWorkshop.id).length}</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div className="bg-purple-500 h-2 rounded-full" style={{ width: `${Math.min(100, (vehicles.filter(v => v.workshopId === currentWorkshop.id).length / 20) * 100)}%` }} />
              </div>
            </div>
            <div className="pt-3 border-t border-gray-100">
              <p className="text-xs text-gray-500">
                <AlertTriangle className="w-3 h-3 inline mr-1 text-yellow-500" />
                {awaitingApproval.length} presupuesto(s) pendiente(s) de aprobación del cliente
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

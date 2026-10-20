import { useStore } from '../../store';
import { Building2, Users, CreditCard, TrendingUp, Activity } from 'lucide-react';

export default function AdminDashboard() {
  const { workshops, users, customers, orders, subscriptions } = useStore();

  const activeWorkshops = workshops.filter(w => w.active);
  const totalUsers = users.filter(u => u.active);
  const totalOrders = orders.length;
  const totalRevenue = subscriptions.filter(s => s.status === 'active').reduce((acc, s) => acc + s.monthlyPrice, 0);
  const formatCOP = (n: number) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(n);

  const stats = [
    { label: 'Talleres activos', value: activeWorkshops.length, icon: Building2, color: 'bg-blue-500' },
    { label: 'Usuarios registrados', value: totalUsers.length, icon: Users, color: 'bg-green-500' },
    { label: 'Órdenes totales', value: totalOrders, icon: Activity, color: 'bg-purple-500' },
    { label: 'Ingreso mensual', value: formatCOP(totalRevenue), icon: CreditCard, color: 'bg-orange-500' },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl p-6 text-white">
        <h1 className="text-2xl font-bold">Panel de Administración</h1>
        <p className="text-slate-300 mt-1">Resumen general de la plataforma Taller Conecta</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white rounded-xl p-4 border border-gray-100">
            <div className="flex items-center justify-between">
              <div className={`w-10 h-10 rounded-lg ${stat.color} flex items-center justify-center`}>
                <stat.icon className="w-5 h-5 text-white" />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-800 mt-3">{stat.value}</p>
            <p className="text-sm text-gray-500">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Workshops */}
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <h3 className="font-semibold text-gray-800 mb-4">Talleres registrados</h3>
          <div className="space-y-3">
            {workshops.map(w => (
              <div key={w.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-800">{w.name}</p>
                  <p className="text-xs text-gray-500">{w.city} • {w.nit}</p>
                </div>
                <div className="text-right">
                  <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${w.active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{w.active ? 'Activo' : 'Inactivo'}</span>
                  <p className="text-xs text-gray-500 mt-1 capitalize">{w.plan}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Plan distribution */}
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <h3 className="font-semibold text-gray-800 mb-4">Distribución por plan</h3>
          <div className="space-y-4">
            {(['starter', 'pro', 'business'] as const).map(plan => {
              const count = workshops.filter(w => w.plan === plan).length;
              const pct = workshops.length > 0 ? (count / workshops.length) * 100 : 0;
              return (
                <div key={plan}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600 capitalize">{plan}</span>
                    <span className="font-medium">{count} talleres</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2.5">
                    <div className={`h-2.5 rounded-full ${plan === 'starter' ? 'bg-gray-400' : plan === 'pro' ? 'bg-blue-500' : 'bg-purple-500'}`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 pt-4 border-t border-gray-100">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Actividad reciente</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <TrendingUp className="w-4 h-4 text-green-500" />
                <span>AutoServicio Bogotá actualizó a Plan Pro</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Building2 className="w-4 h-4 text-blue-500" />
                <span>Taller Express Cali se registró</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Users className="w-4 h-4 text-purple-500" />
                <span>MotoTech Medellín agregó 2 usuarios</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

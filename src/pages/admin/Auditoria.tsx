import { useStore } from '../../store';
import { Shield, Clock } from 'lucide-react';

export default function Auditoria() {
  const { events, orders, users, customers } = useStore();

  const allEvents = [...events].sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  const statusLabels: Record<string, string> = {
    received: 'Recibido', diagnosing: 'En diagnóstico', awaiting_approval: 'Esperando aprobación',
    authorized: 'Autorizado', repairing: 'En reparación', on_hold: 'En espera',
    testing: 'En pruebas', ready: 'Listo', delivered: 'Entregado', cancelled: 'Cancelado'
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Auditoría</h1>
        <p className="text-sm text-gray-500">Historial de cambios de estado en órdenes de servicio</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Fecha</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Orden</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Transición</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 hidden md:table-cell">Responsable</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 hidden lg:table-cell">Motivo</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {allEvents.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-12 text-gray-500">No hay eventos registrados</td></tr>
              ) : allEvents.map(ev => {
                const order = orders.find(o => o.id === ev.orderId);
                const user = users.find(u => u.id === ev.changedBy);
                return (
                  <tr key={ev.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-600 text-xs">{new Date(ev.createdAt).toLocaleString('es-CO')}</td>
                    <td className="px-4 py-3 font-medium text-gray-800">{order?.orderNumber || 'N/A'}</td>
                    <td className="px-4 py-3">
                      <span className="text-xs text-gray-500">{statusLabels[ev.fromStatus]}</span>
                      <span className="mx-1 text-gray-400">→</span>
                      <span className="text-xs font-medium text-gray-700">{statusLabels[ev.toStatus]}</span>
                    </td>
                    <td className="px-4 py-3 text-gray-600 hidden md:table-cell">{user?.name || 'Sistema'}</td>
                    <td className="px-4 py-3 text-gray-500 text-xs hidden lg:table-cell">{ev.reason || '—'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <Clock className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{allEvents.length}</p>
              <p className="text-xs text-gray-500">Total de eventos</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
              <Shield className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{orders.filter(o => o.status === 'delivered').length}</p>
              <p className="text-xs text-gray-500">Órdenes completadas</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
              <Clock className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{orders.filter(o => !['delivered', 'cancelled'].includes(o.status)).length}</p>
              <p className="text-xs text-gray-500">Órdenes en proceso</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

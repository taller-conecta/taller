import { useStore } from '../../store';
import { statusLabels } from '../../data/demo';
import { Link } from 'react-router-dom';
import { FileText, Eye } from 'lucide-react';

export default function Presupuestos() {
  const { currentWorkshop, estimates, orders, customers, vehicles } = useStore();
  if (!currentWorkshop) return null;

  const workshopEstimates = estimates.filter(e => e.workshopId === currentWorkshop.id).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  const formatCOP = (n: number) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(n);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Presupuestos</h1>
        <p className="text-sm text-gray-500">{workshopEstimates.length} presupuestos registrados</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Orden</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Cliente</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 hidden md:table-cell">Versión</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Estado</th>
                <th className="text-right px-4 py-3 font-medium text-gray-600">Total</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 hidden lg:table-cell">Fecha</th>
                <th className="text-right px-4 py-3 font-medium text-gray-600">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {workshopEstimates.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-12 text-gray-500">No hay presupuestos</td></tr>
              ) : workshopEstimates.map(est => {
                const order = orders.find(o => o.id === est.orderId);
                const customer = order ? customers.find(c => c.id === order.customerId) : null;
                return (
                  <tr key={est.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-800">{order?.orderNumber}</td>
                    <td className="px-4 py-3 text-gray-600">{customer?.name}</td>
                    <td className="px-4 py-3 text-gray-600 hidden md:table-cell">v{est.version}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 text-xs rounded-full font-medium ${est.status === 'approved' ? 'bg-green-100 text-green-700' : est.status === 'partially_approved' ? 'bg-yellow-100 text-yellow-700' : est.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'}`}>
                        {est.status === 'approved' ? 'Aprobado' : est.status === 'partially_approved' ? 'Parcial' : est.status === 'rejected' ? 'Rechazado' : est.status === 'sent' ? 'Enviado' : 'Borrador'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-medium text-gray-800">{formatCOP(est.total)}</td>
                    <td className="px-4 py-3 text-gray-500 text-xs hidden lg:table-cell">{new Date(est.createdAt).toLocaleDateString('es-CO')}</td>
                    <td className="px-4 py-3 text-right">
                      <Link to={`/taller/ordenes/${est.orderId}`} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg inline-block"><Eye className="w-4 h-4" /></Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

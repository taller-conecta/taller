import { useState } from 'react';
import { useStore } from '../../store';
import { statusLabels, statusColors } from '../../data/demo';
import { Plus, Search, Filter, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { OrderStatus } from '../../types';

export default function Ordenes() {
  const { currentWorkshop, orders, customers, vehicles, users, addOrder } = useStore();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ customerId: '', vehicleId: '', reason: '', symptoms: '', visibleDamage: '', estimatedDelivery: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!currentWorkshop) return null;

  const workshopOrders = orders.filter(o => o.workshopId === currentWorkshop.id);
  const workshopCustomers = customers.filter(c => c.workshopId === currentWorkshop.id && c.active);
  const workshopVehicles = vehicles.filter(v => v.workshopId === currentWorkshop.id);
  const advisors = users.filter(u => u.workshopId === currentWorkshop.id && (u.role === 'advisor' || u.role === 'owner'));

  const filtered = workshopOrders.filter(o => {
    const customer = customers.find(c => c.id === o.customerId);
    const vehicle = vehicles.find(v => v.id === o.vehicleId);
    const matchSearch = o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      customer?.name.toLowerCase().includes(search.toLowerCase()) ||
      vehicle?.plate.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || o.status === statusFilter;
    return matchSearch && matchStatus;
  }).sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  const openNew = () => {
    setForm({ customerId: workshopCustomers[0]?.id || '', vehicleId: '', reason: '', symptoms: '', visibleDamage: '', estimatedDelivery: '' });
    setErrors({});
    setShowModal(true);
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.customerId) e.customerId = 'Seleccione un cliente';
    if (!form.vehicleId) e.vehicleId = 'Seleccione un vehículo';
    if (!form.reason.trim()) e.reason = 'Motivo requerido';
    if (!form.symptoms.trim()) e.symptoms = 'Síntomas requeridos';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    const vehicle = vehicles.find(v => v.id === form.vehicleId);
    addOrder({
      workshopId: currentWorkshop.id,
      customerId: form.customerId,
      vehicleId: form.vehicleId,
      advisorId: advisors[0]?.id || '',
      status: 'received',
      receptionDate: new Date().toISOString(),
      mileage: vehicle?.mileage || 0,
      reason: form.reason,
      symptoms: form.symptoms,
      visibleDamage: form.visibleDamage,
      estimatedDelivery: form.estimatedDelivery,
    });
    setShowModal(false);
  };

  const customerVehicles = workshopVehicles.filter(v => v.customerId === form.customerId);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Órdenes de Servicio</h1>
          <p className="text-sm text-gray-500">{workshopOrders.length} órdenes registradas</p>
        </div>
        <button onClick={openNew} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
          <Plus className="w-4 h-4" /> Nueva orden
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" placeholder="Buscar por orden, cliente o placa..." />
        </div>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
          <option value="all">Todos los estados</option>
          {Object.entries(statusLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Orden</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Cliente</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 hidden md:table-cell">Vehículo</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 hidden lg:table-cell">Fecha</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Estado</th>
                <th className="text-right px-4 py-3 font-medium text-gray-600">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-12 text-gray-500">No se encontraron órdenes</td></tr>
              ) : filtered.map(o => {
                const customer = customers.find(c => c.id === o.customerId);
                const vehicle = vehicles.find(v => v.id === o.vehicleId);
                return (
                  <tr key={o.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-800">{o.orderNumber}</p>
                      <p className="text-xs text-gray-500">{o.reason}</p>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{customer?.name}</td>
                    <td className="px-4 py-3 text-gray-600 hidden md:table-cell">
                      <p>{vehicle?.brand} {vehicle?.model}</p>
                      <p className="text-xs text-gray-500">{vehicle?.plate}</p>
                    </td>
                    <td className="px-4 py-3 text-gray-600 hidden lg:table-cell text-xs">{new Date(o.receptionDate).toLocaleDateString('es-CO')}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 text-xs rounded-full font-medium ${statusColors[o.status]}`}>{statusLabels[o.status]}</span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link to={`/taller/ordenes/${o.id}`} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg inline-block"><Eye className="w-4 h-4" /></Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl max-h-[90vh] overflow-auto">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-800">Nueva orden de servicio</h3>
              <button onClick={() => setShowModal(false)} className="p-1 hover:bg-gray-100 rounded-lg text-gray-400">✕</button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cliente *</label>
                <select value={form.customerId} onChange={e => setForm({ ...form, customerId: e.target.value, vehicleId: '' })} className={`w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500 ${errors.customerId ? 'border-red-300' : 'border-gray-200'}`}>
                  <option value="">Seleccionar cliente</option>
                  {workshopCustomers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
                {errors.customerId && <p className="text-xs text-red-500 mt-1">{errors.customerId}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Vehículo *</label>
                <select value={form.vehicleId} onChange={e => setForm({ ...form, vehicleId: e.target.value })} className={`w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500 ${errors.vehicleId ? 'border-red-300' : 'border-gray-200'}`}>
                  <option value="">Seleccionar vehículo</option>
                  {customerVehicles.map(v => <option key={v.id} value={v.id}>{v.plate} - {v.brand} {v.model}</option>)}
                </select>
                {errors.vehicleId && <p className="text-xs text-red-500 mt-1">{errors.vehicleId}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Motivo de ingreso *</label>
                <input value={form.reason} onChange={e => setForm({ ...form, reason: e.target.value })} className={`w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500 ${errors.reason ? 'border-red-300' : 'border-gray-200'}`} placeholder="Ej: Mantenimiento preventivo" />
                {errors.reason && <p className="text-xs text-red-500 mt-1">{errors.reason}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Síntomas reportados *</label>
                <textarea value={form.symptoms} onChange={e => setForm({ ...form, symptoms: e.target.value })} className={`w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500 ${errors.symptoms ? 'border-red-300' : 'border-gray-200'}`} rows={3} placeholder="Describa los síntomas informados por el cliente" />
                {errors.symptoms && <p className="text-xs text-red-500 mt-1">{errors.symptoms}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Daños visibles</label>
                <textarea value={form.visibleDamage} onChange={e => setForm({ ...form, visibleDamage: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" rows={2} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fecha estimada de entrega</label>
                <input type="date" value={form.estimatedDelivery} onChange={e => setForm({ ...form, estimatedDelivery: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>
            <div className="flex justify-end gap-3 p-5 border-t border-gray-100">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg">Cancelar</button>
              <button onClick={handleSave} className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700">Crear orden</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

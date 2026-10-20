import { useState } from 'react';
import { useStore } from '../../store';
import { Plus, Search, Edit2, Trash2, X, Car, Phone, Mail, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Clientes() {
  const { currentWorkshop, customers, vehicles, orders, addCustomer, updateCustomer, deleteCustomer } = useStore();
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', document: '', email: '', phone: '', address: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!currentWorkshop) return null;

  const workshopCustomers = customers.filter(c => c.workshopId === currentWorkshop.id && c.active);
  const filtered = workshopCustomers.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.document.includes(search) ||
    c.email.toLowerCase().includes(search.toLowerCase()) ||
    c.phone.includes(search)
  );

  const openNew = () => { setForm({ name: '', document: '', email: '', phone: '', address: '' }); setEditId(null); setErrors({}); setShowModal(true); };
  const openEdit = (id: string) => {
    const c = customers.find(x => x.id === id);
    if (c) { setForm({ name: c.name, document: c.document, email: c.email, phone: c.phone, address: c.address || '' }); setEditId(id); setErrors({}); setShowModal(true); }
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Nombre requerido';
    if (!form.document.trim()) e.document = 'Documento requerido';
    if (!form.email.trim()) e.email = 'Email requerido';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Email inválido';
    if (!form.phone.trim()) e.phone = 'Teléfono requerido';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    if (editId) {
      updateCustomer(editId, form);
    } else {
      addCustomer({ ...form, workshopId: currentWorkshop.id, active: true });
    }
    setShowModal(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('¿Está seguro de desactivar este cliente?')) deleteCustomer(id);
  };

  const getCustomerOrders = (customerId: string) => orders.filter(o => o.customerId === customerId && o.workshopId === currentWorkshop.id);
  const getCustomerVehicles = (customerId: string) => vehicles.filter(v => v.customerId === customerId && v.workshopId === currentWorkshop.id);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Clientes</h1>
          <p className="text-sm text-gray-500">{workshopCustomers.length} clientes registrados</p>
        </div>
        <button onClick={openNew} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
          <Plus className="w-4 h-4" /> Nuevo cliente
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" placeholder="Buscar por nombre, documento, email o teléfono..." />
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Nombre</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 hidden md:table-cell">Documento</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 hidden lg:table-cell">Contacto</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 hidden lg:table-cell">Vehículos</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Órdenes</th>
                <th className="text-right px-4 py-3 font-medium text-gray-600">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-12 text-gray-500">No se encontraron clientes</td></tr>
              ) : filtered.map(c => (
                <tr key={c.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-800">{c.name}</p>
                    <p className="text-xs text-gray-500 md:hidden">{c.document}</p>
                  </td>
                  <td className="px-4 py-3 text-gray-600 hidden md:table-cell">{c.document}</td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    <div className="flex items-center gap-1 text-gray-600"><Phone className="w-3 h-3" /> {c.phone}</div>
                    <div className="flex items-center gap-1 text-gray-500 text-xs mt-0.5"><Mail className="w-3 h-3" /> {c.email}</div>
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    <span className="inline-flex items-center gap-1 text-sm text-gray-600"><Car className="w-3 h-3" /> {getCustomerVehicles(c.id).length}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full font-medium">{getCustomerOrders(c.id).length} órdenes</span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => openEdit(c.id)} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><Edit2 className="w-4 h-4" /></button>
                    <button onClick={() => handleDelete(c.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors ml-1"><Trash2 className="w-4 h-4" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-800">{editId ? 'Editar cliente' : 'Nuevo cliente'}</h3>
              <button onClick={() => setShowModal(false)} className="p-1 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre completo *</label>
                <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className={`w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500 ${errors.name ? 'border-red-300' : 'border-gray-200'}`} />
                {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Documento *</label>
                  <input value={form.document} onChange={e => setForm({ ...form, document: e.target.value })} className={`w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500 ${errors.document ? 'border-red-300' : 'border-gray-200'}`} />
                  {errors.document && <p className="text-xs text-red-500 mt-1">{errors.document}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono *</label>
                  <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className={`w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500 ${errors.phone ? 'border-red-300' : 'border-gray-200'}`} />
                  {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Correo electrónico *</label>
                <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className={`w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500 ${errors.email ? 'border-red-300' : 'border-gray-200'}`} />
                {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
                <input value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>
            <div className="flex justify-end gap-3 p-5 border-t border-gray-100">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg">Cancelar</button>
              <button onClick={handleSave} className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700">Guardar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

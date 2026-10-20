import { useState } from 'react';
import { useStore } from '../../store';
import { Plus, Search, Edit2, Trash2, X, Car, Bike } from 'lucide-react';

export default function Vehiculos() {
  const { currentWorkshop, vehicles, customers, addVehicle, updateVehicle, deleteVehicle } = useStore();
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<{ customerId: string; type: 'car' | 'motorcycle' | 'other'; plate: string; brand: string; model: string; year: number; color: string; mileage: number; notes: string }>({ customerId: '', type: 'car', plate: '', brand: '', model: '', year: 2024, color: '', mileage: 0, notes: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!currentWorkshop) return null;

  const workshopVehicles = vehicles.filter(v => v.workshopId === currentWorkshop.id);
  const workshopCustomers = customers.filter(c => c.workshopId === currentWorkshop.id && c.active);
  const filtered = workshopVehicles.filter(v =>
    v.plate.toLowerCase().includes(search.toLowerCase()) ||
    v.brand.toLowerCase().includes(search.toLowerCase()) ||
    v.model.toLowerCase().includes(search.toLowerCase()) ||
    customers.find(c => c.id === v.customerId)?.name.toLowerCase().includes(search.toLowerCase())
  );

  const openNew = () => { setForm({ customerId: workshopCustomers[0]?.id || '', type: 'car', plate: '', brand: '', model: '', year: 2024, color: '', mileage: 0, notes: '' }); setEditId(null); setErrors({}); setShowModal(true); };
  const openEdit = (id: string) => {
    const v = vehicles.find(x => x.id === id);
    if (v) { setForm({ customerId: v.customerId, type: v.type, plate: v.plate, brand: v.brand, model: v.model, year: v.year, color: v.color, mileage: v.mileage, notes: v.notes || '' }); setEditId(id); setErrors({}); setShowModal(true); }
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.customerId) e.customerId = 'Seleccione un cliente';
    if (!form.plate.trim()) e.plate = 'Placa requerida';
    if (!form.brand.trim()) e.brand = 'Marca requerida';
    if (!form.model.trim()) e.model = 'Modelo requerido';
    if (!form.color.trim()) e.color = 'Color requerido';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    if (editId) {
      updateVehicle(editId, form);
    } else {
      addVehicle({ ...form, workshopId: currentWorkshop.id });
    }
    setShowModal(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('¿Eliminar este vehículo?')) deleteVehicle(id);
  };

  const getCustomerName = (id: string) => customers.find(c => c.id === id)?.name || 'N/A';

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Vehículos</h1>
          <p className="text-sm text-gray-500">{workshopVehicles.length} vehículos registrados</p>
        </div>
        <button onClick={openNew} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
          <Plus className="w-4 h-4" /> Nuevo vehículo
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" placeholder="Buscar por placa, marca, modelo o cliente..." />
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.length === 0 ? (
          <div className="col-span-full text-center py-12 text-gray-500 bg-white rounded-xl border border-gray-100">No se encontraron vehículos</div>
        ) : filtered.map(v => (
          <div key={v.id} className="bg-white rounded-xl border border-gray-100 p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${v.type === 'motorcycle' ? 'bg-orange-100' : 'bg-blue-100'}`}>
                  {v.type === 'motorcycle' ? <Bike className="w-5 h-5 text-orange-600" /> : <Car className="w-5 h-5 text-blue-600" />}
                </div>
                <div>
                  <p className="font-bold text-gray-800">{v.plate}</p>
                  <p className="text-xs text-gray-500">{v.brand} {v.model} ({v.year})</p>
                </div>
              </div>
              <div className="flex gap-1">
                <button onClick={() => openEdit(v.id)} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"><Edit2 className="w-3.5 h-3.5" /></button>
                <button onClick={() => handleDelete(v.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-gray-50 space-y-1">
              <p className="text-xs text-gray-500"><span className="font-medium">Propietario:</span> {getCustomerName(v.customerId)}</p>
              <p className="text-xs text-gray-500"><span className="font-medium">Color:</span> {v.color}</p>
              <p className="text-xs text-gray-500"><span className="font-medium">Kilometraje:</span> {v.mileage.toLocaleString()} km</p>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl max-h-[90vh] overflow-auto">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-800">{editId ? 'Editar vehículo' : 'Nuevo vehículo'}</h3>
              <button onClick={() => setShowModal(false)} className="p-1 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cliente propietario *</label>
                <select value={form.customerId} onChange={e => setForm({ ...form, customerId: e.target.value })} className={`w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500 ${errors.customerId ? 'border-red-300' : 'border-gray-200'}`}>
                  <option value="">Seleccionar cliente</option>
                  {workshopCustomers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
                {errors.customerId && <p className="text-xs text-red-500 mt-1">{errors.customerId}</p>}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tipo *</label>
                  <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value as any })} className="w-full px-3 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="car">Carro</option>
                    <option value="motorcycle">Motocicleta</option>
                    <option value="other">Otro</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Placa *</label>
                  <input value={form.plate} onChange={e => setForm({ ...form, plate: e.target.value.toUpperCase() })} className={`w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500 ${errors.plate ? 'border-red-300' : 'border-gray-200'}`} />
                  {errors.plate && <p className="text-xs text-red-500 mt-1">{errors.plate}</p>}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Marca *</label>
                  <input value={form.brand} onChange={e => setForm({ ...form, brand: e.target.value })} className={`w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500 ${errors.brand ? 'border-red-300' : 'border-gray-200'}`} />
                  {errors.brand && <p className="text-xs text-red-500 mt-1">{errors.brand}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Modelo *</label>
                  <input value={form.model} onChange={e => setForm({ ...form, model: e.target.value })} className={`w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500 ${errors.model ? 'border-red-300' : 'border-gray-200'}`} />
                  {errors.model && <p className="text-xs text-red-500 mt-1">{errors.model}</p>}
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Año</label>
                  <input type="number" value={form.year} onChange={e => setForm({ ...form, year: parseInt(e.target.value) || 2024 })} className="w-full px-3 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Color *</label>
                  <input value={form.color} onChange={e => setForm({ ...form, color: e.target.value })} className={`w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500 ${errors.color ? 'border-red-300' : 'border-gray-200'}`} />
                  {errors.color && <p className="text-xs text-red-500 mt-1">{errors.color}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Kilometraje</label>
                  <input type="number" value={form.mileage} onChange={e => setForm({ ...form, mileage: parseInt(e.target.value) || 0 })} className="w-full px-3 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Observaciones</label>
                <textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" rows={2} />
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

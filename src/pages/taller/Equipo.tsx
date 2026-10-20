import { useState } from 'react';
import { useStore } from '../../store';
import { Plus, X, Shield, UserCheck, UserX } from 'lucide-react';
import { Role } from '../../types';

export default function Equipo() {
  const { currentWorkshop, users, addUser, toggleUserActive, currentUser } = useStore();
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', role: 'advisor' as Role });
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!currentWorkshop) return null;

  const workshopUsers = users.filter(u => u.workshopId === currentWorkshop.id);
  const canManage = currentUser?.role === 'owner' || currentUser?.role === 'admin';

  const roleLabels: Record<string, string> = { owner: 'Propietario', advisor: 'Asesor', mechanic: 'Mecánico', customer: 'Cliente', admin: 'Administrador' };
  const roleColors: Record<string, string> = { owner: 'bg-purple-100 text-purple-700', advisor: 'bg-blue-100 text-blue-700', mechanic: 'bg-orange-100 text-orange-700', customer: 'bg-green-100 text-green-700', admin: 'bg-red-100 text-red-700' };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Nombre requerido';
    if (!form.email.trim()) e.email = 'Email requerido';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Email inválido';
    if (!form.password || form.password.length < 6) e.password = 'Mínimo 6 caracteres';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    addUser({ ...form, workshopId: currentWorkshop.id, active: true });
    setShowModal(false);
    setForm({ name: '', email: '', password: '', phone: '', role: 'advisor' });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Equipo</h1>
          <p className="text-sm text-gray-500">{workshopUsers.length} miembros</p>
        </div>
        {canManage && (
          <button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
            <Plus className="w-4 h-4" /> Invitar miembro
          </button>
        )}
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {workshopUsers.map(u => (
          <div key={u.id} className="bg-white rounded-xl border border-gray-100 p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-medium">{u.name.charAt(0)}</div>
                <div>
                  <p className="font-medium text-gray-800">{u.name}</p>
                  <p className="text-xs text-gray-500">{u.email}</p>
                </div>
              </div>
              {canManage && u.id !== currentUser?.id && (
                <button onClick={() => toggleUserActive(u.id)} className={`p-1.5 rounded-lg ${u.active ? 'text-green-500 hover:bg-green-50' : 'text-red-500 hover:bg-red-50'}`}>
                  {u.active ? <UserCheck className="w-4 h-4" /> : <UserX className="w-4 h-4" />}
                </button>
              )}
            </div>
            <div className="mt-3 flex items-center gap-2">
              <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${roleColors[u.role]}`}>{roleLabels[u.role]}</span>
              <span className={`text-xs ${u.active ? 'text-green-600' : 'text-red-600'}`}>{u.active ? 'Activo' : 'Inactivo'}</span>
            </div>
            {u.phone && <p className="text-xs text-gray-500 mt-2">📱 {u.phone}</p>}
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-800">Invitar miembro</h3>
              <button onClick={() => setShowModal(false)} className="p-1 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre completo *</label>
                <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className={`w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500 ${errors.name ? 'border-red-300' : 'border-gray-200'}`} />
                {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Correo electrónico *</label>
                <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className={`w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500 ${errors.email ? 'border-red-300' : 'border-gray-200'}`} />
                {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña *</label>
                <input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} className={`w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500 ${errors.password ? 'border-red-300' : 'border-gray-200'}`} />
                {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rol *</label>
                <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value as Role })} className="w-full px-3 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="advisor">Asesor de servicio</option>
                  <option value="mechanic">Mecánico</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-3 p-5 border-t border-gray-100">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">Cancelar</button>
              <button onClick={handleSave} className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700">Invitar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import { useStore } from '../../store';
import { Users, Shield } from 'lucide-react';

export default function AdminUsuarios() {
  const { users, workshops } = useStore();

  const roleLabels: Record<string, string> = { owner: 'Propietario', advisor: 'Asesor', mechanic: 'Mecánico', customer: 'Cliente', admin: 'Admin SaaS' };
  const roleColors: Record<string, string> = { owner: 'bg-purple-100 text-purple-700', advisor: 'bg-blue-100 text-blue-700', mechanic: 'bg-orange-100 text-orange-700', customer: 'bg-green-100 text-green-700', admin: 'bg-red-100 text-red-700' };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Usuarios</h1>
        <p className="text-sm text-gray-500">{users.length} usuarios registrados</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Usuario</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Email</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Rol</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 hidden md:table-cell">Taller</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {users.map(u => {
                const workshop = workshops.find(w => w.id === u.workshopId);
                return (
                  <tr key={u.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 text-xs font-medium">{u.name.charAt(0)}</div>
                        <span className="font-medium text-gray-800">{u.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{u.email}</td>
                    <td className="px-4 py-3"><span className={`px-2 py-0.5 text-xs rounded-full font-medium ${roleColors[u.role]}`}>{roleLabels[u.role]}</span></td>
                    <td className="px-4 py-3 text-gray-600 hidden md:table-cell">{workshop?.name || '—'}</td>
                    <td className="px-4 py-3"><span className={`text-xs font-medium ${u.active ? 'text-green-600' : 'text-red-600'}`}>{u.active ? 'Activo' : 'Inactivo'}</span></td>
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

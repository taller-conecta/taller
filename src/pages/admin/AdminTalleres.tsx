import { useStore } from '../../store';
import { Building2, ToggleLeft, ToggleRight, MapPin, Phone } from 'lucide-react';
import { PlanType } from '../../types';

export default function AdminTalleres() {
  const { workshops, users, orders, toggleWorkshopActive, updateWorkshopPlan } = useStore();

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Talleres</h1>
        <p className="text-sm text-gray-500">{workshops.length} talleres registrados</p>
      </div>

      <div className="space-y-4">
        {workshops.map(w => {
          const workshopUsers = users.filter(u => u.workshopId === w.id);
          const workshopOrders = orders.filter(o => o.workshopId === w.id);
          return (
            <div key={w.id} className="bg-white rounded-xl border border-gray-100 p-5">
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">{w.name}</h3>
                    <p className="text-sm text-gray-500">{w.nit}</p>
                    <div className="flex flex-wrap gap-3 mt-2 text-xs text-gray-500">
                      <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{w.address}, {w.city}</span>
                      <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{w.phone}</span>
                    </div>
                    <div className="flex gap-4 mt-2">
                      <span className="text-xs text-gray-500"><strong className="text-gray-700">{workshopUsers.length}</strong> usuarios</span>
                      <span className="text-xs text-gray-500"><strong className="text-gray-700">{workshopOrders.length}</strong> órdenes</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <select value={w.plan} onChange={e => updateWorkshopPlan(w.id, e.target.value as PlanType)} className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="starter">Starter</option>
                    <option value="pro">Pro</option>
                    <option value="business">Business</option>
                  </select>
                  <button onClick={() => toggleWorkshopActive(w.id)} className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium ${w.active ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-red-100 text-red-700 hover:bg-red-200'}`}>
                    {w.active ? <><ToggleRight className="w-4 h-4" /> Activo</> : <><ToggleLeft className="w-4 h-4" /> Inactivo</>}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

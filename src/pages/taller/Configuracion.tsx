import { useStore } from '../../store';
import { planInfo } from '../../data/demo';
import { Building2, CreditCard, MapPin, Phone, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Configuracion() {
  const { currentWorkshop, currentUser } = useStore();
  if (!currentWorkshop) return null;

  const plan = planInfo[currentWorkshop.plan];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Configuración</h1>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Workshop Info */}
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2"><Building2 className="w-5 h-5 text-blue-600" /> Datos del taller</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between py-2 border-b border-gray-50"><span className="text-gray-500">Nombre</span><span className="font-medium text-gray-800">{currentWorkshop.name}</span></div>
            <div className="flex justify-between py-2 border-b border-gray-50"><span className="text-gray-500">NIT</span><span className="font-medium text-gray-800">{currentWorkshop.nit}</span></div>
            <div className="flex justify-between py-2 border-b border-gray-50"><span className="text-gray-500">Dirección</span><span className="font-medium text-gray-800">{currentWorkshop.address}, {currentWorkshop.city}</span></div>
            <div className="flex justify-between py-2 border-b border-gray-50"><span className="text-gray-500">Teléfono</span><span className="font-medium text-gray-800">{currentWorkshop.phone}</span></div>
            <div className="flex justify-between py-2"><span className="text-gray-500">Email</span><span className="font-medium text-gray-800">{currentWorkshop.email}</span></div>
          </div>
        </div>

        {/* Subscription */}
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2"><CreditCard className="w-5 h-5 text-blue-600" /> Suscripción</h3>
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 mb-4">
            <p className="text-sm text-gray-500">Plan actual</p>
            <p className="text-xl font-bold text-blue-700">{plan.name}</p>
            <p className="text-sm text-gray-600 mt-1">{plan.price === 0 ? 'Gratis' : `$${plan.price.toLocaleString('es-CO')} / mes`}</p>
          </div>
          <div className="space-y-2">
            {plan.features.map((f, i) => (
              <p key={i} className="text-sm text-gray-600 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full" /> {f}
              </p>
            ))}
          </div>
          <Link to="/admin/planes" className="mt-4 block text-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">Cambiar plan</Link>
        </div>

        {/* User Info */}
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <h3 className="font-semibold text-gray-800 mb-4">Mi perfil</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between py-2 border-b border-gray-50"><span className="text-gray-500">Nombre</span><span className="font-medium text-gray-800">{currentUser?.name}</span></div>
            <div className="flex justify-between py-2 border-b border-gray-50"><span className="text-gray-500">Email</span><span className="font-medium text-gray-800">{currentUser?.email}</span></div>
            <div className="flex justify-between py-2 border-b border-gray-50"><span className="text-gray-500">Rol</span><span className="font-medium text-gray-800 capitalize">{currentUser?.role}</span></div>
            <div className="flex justify-between py-2"><span className="text-gray-500">Teléfono</span><span className="font-medium text-gray-800">{currentUser?.phone || 'No registrado'}</span></div>
          </div>
        </div>

        {/* System Info */}
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <h3 className="font-semibold text-gray-800 mb-4">Información del sistema</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between py-2 border-b border-gray-50"><span className="text-gray-500">Versión</span><span className="font-medium text-gray-800">1.0.0</span></div>
            <div className="flex justify-between py-2 border-b border-gray-50"><span className="text-gray-500">Zona horaria</span><span className="font-medium text-gray-800">America/Bogota</span></div>
            <div className="flex justify-between py-2 border-b border-gray-50"><span className="text-gray-500">Moneda</span><span className="font-medium text-gray-800">COP (Peso colombiano)</span></div>
            <div className="flex justify-between py-2"><span className="text-gray-500">Idioma</span><span className="font-medium text-gray-800">Español</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}

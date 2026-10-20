import { useStore } from '../../store';
import { planInfo } from '../../data/demo';
import { Check, Crown, Zap, Gift } from 'lucide-react';
import { PlanType } from '../../types';

export default function Planes() {
  const { currentWorkshop, updateWorkshopPlan } = useStore();
  
  const plans = [
    { key: 'starter' as PlanType, icon: Gift, color: 'from-gray-500 to-gray-600', borderColor: 'border-gray-200', popular: false },
    { key: 'pro' as PlanType, icon: Zap, color: 'from-blue-500 to-blue-600', borderColor: 'border-blue-500', popular: true },
    { key: 'business' as PlanType, icon: Crown, color: 'from-purple-500 to-purple-600', borderColor: 'border-purple-200', popular: false },
  ];

  const handleSelectPlan = (plan: PlanType) => {
    if (currentWorkshop) {
      if (confirm(`¿Desea cambiar al ${planInfo[plan].name}?`)) {
        updateWorkshopPlan(currentWorkshop.id, plan);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-800">Planes de Suscripción</h1>
        <p className="text-sm text-gray-500 mt-1">Elige el plan que mejor se adapte a tu taller</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {plans.map(p => {
          const info = planInfo[p.key];
          const isCurrent = currentWorkshop?.plan === p.key;
          return (
            <div key={p.key} className={`relative bg-white rounded-2xl border-2 ${p.popular ? 'border-blue-500 shadow-lg' : p.borderColor} p-6 flex flex-col`}>
              {p.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-blue-600 text-white text-xs rounded-full font-medium">Más popular</div>
              )}
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${p.color} flex items-center justify-center mb-4`}>
                <p.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-800">{info.name}</h3>
              <div className="mt-2 mb-4">
                {info.price === 0 ? (
                  <span className="text-3xl font-bold text-gray-800">Gratis</span>
                ) : (
                  <div>
                    <span className="text-3xl font-bold text-gray-800">${info.price.toLocaleString('es-CO')}</span>
                    <span className="text-gray-500 text-sm"> / mes</span>
                  </div>
                )}
              </div>
              <ul className="space-y-2 flex-1 mb-6">
                {info.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                    <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <button
                onClick={() => handleSelectPlan(p.key)}
                disabled={isCurrent}
                className={`w-full py-2.5 rounded-lg font-medium text-sm transition-colors ${isCurrent ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : p.popular ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                {isCurrent ? 'Plan actual' : 'Seleccionar plan'}
              </button>
            </div>
          );
        })}
      </div>

      {/* Comparison Table */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="p-5 border-b border-gray-100">
          <h3 className="font-semibold text-gray-800">Comparativa detallada</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Característica</th>
                <th className="text-center px-4 py-3 font-medium text-gray-600">🎁 Starter</th>
                <th className="text-center px-4 py-3 font-medium text-blue-600">💼 Pro</th>
                <th className="text-center px-4 py-3 font-medium text-purple-600">🏢 Business</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              <tr><td className="px-4 py-3 text-gray-700">Precio</td><td className="px-4 py-3 text-center">$0/mes</td><td className="px-4 py-3 text-center font-medium">$89.000/mes</td><td className="px-4 py-3 text-center font-medium">$189.000/mes</td></tr>
              <tr><td className="px-4 py-3 text-gray-700">Órdenes de servicio</td><td className="px-4 py-3 text-center">Máx. 10/mes</td><td className="px-4 py-3 text-center">Ilimitadas</td><td className="px-4 py-3 text-center">Ilimitadas + sedes</td></tr>
              <tr><td className="px-4 py-3 text-gray-700">Usuarios del taller</td><td className="px-4 py-3 text-center">1</td><td className="px-4 py-3 text-center">Hasta 5</td><td className="px-4 py-3 text-center">Ilimitados</td></tr>
              <tr><td className="px-4 py-3 text-gray-700">Comparativa repuestos</td><td className="px-4 py-3 text-center text-red-500">✗</td><td className="px-4 py-3 text-center text-green-500">✓</td><td className="px-4 py-3 text-center text-green-500">✓</td></tr>
              <tr><td className="px-4 py-3 text-gray-700">Evidencias multimedia</td><td className="px-4 py-3 text-center">Solo texto</td><td className="px-4 py-3 text-center">Fotos y videos</td><td className="px-4 py-3 text-center">Fotos, videos + extendido</td></tr>
              <tr><td className="px-4 py-3 text-gray-700">Recordatorios</td><td className="px-4 py-3 text-center">Manual</td><td className="px-4 py-3 text-center">Automáticos</td><td className="px-4 py-3 text-center">Avanzados + campañas</td></tr>
              <tr><td className="px-4 py-3 text-gray-700">Soporte</td><td className="px-4 py-3 text-center">Comunidad</td><td className="px-4 py-3 text-center">Prioritario chat</td><td className="px-4 py-3 text-center">Dedicado + onboarding</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

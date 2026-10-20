import { useState } from 'react';
import { useStore } from '../../store';
import { statusLabels, statusColors } from '../../data/demo';
import { Car, CheckCircle, Clock, AlertTriangle, FileText, Camera, ChevronRight, Star, Send } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AuthorizationStatus } from '../../types';

export default function PortalCliente() {
  const { currentUser, currentWorkshop, orders, vehicles, customers, estimates, media, messages, authorizeItem, addMessage } = useStore();
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [rating, setRating] = useState(0);
  const [newMessage, setNewMessage] = useState('');

  if (!currentUser) return null;

  const customer = customers.find(c => c.email === currentUser.email);
  if (!customer) return <div className="text-center py-12 text-gray-500">No se encontró información del cliente</div>;

  const customerOrders = orders.filter(o => o.customerId === customer.id).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  const customerVehicles = vehicles.filter(v => v.customerId === customer.id);
  const selectedOrder = selectedOrderId ? orders.find(o => o.id === selectedOrderId) : null;
  const selectedEstimate = selectedOrder ? estimates.find(e => e.orderId === selectedOrder.id) : null;
  const selectedMedia = selectedOrder ? media.filter(m => m.orderId === selectedOrder.id && m.visibleToCustomer) : [];
  const selectedMessages = selectedOrder ? messages.filter(m => m.orderId === selectedOrder.id).sort((a, b) => a.createdAt.localeCompare(b.createdAt)) : [];

  const formatCOP = (n: number) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(n);

  const handleAuthorize = (estimateId: string, itemId: string, decision: AuthorizationStatus, version: number) => {
    authorizeItem(estimateId, itemId, customer.id, decision, version);
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedOrderId || !currentWorkshop) return;
    addMessage({ orderId: selectedOrderId, workshopId: currentWorkshop.id, senderId: currentUser.id, senderName: currentUser.name, content: newMessage });
    setNewMessage('');
  };

  const progressSteps = ['Recibido', 'Diagnóstico', 'Aprobación', 'Reparación', 'Listo', 'Entregado'];
  const getProgressIndex = (status: string) => {
    const map: Record<string, number> = { received: 0, diagnosing: 1, awaiting_approval: 2, authorized: 2, repairing: 3, on_hold: 3, testing: 3, ready: 4, delivered: 5 };
    return map[status] ?? 0;
  };

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-6 text-white">
        <h1 className="text-2xl font-bold">¡Hola, {currentUser.name.split(' ')[0]}!</h1>
        <p className="text-blue-100 mt-1">Consulta el estado de tus vehículos y órdenes de servicio.</p>
      </div>

      {!selectedOrder ? (
        <>
          {/* Active Orders */}
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-3">Mis órdenes activas</h2>
            {customerOrders.filter(o => !['delivered', 'cancelled'].includes(o.status)).length === 0 ? (
              <div className="bg-white rounded-xl border border-gray-100 p-8 text-center text-gray-500">No tienes órdenes activas</div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-4">
                {customerOrders.filter(o => !['delivered', 'cancelled'].includes(o.status)).map(o => {
                  const vehicle = vehicles.find(v => v.id === o.vehicleId);
                  const est = estimates.find(e => e.orderId === o.id);
                  return (
                    <button key={o.id} onClick={() => setSelectedOrderId(o.id)} className="bg-white rounded-xl border border-gray-100 p-4 text-left hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-bold text-gray-800">{o.orderNumber}</span>
                        <span className={`px-2 py-1 text-xs rounded-full font-medium ${statusColors[o.status]}`}>{statusLabels[o.status]}</span>
                      </div>
                      <div className="flex items-center gap-2 mb-3">
                        <Car className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">{vehicle?.brand} {vehicle?.model} <span className="font-medium">({vehicle?.plate})</span></span>
                      </div>
                      {/* Progress */}
                      <div className="flex items-center gap-1">
                        {progressSteps.map((step, i) => (
                          <div key={i} className={`flex-1 h-1.5 rounded-full ${i <= getProgressIndex(o.status) ? 'bg-blue-500' : 'bg-gray-200'}`} />
                        ))}
                      </div>
                      <div className="flex justify-between mt-2">
                        <span className="text-xs text-gray-500">{progressSteps[0]}</span>
                        <span className="text-xs text-gray-500">{progressSteps[progressSteps.length - 1]}</span>
                      </div>
                      {est && est.status === 'partially_approved' && (
                        <div className="mt-2 flex items-center gap-1 text-xs text-yellow-600">
                          <AlertTriangle className="w-3 h-3" /> Tienes conceptos pendientes de aprobación
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* History */}
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-3">Historial</h2>
            {customerOrders.filter(o => ['delivered', 'cancelled'].includes(o.status)).length === 0 ? (
              <div className="bg-white rounded-xl border border-gray-100 p-6 text-center text-gray-500">No hay historial aún</div>
            ) : (
              <div className="bg-white rounded-xl border border-gray-100 divide-y divide-gray-50">
                {customerOrders.filter(o => ['delivered', 'cancelled'].includes(o.status)).map(o => {
                  const vehicle = vehicles.find(v => v.id === o.vehicleId);
                  return (
                    <button key={o.id} onClick={() => setSelectedOrderId(o.id)} className="w-full flex items-center justify-between p-4 hover:bg-gray-50 text-left">
                      <div>
                        <p className="font-medium text-gray-800">{o.orderNumber}</p>
                        <p className="text-xs text-gray-500">{vehicle?.brand} {vehicle?.model} ({vehicle?.plate})</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 text-xs rounded-full font-medium ${statusColors[o.status]}`}>{statusLabels[o.status]}</span>
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </>
      ) : (
        <>
          {/* Order Detail */}
          <button onClick={() => setSelectedOrderId(null)} className="text-sm text-blue-600 hover:underline">← Volver a mis órdenes</button>
          
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold text-gray-800">{selectedOrder.orderNumber}</h2>
                <p className="text-sm text-gray-500">{vehicles.find(v => v.id === selectedOrder.vehicleId)?.brand} {vehicles.find(v => v.id === selectedOrder.vehicleId)?.model} ({vehicles.find(v => v.id === selectedOrder.vehicleId)?.plate})</p>
              </div>
              <span className={`px-3 py-1.5 text-sm rounded-full font-medium ${statusColors[selectedOrder.status]}`}>{statusLabels[selectedOrder.status]}</span>
            </div>

            {/* Progress bar */}
            <div className="mb-6">
              <div className="flex items-center gap-1">
                {progressSteps.map((step, i) => (
                  <div key={i} className="flex-1">
                    <div className={`h-2 rounded-full ${i <= getProgressIndex(selectedOrder.status) ? 'bg-blue-500' : 'bg-gray-200'}`} />
                    <p className={`text-xs mt-1 text-center ${i <= getProgressIndex(selectedOrder.status) ? 'text-blue-600 font-medium' : 'text-gray-400'}`}>{step}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Info */}
            <div className="grid sm:grid-cols-2 gap-4 text-sm">
              <div><span className="text-gray-500">Motivo:</span><p className="font-medium">{selectedOrder.reason}</p></div>
              <div><span className="text-gray-500">Fecha estimada entrega:</span><p className="font-medium">{selectedOrder.estimatedDelivery ? new Date(selectedOrder.estimatedDelivery).toLocaleDateString('es-CO') : 'Por definir'}</p></div>
              {selectedOrder.diagnosis && <div className="sm:col-span-2"><span className="text-gray-500">Diagnóstico:</span><p className="font-medium">{selectedOrder.diagnosis}</p></div>}
            </div>
          </div>

          {/* Estimate & Authorization */}
          {selectedEstimate && (
            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2"><FileText className="w-5 h-5 text-blue-600" /> Presupuesto (v{selectedEstimate.version})</h3>
              <div className="space-y-3">
                {selectedEstimate.items.map(item => (
                  <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-800">{item.description}</p>
                      <p className="text-sm text-gray-600">{formatCOP(item.total)}</p>
                    </div>
                    {item.requiresAuth ? (
                      item.authStatus === 'pending' ? (
                        <div className="flex gap-2">
                          <button onClick={() => handleAuthorize(selectedEstimate.id, item.id, 'approved', selectedEstimate.version)} className="px-3 py-1.5 bg-green-600 text-white text-xs rounded-lg hover:bg-green-700">Aprobar</button>
                          <button onClick={() => handleAuthorize(selectedEstimate.id, item.id, 'rejected', selectedEstimate.version)} className="px-3 py-1.5 bg-red-100 text-red-700 text-xs rounded-lg hover:bg-red-200">Rechazar</button>
                        </div>
                      ) : (
                        <span className={`px-2 py-1 text-xs rounded-full font-medium ${item.authStatus === 'approved' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {item.authStatus === 'approved' ? '✓ Aprobado' : '✗ Rechazado'}
                        </span>
                      )
                    ) : (
                      <span className="text-xs text-gray-400">No requiere auth</span>
                    )}
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100 text-right">
                <p className="text-lg font-bold text-gray-800">Total: {formatCOP(selectedEstimate.total)}</p>
              </div>
            </div>
          )}

          {/* Evidence Photos */}
          {selectedMedia.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2"><Camera className="w-5 h-5 text-blue-600" /> Fotografías</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {selectedMedia.map(m => (
                  <div key={m.id} className="rounded-lg overflow-hidden border border-gray-100">
                    <img src={m.url} alt={m.description} className="w-full h-28 object-cover" />
                    <p className="p-2 text-xs text-gray-600">{m.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Messages */}
          <div className="bg-white rounded-xl border border-gray-100 flex flex-col h-[400px]">
            <div className="p-3 border-b border-gray-100">
              <h3 className="font-semibold text-sm text-gray-800">Mensajes</h3>
            </div>
            <div className="flex-1 overflow-auto p-4 space-y-3">
              {selectedMessages.map(m => (
                <div key={m.id} className={`flex ${m.senderId === currentUser.id ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-xs px-4 py-2 rounded-2xl text-sm ${m.senderId === currentUser.id ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800'}`}>
                    <p>{m.content}</p>
                    <p className="text-xs opacity-50 mt-1">{new Date(m.createdAt).toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 border-t border-gray-100 flex gap-2">
              <input value={newMessage} onChange={e => setNewMessage(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSendMessage()} className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500" placeholder="Escribir mensaje..." />
              <button onClick={handleSendMessage} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"><Send className="w-4 h-4" /></button>
            </div>
          </div>

          {/* Rating for delivered */}
          {selectedOrder.status === 'delivered' && (
            <div className="bg-white rounded-xl border border-gray-100 p-5 text-center">
              <h3 className="font-semibold text-gray-800 mb-2">¿Cómo fue tu experiencia?</h3>
              <p className="text-sm text-gray-500 mb-4">Califica el servicio recibido</p>
              <div className="flex justify-center gap-2 mb-4">
                {[1, 2, 3, 4, 5].map(s => (
                  <button key={s} onClick={() => setRating(s)} className={`text-3xl ${s <= rating ? 'text-yellow-400' : 'text-gray-300'} hover:scale-110 transition-transform`}>★</button>
                ))}
              </div>
              {rating > 0 && <p className="text-sm text-green-600">¡Gracias por tu calificación!</p>}
            </div>
          )}
        </>
      )}
    </div>
  );
}

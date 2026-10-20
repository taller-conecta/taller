import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useStore } from '../../store';
import { statusLabels, statusColors } from '../../data/demo';
import { ArrowLeft, ChevronRight, CheckCircle, Clock, AlertTriangle, FileText, Camera, MessageSquare, History, Send } from 'lucide-react';
import { OrderStatus } from '../../types';

export default function OrdenDetalle() {
  const { id } = useParams<{ id: string }>();
  const { orders, customers, vehicles, users, estimates, diagnostics, media, messages, events, updateOrderStatus, addDiagnostic, addMessage, addMedia, currentUser, currentWorkshop } = useStore();
  const [tab, setTab] = useState('resumen');
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [newStatus, setNewStatus] = useState<OrderStatus>('diagnosing');
  const [cancelReason, setCancelReason] = useState('');
  const [diagForm, setDiagForm] = useState({ problems: '', technicalDescription: '', causes: '', recommendations: '', requiredWork: '', suggestedParts: '' });
  const [showDiagForm, setShowDiagForm] = useState(false);
  const [newMessage, setNewMessage] = useState('');

  if (!id || !currentWorkshop) return null;
  const order = orders.find(o => o.id === id);
  if (!order) return <div className="text-center py-12 text-gray-500">Orden no encontrada</div>;

  const customer = customers.find(c => c.id === order.customerId);
  const vehicle = vehicles.find(v => v.id === order.vehicleId);
  const advisor = users.find(u => u.id === order.advisorId);
  const mechanic = users.find(u => u.id === order.mechanicId);
  const orderEstimates = estimates.filter(e => e.orderId === id);
  const orderDiag = diagnostics.find(d => d.orderId === id);
  const orderMedia = media.filter(m => m.orderId === id);
  const orderMessages = messages.filter(m => m.orderId === id).sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  const orderEvents = events.filter(e => e.orderId === id).sort((a, b) => a.createdAt.localeCompare(b.createdAt));

  const allowedTransitions: Record<OrderStatus, OrderStatus[]> = {
    received: ['diagnosing', 'cancelled'], diagnosing: ['awaiting_approval', 'cancelled'], awaiting_approval: ['authorized', 'cancelled'],
    authorized: ['repairing', 'cancelled'], repairing: ['on_hold', 'testing', 'cancelled'], on_hold: ['repairing', 'cancelled'],
    testing: ['ready', 'repairing', 'cancelled'], ready: ['delivered', 'cancelled'], delivered: [], cancelled: [],
  };

  const handleStatusChange = () => {
    if (!currentUser) return;
    if (newStatus === 'cancelled' && !cancelReason) { alert('Ingrese un motivo para cancelar'); return; }
    const success = updateOrderStatus(order.id, newStatus, currentUser.id, cancelReason);
    if (!success) alert('No se puede realizar esta transición de estado');
    setShowStatusModal(false);
    setCancelReason('');
  };

  const handleAddDiag = () => {
    if (!currentUser) return;
    addDiagnostic({ orderId: order.id, workshopId: currentWorkshop.id, mechanicId: currentUser.id, ...diagForm });
    setShowDiagForm(false);
    setDiagForm({ problems: '', technicalDescription: '', causes: '', recommendations: '', requiredWork: '', suggestedParts: '' });
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !currentUser) return;
    addMessage({ orderId: order.id, workshopId: currentWorkshop.id, senderId: currentUser.id, senderName: currentUser.name, content: newMessage });
    setNewMessage('');
  };

  const formatCOP = (n: number) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(n);

  const tabs = [
    { id: 'resumen', label: 'Resumen', icon: FileText },
    { id: 'diagnostico', label: 'Diagnóstico', icon: AlertTriangle },
    { id: 'presupuesto', label: 'Presupuesto', icon: FileText },
    { id: 'evidencias', label: 'Evidencias', icon: Camera },
    { id: 'mensajes', label: 'Mensajes', icon: MessageSquare },
    { id: 'historial', label: 'Historial', icon: History },
  ];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start gap-3">
        <div>
          <Link to="/taller/ordenes" className="text-sm text-blue-600 hover:underline flex items-center gap-1 mb-2"><ArrowLeft className="w-4 h-4" /> Volver a órdenes</Link>
          <h1 className="text-2xl font-bold text-gray-800">{order.orderNumber}</h1>
          <p className="text-sm text-gray-500">{customer?.name} • {vehicle?.brand} {vehicle?.model} ({vehicle?.plate})</p>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-3 py-1.5 text-sm rounded-full font-medium ${statusColors[order.status]}`}>{statusLabels[order.status]}</span>
          {allowedTransitions[order.status].length > 0 && (
            <button onClick={() => setShowStatusModal(true)} className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700">Cambiar estado</button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 overflow-x-auto bg-white rounded-xl border border-gray-100 p-1">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg whitespace-nowrap transition-colors ${tab === t.id ? 'bg-blue-50 text-blue-700' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}>
            <t.icon className="w-4 h-4" /> {t.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {tab === 'resumen' && (
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-3">
            <h3 className="font-semibold text-gray-800">Información de la orden</h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div><span className="text-gray-500">Fecha recepción:</span><p className="font-medium">{new Date(order.receptionDate).toLocaleDateString('es-CO')}</p></div>
              <div><span className="text-gray-500">Kilometraje:</span><p className="font-medium">{order.mileage.toLocaleString()} km</p></div>
              <div><span className="text-gray-500">Asesor:</span><p className="font-medium">{advisor?.name || 'Sin asignar'}</p></div>
              <div><span className="text-gray-500">Mecánico:</span><p className="font-medium">{mechanic?.name || 'Sin asignar'}</p></div>
              <div className="col-span-2"><span className="text-gray-500">Entrega estimada:</span><p className="font-medium">{order.estimatedDelivery ? new Date(order.estimatedDelivery).toLocaleDateString('es-CO') : 'No definida'}</p></div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-3">
            <h3 className="font-semibold text-gray-800">Detalle técnico</h3>
            <div className="space-y-2 text-sm">
              <div><span className="text-gray-500">Motivo:</span><p className="font-medium">{order.reason}</p></div>
              <div><span className="text-gray-500">Síntomas:</span><p className="font-medium">{order.symptoms}</p></div>
              {order.visibleDamage && <div><span className="text-gray-500">Daños visibles:</span><p className="font-medium">{order.visibleDamage}</p></div>}
              {order.diagnosis && <div><span className="text-gray-500">Diagnóstico:</span><p className="font-medium">{order.diagnosis}</p></div>}
            </div>
          </div>
        </div>
      )}

      {tab === 'diagnostico' && (
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          {orderDiag ? (
            <div className="space-y-4">
              <div><h4 className="text-sm font-medium text-gray-500">Problemas identificados</h4><p className="text-gray-800">{orderDiag.problems}</p></div>
              <div><h4 className="text-sm font-medium text-gray-500">Descripción técnica</h4><p className="text-gray-800">{orderDiag.technicalDescription}</p></div>
              {orderDiag.causes && <div><h4 className="text-sm font-medium text-gray-500">Causas posibles</h4><p className="text-gray-800">{orderDiag.causes}</p></div>}
              <div><h4 className="text-sm font-medium text-gray-500">Recomendaciones</h4><p className="text-gray-800">{orderDiag.recommendations}</p></div>
              <div><h4 className="text-sm font-medium text-gray-500">Trabajos necesarios</h4><p className="text-gray-800">{orderDiag.requiredWork}</p></div>
              {orderDiag.suggestedParts && <div><h4 className="text-sm font-medium text-gray-500">Repuestos sugeridos</h4><p className="text-gray-800">{orderDiag.suggestedParts}</p></div>}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">No hay diagnóstico registrado</p>
              {(currentUser?.role === 'mechanic' || currentUser?.role === 'advisor' || currentUser?.role === 'owner') && (
                <button onClick={() => setShowDiagForm(true)} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">Registrar diagnóstico</button>
              )}
            </div>
          )}
          {showDiagForm && (
            <div className="mt-6 pt-6 border-t border-gray-100 space-y-3">
              <h4 className="font-semibold text-gray-800">Nuevo diagnóstico</h4>
              <textarea value={diagForm.problems} onChange={e => setDiagForm({ ...diagForm, problems: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" placeholder="Problemas identificados" rows={2} />
              <textarea value={diagForm.technicalDescription} onChange={e => setDiagForm({ ...diagForm, technicalDescription: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" placeholder="Descripción técnica" rows={2} />
              <textarea value={diagForm.causes} onChange={e => setDiagForm({ ...diagForm, causes: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" placeholder="Causas posibles (opcional)" rows={2} />
              <textarea value={diagForm.recommendations} onChange={e => setDiagForm({ ...diagForm, recommendations: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" placeholder="Recomendaciones" rows={2} />
              <textarea value={diagForm.requiredWork} onChange={e => setDiagForm({ ...diagForm, requiredWork: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" placeholder="Trabajos necesarios" rows={2} />
              <textarea value={diagForm.suggestedParts} onChange={e => setDiagForm({ ...diagForm, suggestedParts: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" placeholder="Repuestos sugeridos (opcional)" rows={2} />
              <div className="flex gap-2">
                <button onClick={handleAddDiag} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">Guardar diagnóstico</button>
                <button onClick={() => setShowDiagForm(false)} className="px-4 py-2 text-gray-600 rounded-lg text-sm hover:bg-gray-100">Cancelar</button>
              </div>
            </div>
          )}
        </div>
      )}

      {tab === 'presupuesto' && (
        <div className="space-y-4">
          {orderEstimates.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-100 p-8 text-center text-gray-500">No hay presupuestos para esta orden</div>
          ) : orderEstimates.map(est => (
            <div key={est.id} className="bg-white rounded-xl border border-gray-100 p-5">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h4 className="font-semibold text-gray-800">Presupuesto v{est.version}</h4>
                  <p className="text-xs text-gray-500">{new Date(est.createdAt).toLocaleDateString('es-CO')}</p>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full font-medium ${est.status === 'approved' ? 'bg-green-100 text-green-700' : est.status === 'partially_approved' ? 'bg-yellow-100 text-yellow-700' : est.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'}`}>
                  {est.status === 'approved' ? 'Aprobado' : est.status === 'partially_approved' ? 'Parcial' : est.status === 'rejected' ? 'Rechazado' : est.status === 'sent' ? 'Enviado' : 'Borrador'}
                </span>
              </div>
              <table className="w-full text-sm">
                <thead><tr className="border-b border-gray-100"><th className="text-left py-2 text-gray-500 font-medium">Concepto</th><th className="text-center py-2 text-gray-500 font-medium">Cant.</th><th className="text-right py-2 text-gray-500 font-medium">V. Unit</th><th className="text-right py-2 text-gray-500 font-medium">Total</th><th className="text-center py-2 text-gray-500 font-medium">Auth</th></tr></thead>
                <tbody>
                  {est.items.map(item => (
                    <tr key={item.id} className="border-b border-gray-50">
                      <td className="py-2 text-gray-800">{item.description}<span className="ml-2 text-xs text-gray-400">({item.type === 'part' ? 'Repuesto' : item.type === 'labor' ? 'Mano de obra' : 'Servicio'})</span></td>
                      <td className="py-2 text-center text-gray-600">{item.quantity}</td>
                      <td className="py-2 text-right text-gray-600">{formatCOP(item.unitPrice)}</td>
                      <td className="py-2 text-right font-medium text-gray-800">{formatCOP(item.total)}</td>
                      <td className="py-2 text-center">
                        {item.requiresAuth ? (
                          <span className={`text-xs px-1.5 py-0.5 rounded ${item.authStatus === 'approved' ? 'bg-green-100 text-green-700' : item.authStatus === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                            {item.authStatus === 'approved' ? '✓' : item.authStatus === 'rejected' ? '✗' : '⏳'}
                          </span>
                        ) : <span className="text-xs text-gray-400">N/A</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="mt-3 pt-3 border-t border-gray-100 flex justify-end">
                <div className="text-right space-y-1">
                  <p className="text-sm text-gray-500">Subtotal: {formatCOP(est.subtotal)}</p>
                  {est.discount > 0 && <p className="text-sm text-green-600">Descuento: -{formatCOP(est.discount)}</p>}
                  <p className="text-sm text-gray-500">IVA: {formatCOP(est.tax)}</p>
                  <p className="text-lg font-bold text-gray-800">Total: {formatCOP(est.total)}</p>
                </div>
              </div>
              {est.notes && <p className="mt-3 text-xs text-gray-500 italic">{est.notes}</p>}
            </div>
          ))}
        </div>
      )}

      {tab === 'evidencias' && (
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <h3 className="font-semibold text-gray-800 mb-4">Evidencias fotográficas</h3>
          {orderMedia.length === 0 ? (
            <p className="text-center py-8 text-gray-500">No hay evidencias registradas</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {orderMedia.map(m => (
                <div key={m.id} className="rounded-lg overflow-hidden border border-gray-100">
                  <img src={m.url} alt={m.description} className="w-full h-32 object-cover" />
                  <div className="p-2">
                    <p className="text-xs text-gray-500 capitalize">{m.category === 'initial' ? 'Inicial' : m.category === 'damage' ? 'Daño' : m.category === 'process' ? 'Proceso' : m.category === 'replaced' ? 'Reemplazo' : 'Final'}</p>
                    <p className="text-xs text-gray-700">{m.description}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === 'mensajes' && (
        <div className="bg-white rounded-xl border border-gray-100 flex flex-col h-[500px]">
          <div className="flex-1 overflow-auto p-4 space-y-3">
            {orderMessages.length === 0 ? (
              <p className="text-center py-8 text-gray-500">No hay mensajes en esta conversación</p>
            ) : orderMessages.map(m => (
              <div key={m.id} className={`flex ${m.senderId === currentUser?.id ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl text-sm ${m.senderId === currentUser?.id ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800'}`}>
                  <p className="text-xs opacity-70 mb-0.5">{m.senderName}</p>
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
      )}

      {tab === 'historial' && (
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <h3 className="font-semibold text-gray-800 mb-4">Historial de cambios</h3>
          {orderEvents.length === 0 ? (
            <p className="text-center py-8 text-gray-500">Sin eventos registrados</p>
          ) : (
            <div className="space-y-3">
              {orderEvents.map(ev => {
                const changedBy = users.find(u => u.id === ev.changedBy);
                return (
                  <div key={ev.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <Clock className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-800">
                        <span className={`px-1.5 py-0.5 text-xs rounded ${statusColors[ev.fromStatus]}`}>{statusLabels[ev.fromStatus]}</span>
                        <ChevronRight className="w-3 h-3 inline mx-1 text-gray-400" />
                        <span className={`px-1.5 py-0.5 text-xs rounded ${statusColors[ev.toStatus]}`}>{statusLabels[ev.toStatus]}</span>
                      </p>
                      <p className="text-xs text-gray-500">{changedBy?.name} • {new Date(ev.createdAt).toLocaleString('es-CO')}</p>
                      {ev.reason && <p className="text-xs text-gray-600 mt-0.5">Motivo: {ev.reason}</p>}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Status Change Modal */}
      {showStatusModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-xl p-5">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Cambiar estado</h3>
            <div className="space-y-2 mb-4">
              {allowedTransitions[order.status].map(s => (
                <label key={s} className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input type="radio" name="status" value={s} checked={newStatus === s} onChange={() => setNewStatus(s as OrderStatus)} className="text-blue-600" />
                  <span className={`px-2 py-1 text-xs rounded-full font-medium ${statusColors[s]}`}>{statusLabels[s]}</span>
                </label>
              ))}
            </div>
            {newStatus === 'cancelled' && (
              <textarea value={cancelReason} onChange={e => setCancelReason(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm mb-4" placeholder="Motivo de cancelación (requerido)" rows={3} />
            )}
            <div className="flex justify-end gap-2">
              <button onClick={() => setShowStatusModal(false)} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">Cancelar</button>
              <button onClick={handleStatusChange} className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700">Confirmar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

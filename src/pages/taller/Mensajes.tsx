import { useState } from 'react';
import { useStore } from '../../store';
import { Send, MessageSquare } from 'lucide-react';

export default function Mensajes() {
  const { currentWorkshop, messages, orders, customers, vehicles, addMessage, currentUser, markMessageRead } = useStore();
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');

  if (!currentWorkshop || !currentUser) return null;

  const workshopMessages = messages.filter(m => m.workshopId === currentWorkshop.id);
  const workshopOrders = orders.filter(o => o.workshopId === currentWorkshop.id);
  
  const ordersWithMessages = workshopOrders.filter(o => workshopMessages.some(m => m.orderId === o.id));
  const selectedOrderMessages = selectedOrderId ? workshopMessages.filter(m => m.orderId === selectedOrderId).sort((a, b) => a.createdAt.localeCompare(b.createdAt)) : [];

  const handleSend = () => {
    if (!newMessage.trim() || !selectedOrderId) return;
    addMessage({ orderId: selectedOrderId, workshopId: currentWorkshop.id, senderId: currentUser.id, senderName: currentUser.name, content: newMessage });
    setNewMessage('');
  };

  const getUnreadCount = (orderId: string) => workshopMessages.filter(m => m.orderId === orderId && !m.read && m.senderId !== currentUser.id).length;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-800">Mensajes</h1>
      
      <div className="grid md:grid-cols-3 gap-4 h-[calc(100vh-200px)]">
        {/* Conversations list */}
        <div className="bg-white rounded-xl border border-gray-100 overflow-auto">
          <div className="p-3 border-b border-gray-100">
            <h3 className="font-semibold text-sm text-gray-700">Conversaciones</h3>
          </div>
          {ordersWithMessages.length === 0 ? (
            <p className="p-4 text-sm text-gray-500 text-center">No hay conversaciones</p>
          ) : ordersWithMessages.map(o => {
            const customer = customers.find(c => c.id === o.customerId);
            const vehicle = vehicles.find(v => v.id === o.vehicleId);
            const unread = getUnreadCount(o.id);
            return (
              <button key={o.id} onClick={() => setSelectedOrderId(o.id)} className={`w-full text-left p-3 border-b border-gray-50 hover:bg-gray-50 transition-colors ${selectedOrderId === o.id ? 'bg-blue-50' : ''}`}>
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-800 truncate">{customer?.name}</p>
                  {unread > 0 && <span className="w-5 h-5 bg-blue-600 text-white text-xs rounded-full flex items-center justify-center">{unread}</span>}
                </div>
                <p className="text-xs text-gray-500">{o.orderNumber} • {vehicle?.plate}</p>
              </button>
            );
          })}
        </div>

        {/* Chat area */}
        <div className="md:col-span-2 bg-white rounded-xl border border-gray-100 flex flex-col">
          {!selectedOrderId ? (
            <div className="flex-1 flex items-center justify-center text-gray-400">
              <div className="text-center">
                <MessageSquare className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Seleccione una conversación</p>
              </div>
            </div>
          ) : (
            <>
              <div className="p-3 border-b border-gray-100">
                <p className="font-medium text-gray-800 text-sm">
                  {customers.find(c => c.id === orders.find(o => o.id === selectedOrderId)?.customerId)?.name}
                </p>
                <p className="text-xs text-gray-500">{orders.find(o => o.id === selectedOrderId)?.orderNumber}</p>
              </div>
              <div className="flex-1 overflow-auto p-4 space-y-3">
                {selectedOrderMessages.map(m => (
                  <div key={m.id} className={`flex ${m.senderId === currentUser.id ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl text-sm ${m.senderId === currentUser.id ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800'}`}>
                      <p className="text-xs opacity-70 mb-0.5">{m.senderName}</p>
                      <p>{m.content}</p>
                      <p className="text-xs opacity-50 mt-1">{new Date(m.createdAt).toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-4 border-t border-gray-100 flex gap-2">
                <input value={newMessage} onChange={e => setNewMessage(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSend()} className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500" placeholder="Escribir mensaje..." />
                <button onClick={handleSend} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"><Send className="w-4 h-4" /></button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

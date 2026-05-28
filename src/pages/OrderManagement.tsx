import { useState, useEffect } from 'react';
import api from '../services/api';
import { useToast } from '../components/Toast';
import { Package, Truck, Store as StoreIcon, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import type { Order } from '../types';

const statusConfig: Record<string, { label: string; color: string; icon: typeof Clock }> = {
  PENDING: { label: 'Pendiente', color: 'bg-yellow-900/30 text-yellow-400 border-yellow-800/30', icon: Clock },
  CONFIRMED: { label: 'Confirmado', color: 'bg-blue-900/30 text-blue-400 border-blue-800/30', icon: CheckCircle },
  DELIVERED: { label: 'Entregado', color: 'bg-green-900/30 text-green-400 border-green-800/30', icon: CheckCircle },
  CANCELLED: { label: 'Cancelado', color: 'bg-red-900/30 text-red-400 border-red-800/30', icon: XCircle },
};

const paymentStatusConfig: Record<string, { label: string; color: string }> = {
  PENDING: { label: 'Pago pendiente', color: 'bg-yellow-900/30 text-yellow-400' },
  PAID: { label: 'Pagado', color: 'bg-green-900/30 text-green-400' },
  REJECTED: { label: 'Pago rechazado', color: 'bg-red-900/30 text-red-400' },
};

export default function OrderManagement() {
  const { showToast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('ALL');

  useEffect(() => {
    fetchOrders();
  }, []);

  async function fetchOrders() {
    try {
      const res = await api.get('/orders');
      setOrders(res.data);
    } catch {
      showToast('Error al cargar pedidos', 'error');
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(orderId: string, status: string) {
    try {
      await api.put(`/orders/${orderId}/status`, { status });
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: status as Order['status'] } : o));
      showToast('Estado actualizado', 'success');
    } catch {
      showToast('Error al actualizar estado', 'error');
    }
  }

  const filteredOrders = filter === 'ALL' ? orders : orders.filter(o => o.status === filter);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-gray-800 border-t-green-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Gestion de Pedidos</h1>
        <p className="text-gray-500 text-sm">{orders.length} pedido{orders.length !== 1 ? 's' : ''} en total</p>
      </div>

      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {['ALL', 'PENDING', 'CONFIRMED', 'DELIVERED', 'CANCELLED'].map(s => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
              filter === s ? 'bg-green-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            {s === 'ALL' ? 'Todos' : statusConfig[s]?.label}
          </button>
        ))}
      </div>

      {filteredOrders.length === 0 ? (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-16 text-center">
          <Package className="h-12 w-12 text-gray-600 mx-auto mb-3" />
          <p className="text-gray-500">No hay pedidos con este filtro</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredOrders.map(order => {
            const sc = statusConfig[order.status] || statusConfig.PENDING;
            const ps = paymentStatusConfig[order.paymentStatus] || paymentStatusConfig.PENDING;
            const StatusIcon = sc.icon;
            return (
              <div key={order.id} className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
                <div className="bg-gray-800/50 px-5 py-3 flex flex-wrap items-center justify-between gap-2 border-b border-gray-800">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-lg font-semibold border ${sc.color}`}>
                      <StatusIcon className="h-3 w-3" />
                      {sc.label}
                    </span>
                    <span className={`text-xs px-2.5 py-1 rounded-lg font-semibold ${ps.color}`}>
                      {ps.label}
                    </span>
                    <span className={`flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg ${
                      order.deliveryType === 'DELIVERY' ? 'bg-blue-900/30 text-blue-400' : 'bg-gray-700/50 text-gray-400'
                    }`}>
                      {order.deliveryType === 'DELIVERY' ? <Truck className="h-3 w-3" /> : <StoreIcon className="h-3 w-3" />}
                      {order.deliveryType === 'DELIVERY' ? 'Delivery' : 'Retiro'}
                    </span>
                    <span className="font-mono text-xs text-gray-600">#{order.id.slice(0, 8)}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-600">{new Date(order.createdAt).toLocaleDateString('es-AR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}</p>
                    {order.user && <p className="text-xs text-gray-500">{order.user.name}</p>}
                  </div>
                </div>

                <div className="px-5 py-3">
                  <div className="space-y-1.5 mb-3">
                    {order.items.map(item => (
                      <div key={item.id} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <span className="bg-gray-800 text-gray-500 text-xs font-bold px-2 py-0.5 rounded">x{item.quantity}</span>
                          <span className="text-gray-300">{item.product?.name || item.productName || 'Producto'}</span>
                        </div>
                        <span className="text-gray-400">${(item.price * item.quantity).toLocaleString('es-AR')}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-gray-800">
                    <span className="text-green-500 font-bold text-lg">${order.total.toLocaleString('es-AR')}</span>
                    <div className="flex gap-2">
                      {order.status !== 'CONFIRMED' && (
                        <button onClick={() => updateStatus(order.id, 'CONFIRMED')} className="px-3 py-1.5 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700 transition-colors">
                          Confirmar
                        </button>
                      )}
                      {order.status !== 'DELIVERED' && (
                        <button onClick={() => updateStatus(order.id, 'DELIVERED')} className="px-3 py-1.5 bg-green-600 text-white text-xs rounded-lg hover:bg-green-700 transition-colors">
                          Entregar
                        </button>
                      )}
                      {order.status !== 'CANCELLED' && order.status !== 'DELIVERED' && (
                        <button onClick={() => updateStatus(order.id, 'CANCELLED')} className="px-3 py-1.5 bg-red-600 text-white text-xs rounded-lg hover:bg-red-700 transition-colors">
                          Cancelar
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

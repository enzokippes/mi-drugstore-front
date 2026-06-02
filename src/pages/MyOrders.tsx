import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { Package, ArrowLeft, MapPin, Phone, Clock, Truck, Store as StoreIcon, CheckCircle, XCircle, Navigation } from 'lucide-react';
import type { Order } from '../types';

const statusSteps = ['PENDING', 'CONFIRMED', 'IN_TRANSIT', 'DELIVERED'];

const statusConfig: Record<string, { label: string; color: string; icon: typeof Clock }> = {
  PENDING: { label: 'Pendiente', color: 'bg-gold-900/30 text-gold-400 border-gold-800/30', icon: Clock },
  CONFIRMED: { label: 'Confirmado', color: 'bg-blue-900/30 text-blue-400 border-blue-800/30', icon: CheckCircle },
  IN_TRANSIT: { label: 'En camino', color: 'bg-purple-900/30 text-purple-400 border-purple-800/30', icon: Navigation },
  DELIVERED: { label: 'Entregado', color: 'bg-green-900/30 text-green-400 border-green-800/30', icon: CheckCircle },
  CANCELLED: { label: 'Cancelado', color: 'bg-red-900/30 text-red-400 border-red-800/30', icon: XCircle },
};

function OrderTracker({ status }: { status: string }) {
  if (status === 'CANCELLED') return null;
  const currentIndex = statusSteps.indexOf(status);

  return (
    <div className="px-5 py-3 bg-gray-800/30 border-b border-gray-800/50">
      <div className="flex items-center justify-between">
        {statusSteps.map((step, index) => {
          const isActive = index <= currentIndex;
          const isCurrent = index === currentIndex;
          const config = statusConfig[step];
          const StepIcon = config.icon;
          return (
            <div key={step} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                  isCurrent ? 'gold-gradient text-gray-950 shadow-lg shadow-gold-500/20' :
                  isActive ? 'bg-gold-500/20 text-gold-400' :
                  'bg-gray-800 text-gray-600'
                }`}>
                  <StepIcon size={14} />
                </div>
                <span className={`text-[10px] mt-1 font-medium ${
                  isCurrent ? 'text-gold-400' : isActive ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {config.label}
                </span>
              </div>
              {index < statusSteps.length - 1 && (
                <div className={`flex-1 h-0.5 mx-2 rounded ${
                  index < currentIndex ? 'bg-gold-500/50' : 'bg-gray-800'
                }`} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

const MyOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await api.get('/orders/my-orders');
        setOrders(response.data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-gray-800 border-t-gold-500" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      <div className="mb-8 flex items-center gap-3">
        <Link to="/" className="text-gray-500 hover:text-gold-400 transition-colors p-2 hover:bg-gray-800 rounded-xl">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white">Mis Pedidos</h1>
          <p className="text-gray-500 text-sm">{orders.length} pedido{orders.length !== 1 ? 's' : ''}</p>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="glass rounded-xl p-16 text-center">
          <div className="bg-gray-800/80 w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Package className="h-8 w-8 text-gray-600" />
          </div>
          <p className="text-white text-lg font-semibold mb-1">No tenes pedidos</p>
          <p className="text-gray-500 text-sm mb-6">Cuando hagas un pedido, va a aparecer aca.</p>
          <Link to="/" className="inline-block gold-gradient text-gray-950 px-6 py-2.5 rounded-xl hover:opacity-90 transition-opacity font-semibold text-sm">
            Ir a la tienda
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const sc = statusConfig[order.status] || statusConfig.PENDING;
            const StatusIcon = sc.icon;
            return (
              <div key={order.id} className="glass rounded-xl overflow-hidden border border-gray-800/50">
                <div className="bg-gray-800/30 px-5 py-3 flex flex-wrap items-center justify-between gap-2 border-b border-gray-800/50">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-lg font-semibold border ${sc.color}`}>
                      <StatusIcon className="h-3 w-3" />
                      {sc.label}
                    </span>
                    <span className={`flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg ${
                      order.deliveryType === 'DELIVERY' ? 'bg-blue-900/30 text-blue-400' : 'bg-gray-700/50 text-gray-400'
                    }`}>
                      {order.deliveryType === 'DELIVERY' ? <Truck className="h-3 w-3" /> : <StoreIcon className="h-3 w-3" />}
                      {order.deliveryType === 'DELIVERY' ? 'Delivery' : 'Retiro'}
                    </span>
                    <span className="font-mono text-xs text-gray-600">#{order.id.slice(0, 8)}</span>
                  </div>
                  <span className="text-xs text-gray-600">
                    {new Date(order.createdAt).toLocaleDateString('es-AR', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                <OrderTracker status={order.status} />

                {order.deliveryType === 'DELIVERY' && order.address && (
                  <div className="bg-blue-900/10 px-5 py-2.5 border-b border-gray-800/50">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs">
                      <div className="flex items-center gap-2 text-blue-400">
                        <MapPin className="h-3.5 w-3.5 text-blue-500/50 flex-shrink-0" />
                        <span>{order.address}</span>
                      </div>
                      {order.deliveryZone && (
                        <div className="flex items-center gap-2 text-blue-400">
                          <Navigation className="h-3.5 w-3.5 text-blue-500/50 flex-shrink-0" />
                          <span>Zona: {order.deliveryZone.name}</span>
                        </div>
                      )}
                      {order.phone && (
                        <div className="flex items-center gap-2 text-blue-400">
                          <Phone className="h-3.5 w-3.5 text-blue-500/50 flex-shrink-0" />
                          <span>{order.phone}</span>
                        </div>
                      )}
                      {order.deliveryTime && (
                        <div className="flex items-center gap-2 text-blue-400">
                          <Clock className="h-3.5 w-3.5 text-blue-500/50 flex-shrink-0" />
                          <span>{order.deliveryTime} hs</span>
                        </div>
                      )}
                      {order.notes && <div className="text-blue-500/70 italic">"{order.notes}"</div>}
                    </div>
                  </div>
                )}

                <div className="px-5 py-4">
                  <div className="space-y-2">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <span className="bg-gray-800 text-gray-500 text-xs font-bold px-2 py-0.5 rounded">x{item.quantity}</span>
                          <span className="text-gray-300">{item.product?.name || item.productName || 'Producto'}</span>
                        </div>
                        <span className="text-gray-400 font-medium">${(item.price * item.quantity).toLocaleString('es-AR')}</span>
                      </div>
                    ))}
                  </div>
                  {order.deliveryCost !== undefined && order.deliveryCost > 0 && (
                    <div className="flex items-center justify-between text-sm mt-2 pt-2 border-t border-gray-800/50">
                      <span className="text-gray-500">Envio</span>
                      <span className="text-gray-400">${order.deliveryCost.toLocaleString('es-AR')}</span>
                    </div>
                  )}
                  <div className="border-t border-gray-800 mt-3 pt-3 flex justify-between items-center">
                    <span className="font-semibold text-gray-500 text-sm">Total</span>
                    <span className="gold-text font-bold text-xl">${order.total.toLocaleString('es-AR')}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyOrders;

import { useState, useEffect } from 'react';
import api from '../services/api';
import { useToast } from '../components/Toast';
import { Package, Truck, Store as StoreIcon, Clock, CheckCircle, XCircle, Navigation, Search, ChevronLeft, ChevronRight, Calendar, Filter } from 'lucide-react';
import type { Order, PaginatedResponse } from '../types';

const statusConfig: Record<string, { label: string; color: string; icon: typeof Clock }> = {
  PENDING: { label: 'Pendiente', color: 'bg-gold-900/30 text-gold-400 border-gold-800/30', icon: Clock },
  CONFIRMED: { label: 'Confirmado', color: 'bg-blue-900/30 text-blue-400 border-blue-800/30', icon: CheckCircle },
  IN_TRANSIT: { label: 'En camino', color: 'bg-purple-900/30 text-purple-400 border-purple-800/30', icon: Navigation },
  DELIVERED: { label: 'Entregado', color: 'bg-green-900/30 text-green-400 border-green-800/30', icon: CheckCircle },
  CANCELLED: { label: 'Cancelado', color: 'bg-red-900/30 text-red-400 border-red-800/30', icon: XCircle },
};

export default function OrderManagement() {
  const { showToast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [total, setTotal] = useState(0);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [deliveryTypeFilter, setDeliveryTypeFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);

  const totalPages = total > 0 ? Math.ceil(total / limit) : 1;

  async function fetchOrders() {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append('page', String(page));
      params.append('limit', String(limit));
      if (statusFilter !== 'ALL') params.append('status', statusFilter);
      if (deliveryTypeFilter !== 'ALL') params.append('deliveryType', deliveryTypeFilter);
      if (search) params.append('search', search);
      if (dateFrom) params.append('dateFrom', dateFrom);
      if (dateTo) params.append('dateTo', dateTo);

      const res = await api.get(`/orders?${params.toString()}`);
      const data = res.data;

      let ordersArray: Order[] = [];
      let totalCount = 0;

      if (Array.isArray(data)) {
        ordersArray = data;
        totalCount = data.length;
      } else if (data && typeof data === 'object' && 'items' in data) {
        const paginatedData = data as PaginatedResponse<Order>;
        ordersArray = Array.isArray(paginatedData.items) ? paginatedData.items : [];
        totalCount = typeof paginatedData.total === 'number' ? paginatedData.total : ordersArray.length;
      } else {
        console.warn('Unexpected API response format:', data);
      }

      setOrders(ordersArray);
      setTotal(totalCount);
    } catch (err) {
      console.error('Error fetching orders:', err);
      showToast('Error al cargar pedidos', 'error');
      setOrders([]);
      setTotal(0);
    } finally {
      setLoading(false);
      setInitialLoad(false);
    }
  }

  useEffect(() => {
    fetchOrders();
  }, [page, statusFilter, deliveryTypeFilter]);

  useEffect(() => {
    const debounce = setTimeout(() => {
      setPage(1);
      fetchOrders();
    }, 500);
    return () => clearTimeout(debounce);
  }, [search, dateFrom, dateTo]);

  async function updateStatus(orderId: string, status: string) {
    try {
      await api.put(`/orders/${orderId}/status`, { status });
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: status as Order['status'] } : o));
      showToast('Estado actualizado', 'success');
    } catch {
      showToast('Error al actualizar estado', 'error');
    }
  }

  const clearFilters = () => {
    setSearch('');
    setDateFrom('');
    setDateTo('');
    setStatusFilter('ALL');
    setDeliveryTypeFilter('ALL');
    setPage(1);
    setTimeout(fetchOrders, 100);
  };

  const hasActiveFilters = search || dateFrom || dateTo || statusFilter !== 'ALL' || deliveryTypeFilter !== 'ALL';

  if (loading && initialLoad) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-gray-800 border-t-gold-500" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Gestion de Pedidos</h1>
        <p className="text-gray-500 text-sm">{total} pedido{total !== 1 ? 's' : ''} en total</p>
      </div>

      <div className="flex gap-3 mb-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          <input
            type="text"
            placeholder="Buscar por cliente, email, ID, direccion..."
            className="w-full pl-10 pr-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-600 focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500 outline-none text-sm"
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`px-4 py-2.5 rounded-xl border text-sm font-medium flex items-center gap-2 transition-all ${
            showFilters || hasActiveFilters
              ? 'gold-gradient text-gray-950 border-transparent'
              : 'bg-gray-800 text-gray-400 border-gray-700 hover:bg-gray-700'
          }`}
        >
          <Filter className="h-4 w-4" />
          Filtros
          {hasActiveFilters && <span className="bg-yellow-400 text-gray-950 text-xs font-bold px-1.5 py-0.5 rounded-full">!</span>}
        </button>
      </div>

      {showFilters && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 mb-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs text-gray-500 mb-1.5 flex items-center gap-1">
                <Calendar className="h-3 w-3" /> Desde
              </label>
              <input
                type="date"
                className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm focus:ring-2 focus:ring-gold-500/50 outline-none"
                value={dateFrom}
                onChange={e => { setDateFrom(e.target.value); setPage(1); }}
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1.5 flex items-center gap-1">
                <Calendar className="h-3 w-3" /> Hasta
              </label>
              <input
                type="date"
                className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm focus:ring-2 focus:ring-gold-500/50 outline-none"
                value={dateTo}
                onChange={e => { setDateTo(e.target.value); setPage(1); }}
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1.5">Tipo</label>
              <select
                className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm focus:ring-2 focus:ring-gold-500/50 outline-none"
                value={deliveryTypeFilter}
                onChange={e => { setDeliveryTypeFilter(e.target.value); setPage(1); }}
              >
                <option value="ALL">Todos</option>
                <option value="DELIVERY">Delivery</option>
                <option value="PICKUP">Retiro</option>
              </select>
            </div>
            <div className="flex items-end">
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="w-full px-4 py-2.5 text-xs text-gray-500 hover:text-gray-400 border border-gray-700 rounded-xl hover:border-gray-600 transition-colors"
                >
                  Limpiar filtros
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {['ALL', 'PENDING', 'CONFIRMED', 'IN_TRANSIT', 'DELIVERED', 'CANCELLED'].map(s => (
          <button
            key={s}
            onClick={() => { setStatusFilter(s); setPage(1); }}
            className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
              statusFilter === s ? 'gold-gradient text-gray-950' : 'bg-gray-800 text-gray-400 hover:bg-gray-700 border border-gray-700/50'
            }`}
          >
            {s === 'ALL' ? 'Todos' : statusConfig[s]?.label}
          </button>
        ))}
      </div>

      {loading && !initialLoad && (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-4 border-gray-800 border-t-gold-500" />
        </div>
      )}

      {!loading && orders.length === 0 ? (
        <div className="glass rounded-xl p-16 text-center border border-gray-800/50">
          <Package className="h-12 w-12 text-gray-600 mx-auto mb-3" />
          <p className="text-gray-500">No hay pedidos con este filtro</p>
          {hasActiveFilters && (
            <button onClick={clearFilters} className="mt-3 text-sm text-gold-400 hover:text-gold-300 underline">
              Limpiar filtros
            </button>
          )}
        </div>
      ) : !loading && orders.length > 0 ? (
        <>
          <div className="space-y-3">
            {orders.map(order => {
              const sc = statusConfig[order.status] || statusConfig.PENDING;
              const StatusIcon = sc.icon;
              return (
                <div key={order.id} className="glass rounded-xl overflow-hidden border border-gray-800/50">
                  <div className="bg-gray-900/50 px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-gray-800/50">
                    <div className="flex flex-wrap items-center gap-2">
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
                      {order.deliveryZone && (
                        <span className="text-xs px-2.5 py-1 rounded-lg bg-blue-900/20 text-blue-400">
                          {order.deliveryZone.name}
                        </span>
                      )}
                      <span className="font-mono text-xs text-gray-600">#{order.id.slice(0, 8)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-right">
                      <span className="text-xs text-gray-600">{new Date(order.createdAt).toLocaleDateString('es-AR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
                      {order.user && <span className="text-xs text-gray-500 hidden sm:inline">{order.user.name}</span>}
                    </div>
                  </div>

                  {order.deliveryType === 'DELIVERY' && order.address && (
                    <div className="bg-blue-900/10 px-4 py-2 border-b border-gray-800/50 text-xs text-blue-400 flex flex-wrap gap-2 sm:gap-3">
                      <span>📍 {order.address}</span>
                      {order.phone && <span>📞 {order.phone}</span>}
                      {order.deliveryTime && <span>🕐 {order.deliveryTime}</span>}
                      {order.notes && <span className="italic truncate max-w-[150px]">"{order.notes}"</span>}
                    </div>
                  )}

                  <div className="px-5 py-3">
                    <div className="space-y-1.5 mb-3">
                      {order.items && order.items.length > 0 ? order.items.map(item => (
                        <div key={item.id || Math.random()} className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2">
                            <span className="bg-gray-800 text-gray-500 text-xs font-bold px-2 py-0.5 rounded">x{item.quantity}</span>
                            <span className="text-gray-300">{item.product?.name || item.productName || 'Producto'}</span>
                          </div>
                          <span className="text-gray-400">${(item.price * item.quantity).toLocaleString('es-AR')}</span>
                        </div>
                      )) : (
                        <p className="text-xs text-gray-500">Sin items</p>
                      )}
                    </div>

                    {order.deliveryCost !== undefined && order.deliveryCost > 0 && (
                      <div className="flex items-center justify-between text-xs mb-2 text-gray-500">
                        <span>Envio</span>
                        <span>${order.deliveryCost.toLocaleString('es-AR')}</span>
                      </div>
                    )}

                    <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-gray-800/50">
                      <span className="gold-text font-bold text-lg">${order.total.toLocaleString('es-AR')}</span>
                      <div className="flex gap-2">
                        {order.status === 'PENDING' && (
                          <button onClick={() => updateStatus(order.id, 'CONFIRMED')} className="px-3 py-1.5 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700 transition-colors">
                            Confirmar
                          </button>
                        )}
                        {(order.status === 'CONFIRMED' || order.status === 'PENDING') && (
                          <button onClick={() => updateStatus(order.id, 'IN_TRANSIT')} className="px-3 py-1.5 bg-purple-600 text-white text-xs rounded-lg hover:bg-purple-700 transition-colors">
                            En camino
                          </button>
                        )}
                        {order.status !== 'DELIVERED' && order.status !== 'CANCELLED' && (
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

          <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-800/50">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span>Página</span>
              <span className="text-white font-medium">{page}</span>
              <span>de</span>
              <span className="text-white font-medium">{totalPages}</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="p-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-400 hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="p-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-400 hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}
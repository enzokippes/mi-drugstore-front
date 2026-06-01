import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, DollarSign, Package, Users, TrendingUp, AlertTriangle, ShoppingCart, Clock, Truck, CheckCircle } from 'lucide-react';
import api from '../services/api';
import type { AdminStats } from '../types';

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await api.get('/admin/stats');
        if (!cancelled) setStats(res.data);
      } catch { /* silent */ }
      if (!cancelled) setLoading(false);
    }
    load();
    return () => { cancelled = true; };
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-gray-800 border-t-gold-500" />
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-500">Error al cargar estadisticas</p>
      </div>
    );
  }

  const maxDailyRevenue = Math.max(...stats.dailySales.map(d => d.revenue), 1);

  return (
    <div className="max-w-6xl mx-auto animate-fade-in">
      <div className="mb-8 flex items-center gap-3">
        <Link to="/" className="text-gray-500 hover:text-gold-400 transition-colors p-2 hover:bg-gray-800 rounded-xl">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-gray-500 text-sm">Estadisticas y resumen general</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard icon={<DollarSign size={20} />} label="Ventas hoy" value={`$${stats.revenue.today.toLocaleString('es-AR')}`} color="text-gold-400" bg="bg-gold-500/10" />
        <StatCard icon={<ShoppingCart size={20} />} label="Pedidos hoy" value={stats.orders.today.toString()} color="text-blue-400" bg="bg-blue-500/10" />
        <StatCard icon={<Users size={20} />} label="Usuarios" value={stats.users.toString()} color="text-purple-400" bg="bg-purple-500/10" />
        <StatCard icon={<Package size={20} />} label="Productos" value={stats.products.total.toString()} color="text-green-400" bg="bg-green-500/10" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <div className="glass rounded-2xl p-5 border border-gray-800/50">
          <h3 className="text-white font-bold text-sm mb-4 flex items-center gap-2">
            <TrendingUp size={16} className="text-gold-400" />
            Ventas semanales
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-gray-500">Esta semana</span>
              <span className="gold-text font-bold">${stats.revenue.week.toLocaleString('es-AR')}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-500">Este mes</span>
              <span className="gold-text font-bold">${stats.revenue.month.toLocaleString('es-AR')}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-500">Pedidos semana</span>
              <span className="text-white font-bold">{stats.orders.week}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-500">Pedidos mes</span>
              <span className="text-white font-bold">{stats.orders.month}</span>
            </div>
          </div>
        </div>

        <div className="glass rounded-2xl p-5 border border-gray-800/50">
          <h3 className="text-white font-bold text-sm mb-4 flex items-center gap-2">
            <Package size={16} className="text-gold-400" />
            Pedidos activos
          </h3>
          <div className="space-y-2">
            <OrderStatusRow icon={<Clock size={14} />} label="Pendientes" count={stats.orders.pending} color="text-gold-400" />
            <OrderStatusRow icon={<CheckCircle size={14} />} label="Confirmados" count={stats.orders.confirmed} color="text-blue-400" />
            <OrderStatusRow icon={<Truck size={14} />} label="En camino" count={stats.orders.inTransit} color="text-purple-400" />
            <OrderStatusRow icon={<CheckCircle size={14} />} label="Entregados" count={stats.orders.delivered} color="text-green-400" />
          </div>
        </div>

        <div className="glass rounded-2xl p-5 border border-gray-800/50">
          <h3 className="text-white font-bold text-sm mb-4 flex items-center gap-2">
            <AlertTriangle size={16} className="text-red-400" />
            Stock bajo
          </h3>
          {stats.products.lowStock.length > 0 ? (
            <div className="space-y-2">
              {stats.products.lowStock.slice(0, 5).map(p => (
                <div key={p.id} className="flex justify-between text-xs">
                  <span className="text-gray-300 truncate max-w-[140px]">{p.name}</span>
                  <span className="text-red-400 font-bold">{p.stock} uds</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-xs">Todo el stock esta bien</p>
          )}
        </div>
      </div>

      <div className="glass rounded-2xl p-5 border border-gray-800/50 mb-6">
        <h3 className="text-white font-bold text-sm mb-4">Ventas ultimos 7 dias</h3>
        <div className="flex items-end gap-2 h-32">
          {stats.dailySales.map(day => {
            const height = (day.revenue / maxDailyRevenue) * 100;
            const dayName = new Date(day.date + 'T12:00:00').toLocaleDateString('es-AR', { weekday: 'short' });
            return (
              <div key={day.date} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-[10px] text-gray-500">${day.revenue > 0 ? `${(day.revenue / 1000).toFixed(0)}k` : '0'}</span>
                <div className="w-full rounded-t-md gold-gradient transition-all" style={{ height: `${Math.max(height, 2)}%` }} />
                <span className="text-[10px] text-gray-500 capitalize">{dayName}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="glass rounded-2xl p-5 border border-gray-800/50">
        <h3 className="text-white font-bold text-sm mb-4 flex items-center gap-2">
          <TrendingUp size={16} className="text-gold-400" />
          Top productos (ultimo mes)
        </h3>
        {stats.topProducts.length > 0 ? (
          <div className="space-y-2">
            {stats.topProducts.map((p, i) => (
              <div key={p.id} className="flex items-center gap-3 text-sm">
                <span className="w-6 h-6 rounded-full bg-gold-500/20 text-gold-400 flex items-center justify-center text-xs font-bold">{i + 1}</span>
                <span className="text-gray-300 flex-1 truncate">{p.name}</span>
                <span className="text-gold-400 font-bold text-xs">{p.totalSold} vendidos</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-xs">No hay ventas suficientes para mostrar</p>
        )}
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, color, bg }: { icon: React.ReactNode; label: string; value: string; color: string; bg: string }) {
  return (
    <div className="glass rounded-2xl p-4 border border-gray-800/50">
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center ${color}`}>
          {icon}
        </div>
        <div>
          <p className="text-gray-500 text-xs">{label}</p>
          <p className="text-white font-bold text-lg">{value}</p>
        </div>
      </div>
    </div>
  );
}

function OrderStatusRow({ icon, label, count, color }: { icon: React.ReactNode; label: string; count: number; color: string }) {
  return (
    <div className="flex items-center justify-between text-xs">
      <div className="flex items-center gap-2">
        <span className={color}>{icon}</span>
        <span className="text-gray-400">{label}</span>
      </div>
      <span className="text-white font-bold">{count}</span>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Plus, Edit2, Trash2, Gift, Star, ToggleLeft, ToggleRight, TrendingUp } from 'lucide-react';
import api from '../services/api';
import { useToast } from '../components/Toast';
import type { PointReward, Product } from '../types';

export default function RewardsAdmin() {
  const { showToast } = useToast();
  const [rewards, setRewards] = useState<PointReward[]>([]);
  const [suggestions, setSuggestions] = useState<(Product & { totalSold: number })[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState({ name: '', description: '', pointsCost: 0, productId: '', active: true });

  useEffect(() => { fetchData(); }, []);

  async function fetchData() {
    try {
      const [rewardsRes, productsRes, suggestionsRes] = await Promise.all([
        api.get('/loyalty/admin/rewards'),
        api.get('/products'),
        api.get('/products/suggestions'),
      ]);
      setRewards(rewardsRes.data);
      setProducts(productsRes.data);
      setSuggestions(suggestionsRes.data);
    } catch { /* silent */ }
    finally { setLoading(false); }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const data = { ...form, productId: form.productId || undefined };
    try {
      if (editingId) {
        await api.put(`/loyalty/admin/rewards/${editingId}`, data);
        showToast('Recompensa actualizada', 'success');
      } else {
        await api.post('/loyalty/admin/rewards', data);
        showToast('Recompensa creada', 'success');
      }
      fetchData();
      setShowForm(false);
      setEditingId(null);
      setForm({ name: '', description: '', pointsCost: 0, productId: '', active: true });
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } };
      showToast(axiosErr.response?.data?.message || 'Error al guardar', 'error');
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm('Eliminar esta recompensa?')) return;
    try {
      await api.delete(`/loyalty/admin/rewards/${id}`);
      setRewards(prev => prev.filter(r => r.id !== id));
      showToast('Recompensa eliminada', 'success');
    } catch { showToast('Error al eliminar', 'error'); }
  }

  async function handleToggleActive(id: string, active: boolean) {
    try {
      await api.put(`/loyalty/admin/rewards/${id}`, { active: !active });
      setRewards(prev => prev.map(r => r.id === id ? { ...r, active: !active } : r));
    } catch { showToast('Error al actualizar', 'error'); }
  }

  function handleEdit(reward: PointReward) {
    setEditingId(reward.id);
    setForm({ name: reward.name, description: reward.description || '', pointsCost: reward.pointsCost, productId: reward.productId || '', active: reward.active });
    setShowForm(true);
  }

  function handleAddSuggestion(product: Product & { totalSold: number }) {
    setForm({ name: product.name, description: `Producto destacado - ${product.totalSold} vendidos`, pointsCost: Math.round(product.price * 0.5), productId: product.id, active: true });
    setEditingId(null);
    setShowForm(true);
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-gray-800 border-t-gold-500" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <div className="mb-8 flex items-center gap-3">
        <Link to="/" className="text-gray-500 hover:text-gold-400 transition-colors p-2 hover:bg-gray-800 rounded-xl">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-white">Recompensas</h1>
          <p className="text-gray-500 text-sm">Administra las recompensas de Barba Negra Points</p>
        </div>
        {!showForm && (
          <button
            onClick={() => { setShowForm(true); setEditingId(null); setForm({ name: '', description: '', pointsCost: 0, productId: '', active: true }); }}
            className="flex items-center gap-2 px-4 py-2 gold-gradient text-gray-950 rounded-lg text-sm font-semibold hover:opacity-90"
          >
            <Plus size={16} /> Nueva Recompensa
          </button>
        )}
      </div>

      {suggestions.length > 0 && (
        <div className="glass rounded-2xl p-5 mb-6 border border-gold-500/20">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp size={16} className="text-gold-400" />
            <h3 className="text-white font-bold text-sm">Sugerencia: Estos son los mas vendidos!</h3>
          </div>
          <p className="text-gray-500 text-xs mb-3">Podes agregarlos como recompensa con un click</p>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {suggestions.map(p => (
              <button
                key={p.id}
                onClick={() => handleAddSuggestion(p)}
                className="flex items-center gap-2 px-3 py-2 bg-gray-800/80 border border-gray-700/50 rounded-xl text-xs text-gray-300 hover:border-gold-500/30 hover:text-gold-400 transition-all whitespace-nowrap shrink-0"
              >
                <Star size={12} className="text-gold-400" />
                {p.name} ({p.totalSold} vendidos)
              </button>
            ))}
          </div>
        </div>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} className="glass rounded-2xl p-6 mb-6 border border-gold-500/20 space-y-4">
          <h3 className="text-white font-bold">{editingId ? 'Editar Recompensa' : 'Nueva Recompensa'}</h3>
          <div>
            <label className="text-gray-400 text-xs mb-1 block">Nombre</label>
            <input type="text" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
              className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-gold-500" placeholder="Coca Cola 500ml" />
          </div>
          <div>
            <label className="text-gray-400 text-xs mb-1 block">Descripcion</label>
            <input type="text" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
              className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-gold-500" placeholder="Una Coca bien fria..." />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-gray-400 text-xs mb-1 block">Costo en puntos</label>
              <input type="number" required min={1} value={form.pointsCost} onChange={e => setForm({ ...form, pointsCost: Number(e.target.value) })}
                className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-gold-500" />
            </div>
            <div>
              <label className="text-gray-400 text-xs mb-1 block">Producto asociado (opcional)</label>
              <select value={form.productId} onChange={e => setForm({ ...form, productId: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-gold-500">
                <option value="">Ninguno</option>
                {products.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex gap-2 pt-2">
            <button type="submit" className="flex-1 gold-gradient text-gray-950 font-semibold py-2.5 rounded-xl hover:opacity-90 text-sm">
              {editingId ? 'Actualizar' : 'Crear'}
            </button>
            <button type="button" onClick={() => { setShowForm(false); setEditingId(null); }} className="px-6 py-2.5 bg-gray-800 text-gray-300 rounded-xl hover:bg-gray-700 text-sm">
              Cancelar
            </button>
          </div>
        </form>
      )}

      <div className="space-y-3">
        {rewards.map(reward => (
          <div key={reward.id} className={`glass rounded-xl p-4 flex items-center justify-between border ${reward.active ? 'border-gray-800/50' : 'border-red-900/30 opacity-60'}`}>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-gold-500/10 flex items-center justify-center">
                <Gift size={18} className="text-gold-400" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-white font-medium">{reward.name}</p>
                  {!reward.active && <span className="text-[10px] bg-red-900/30 text-red-400 px-2 py-0.5 rounded-full">Inactiva</span>}
                </div>
                <div className="flex items-center gap-3 text-xs text-gray-500 mt-0.5">
                  <span className="flex items-center gap-1"><Star size={10} className="text-gold-400" />{reward.pointsCost} pts</span>
                  {reward.description && <span>{reward.description}</span>}
                  {reward.product && <span>Producto: {reward.product.name}</span>}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button onClick={() => handleToggleActive(reward.id, reward.active)} className={`p-2 rounded-lg transition-colors ${reward.active ? 'text-gold-400 hover:bg-gold-500/10' : 'text-gray-600 hover:bg-gray-800'}`}>
                {reward.active ? <ToggleRight size={20} /> : <ToggleLeft size={20} />}
              </button>
              <button onClick={() => handleEdit(reward)} className="p-2 text-gray-500 hover:text-gold-400 rounded-lg hover:bg-gray-800 transition-all">
                <Edit2 size={15} />
              </button>
              <button onClick={() => handleDelete(reward.id)} className="p-2 text-gray-500 hover:text-red-400 rounded-lg hover:bg-gray-800 transition-all">
                <Trash2 size={15} />
              </button>
            </div>
          </div>
        ))}
        {rewards.length === 0 && (
          <div className="glass rounded-2xl p-12 text-center border border-gray-800/50">
            <Gift className="text-gray-600 mx-auto mb-3" size={40} />
            <p className="text-gray-500">No hay recompensas configuradas</p>
          </div>
        )}
      </div>
    </div>
  );
}

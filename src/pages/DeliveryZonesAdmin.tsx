import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Plus, Edit2, Trash2, MapPin, ToggleLeft, ToggleRight } from 'lucide-react';
import api from '../services/api';
import { useToast } from '../components/useToast';
import type { DeliveryZone } from '../types';

export default function DeliveryZonesAdmin() {
  const { showToast } = useToast();
  const [zones, setZones] = useState<DeliveryZone[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', basePrice: 0, surcharge: 0, maxDistanceKm: 0, active: true });

  const fetchZones = useCallback(async () => {
    try {
      const res = await api.get('/delivery-zones');
      setZones(res.data);
    } catch { showToast('Error al cargar zonas', 'error'); }
    finally { setLoading(false); }
  }, [showToast]);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { fetchZones(); }, [fetchZones]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/delivery-zones/${editingId}`, form);
        showToast('Zona actualizada', 'success');
      } else {
        await api.post('/delivery-zones', form);
        showToast('Zona creada', 'success');
      }
      fetchZones();
      setShowForm(false);
      setEditingId(null);
      setForm({ name: '', basePrice: 0, surcharge: 0, maxDistanceKm: 0, active: true });
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } };
      showToast(axiosErr.response?.data?.message || 'Error al guardar', 'error');
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm('Eliminar esta zona?')) return;
    try {
      await api.delete(`/delivery-zones/${id}`);
      setZones(prev => prev.filter(z => z.id !== id));
      showToast('Zona eliminada', 'success');
    } catch { showToast('Error al eliminar', 'error'); }
  }

  async function handleToggleActive(id: string, active: boolean) {
    try {
      await api.put(`/delivery-zones/${id}`, { active: !active });
      setZones(prev => prev.map(z => z.id === id ? { ...z, active: !active } : z));
    } catch { showToast('Error al actualizar', 'error'); }
  }

  function handleEdit(zone: DeliveryZone) {
    setEditingId(zone.id);
    setForm({ name: zone.name, basePrice: zone.basePrice, surcharge: zone.surcharge, maxDistanceKm: zone.maxDistanceKm || 0, active: zone.active });
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
          <h1 className="text-2xl font-bold text-white">Zonas de Delivery</h1>
          <p className="text-gray-500 text-sm">Administra las zonas y costos de envio</p>
        </div>
        {!showForm && (
          <button
            onClick={() => { setShowForm(true); setEditingId(null); setForm({ name: '', basePrice: 0, surcharge: 0, maxDistanceKm: 0, active: true }); }}
            className="flex items-center gap-2 px-4 py-2 gold-gradient text-gray-950 rounded-lg text-sm font-semibold hover:opacity-90"
          >
            <Plus size={16} /> Nueva Zona
          </button>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="glass rounded-2xl p-6 mb-6 border border-gold-500/20 space-y-4">
          <h3 className="text-white font-bold">{editingId ? 'Editar Zona' : 'Nueva Zona'}</h3>
          <div>
            <label className="text-gray-400 text-xs mb-1 block">Nombre de la zona</label>
            <input type="text" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
              className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-gold-500" placeholder="Centro, Norte, Sur..." />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-gray-400 text-xs mb-1 block">Precio base ($)</label>
              <input type="number" required min={0} value={form.basePrice} onChange={e => setForm({ ...form, basePrice: Number(e.target.value) })}
                className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-gold-500" />
            </div>
            <div>
              <label className="text-gray-400 text-xs mb-1 block">Recargo ($)</label>
              <input type="number" min={0} value={form.surcharge} onChange={e => setForm({ ...form, surcharge: Number(e.target.value) })}
                className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-gold-500" />
            </div>
            <div>
              <label className="text-gray-400 text-xs mb-1 block">Distancia max (km)</label>
              <input type="number" min={0} step={0.5} value={form.maxDistanceKm} onChange={e => setForm({ ...form, maxDistanceKm: Number(e.target.value) })}
                className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-gold-500" />
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
        {zones.map(zone => (
          <div key={zone.id} className={`glass rounded-xl p-4 flex items-center justify-between border ${zone.active ? 'border-gray-800/50' : 'border-red-900/30 opacity-60'}`}>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-gold-500/10 flex items-center justify-center">
                <MapPin size={18} className="text-gold-400" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-white font-medium">{zone.name}</p>
                  {!zone.active && <span className="text-[10px] bg-red-900/30 text-red-400 px-2 py-0.5 rounded-full">Inactiva</span>}
                </div>
                <div className="flex items-center gap-3 text-xs text-gray-500 mt-0.5">
                  <span>Base: ${zone.basePrice.toLocaleString('es-AR')}</span>
                  <span>Recargo: ${zone.surcharge.toLocaleString('es-AR')}</span>
                  <span className="gold-text font-bold">Total: ${(zone.basePrice + zone.surcharge).toLocaleString('es-AR')}</span>
                  {zone.maxDistanceKm && <span>{zone.maxDistanceKm} km max</span>}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button onClick={() => handleToggleActive(zone.id, zone.active)} className={`p-2 rounded-lg transition-colors ${zone.active ? 'text-gold-400 hover:bg-gold-500/10' : 'text-gray-600 hover:bg-gray-800'}`}>
                {zone.active ? <ToggleRight size={20} /> : <ToggleLeft size={20} />}
              </button>
              <button onClick={() => handleEdit(zone)} className="p-2 text-gray-500 hover:text-gold-400 rounded-lg hover:bg-gray-800 transition-all">
                <Edit2 size={15} />
              </button>
              <button onClick={() => handleDelete(zone.id)} className="p-2 text-gray-500 hover:text-red-400 rounded-lg hover:bg-gray-800 transition-all">
                <Trash2 size={15} />
              </button>
            </div>
          </div>
        ))}
        {zones.length === 0 && (
          <div className="glass rounded-2xl p-12 text-center border border-gray-800/50">
            <MapPin className="text-gray-600 mx-auto mb-3" size={40} />
            <p className="text-gray-500">No hay zonas de delivery configuradas</p>
          </div>
        )}
      </div>
    </div>
  );
}

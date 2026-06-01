import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Plus, Trash2, Edit2, User as UserIcon } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import type { Address, DeliveryZone } from '../types';

export default function Profile() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [zones, setZones] = useState<DeliveryZone[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ label: '', street: '', number: '', notes: '', zoneId: '', isDefault: false });

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const [addrRes, zonesRes] = await Promise.all([
          api.get('/addresses'),
          api.get('/delivery-zones?active=true'),
        ]);
        if (!cancelled) {
          setAddresses(addrRes.data);
          setZones(zonesRes.data);
        }
      } catch { /* silent */ }
      if (!cancelled) setLoading(false);
    }
    load();
    return () => { cancelled = true; };
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/addresses/${editingId}`, form);
        showToast('Direccion actualizada', 'success');
      } else {
        await api.post('/addresses', form);
        showToast('Direccion agregada', 'success');
      }
      const res = await api.get('/addresses');
      setAddresses(res.data);
      setShowForm(false);
      setEditingId(null);
      setForm({ label: '', street: '', number: '', notes: '', zoneId: '', isDefault: false });
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } };
      const msg = typeof axiosErr === 'object' && axiosErr !== null ? axiosErr.response?.data?.message : undefined;
      showToast(msg || 'Error al guardar direccion', 'error');
    }
  }

  async function handleDelete(id: string) {
    try {
      await api.delete(`/addresses/${id}`);
      setAddresses(prev => prev.filter(a => a.id !== id));
      showToast('Direccion eliminada', 'success');
    } catch {
      showToast('Error al eliminar direccion', 'error');
    }
  }

  function handleEdit(addr: Address) {
    setEditingId(addr.id);
    setForm({
      label: addr.label,
      street: addr.street,
      number: addr.number,
      notes: addr.notes || '',
      zoneId: addr.zoneId || '',
      isDefault: addr.isDefault,
    });
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
    <div className="max-w-3xl mx-auto animate-fade-in">
      <div className="mb-8 flex items-center gap-3">
        <Link to="/" className="text-gray-500 hover:text-gold-400 transition-colors p-2 hover:bg-gray-800 rounded-xl">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white">Mi Perfil</h1>
          <p className="text-gray-500 text-sm">Gestiona tus datos y direcciones</p>
        </div>
      </div>

      <div className="glass rounded-2xl p-6 mb-6 border border-gray-800/50">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full gold-gradient flex items-center justify-center">
            <UserIcon className="text-gray-950" size={28} />
          </div>
          <div>
            <h2 className="text-white font-bold text-lg">{user?.name}</h2>
            <p className="text-gray-400 text-sm">{user?.email}</p>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <MapPin size={18} className="text-gold-400" />
            <h2 className="text-white font-bold text-lg">Mis direcciones</h2>
          </div>
          {!showForm && (
            <button
              onClick={() => { setShowForm(true); setEditingId(null); setForm({ label: '', street: '', number: '', notes: '', zoneId: '', isDefault: false }); }}
              className="flex items-center gap-1 px-3 py-1.5 gold-gradient text-gray-950 rounded-lg text-xs font-semibold hover:opacity-90 transition-opacity"
            >
              <Plus size={14} /> Agregar
            </button>
          )}
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} className="glass rounded-2xl p-4 mb-4 border border-gold-500/20 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-gray-400 text-xs mb-1 block">Nombre (ej: Casa, Trabajo)</label>
                <input
                  type="text"
                  required
                  value={form.label}
                  onChange={e => setForm({ ...form, label: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-gold-500"
                  placeholder="Casa"
                />
              </div>
              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="text-gray-400 text-xs mb-1 block">Calle</label>
                  <input
                    type="text"
                    required
                    value={form.street}
                    onChange={e => setForm({ ...form, street: e.target.value })}
                    className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-gold-500"
                    placeholder="Av. Siempre Viva"
                  />
                </div>
                <div className="w-20">
                  <label className="text-gray-400 text-xs mb-1 block">Numero</label>
                  <input
                    type="text"
                    required
                    value={form.number}
                    onChange={e => setForm({ ...form, number: e.target.value })}
                    className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-gold-500"
                    placeholder="742"
                  />
                </div>
              </div>
            </div>
            <div>
              <label className="text-gray-400 text-xs mb-1 block">Zona de entrega</label>
              <select
                value={form.zoneId}
                onChange={e => setForm({ ...form, zoneId: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-gold-500"
              >
                <option value="">Seleccionar zona</option>
                {zones.map(z => (
                  <option key={z.id} value={z.id}>{z.name} - ${(z.basePrice + z.surcharge).toLocaleString('es-AR')}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-gray-400 text-xs mb-1 block">Notas (opcional)</label>
              <input
                type="text"
                value={form.notes}
                onChange={e => setForm({ ...form, notes: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-gold-500"
                placeholder="Depto 3B, timbre 2..."
              />
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.isDefault}
                onChange={e => setForm({ ...form, isDefault: e.target.checked })}
                className="rounded border-gray-600 text-gold-500 focus:ring-gold-500"
              />
              <span className="text-gray-300 text-sm">Direccion predeterminada</span>
            </label>
            <div className="flex gap-2 pt-2">
              <button type="submit" className="flex-1 gold-gradient text-gray-950 font-semibold py-2 rounded-xl hover:opacity-90 transition-opacity text-sm">
                {editingId ? 'Actualizar' : 'Guardar'}
              </button>
              <button type="button" onClick={() => { setShowForm(false); setEditingId(null); }} className="px-4 py-2 bg-gray-800 text-gray-300 rounded-xl hover:bg-gray-700 transition-colors text-sm">
                Cancelar
              </button>
            </div>
          </form>
        )}

        <div className="space-y-2">
          {addresses.map(addr => (
            <div key={addr.id} className="glass rounded-xl p-4 flex items-center justify-between border border-gray-800/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gold-500/10 flex items-center justify-center">
                  <MapPin size={18} className="text-gold-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-white font-medium text-sm">{addr.label}</p>
                    {addr.isDefault && (
                      <span className="text-[10px] bg-gold-500/20 text-gold-400 px-2 py-0.5 rounded-full font-medium">Predeterminada</span>
                    )}
                  </div>
                  <p className="text-gray-400 text-xs">{addr.street} {addr.number}</p>
                  {addr.notes && <p className="text-gray-500 text-xs">{addr.notes}</p>}
                  {addr.zone && <p className="text-gray-500 text-xs">Zona: {addr.zone.name}</p>}
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => handleEdit(addr)} className="p-2 text-gray-500 hover:text-gold-400 transition-colors">
                  <Edit2 size={14} />
                </button>
                <button onClick={() => handleDelete(addr.id)} className="p-2 text-gray-500 hover:text-red-400 transition-colors">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
          {addresses.length === 0 && !showForm && (
            <div className="glass rounded-2xl p-8 text-center">
              <MapPin className="text-gray-600 mx-auto mb-2" size={32} />
              <p className="text-gray-500 text-sm">No tenes direcciones guardadas</p>
              <p className="text-gray-600 text-xs mt-1">Agrega una para hacer tus pedidos mas rapido</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

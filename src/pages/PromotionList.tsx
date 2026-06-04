import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { Plus, Edit2, Trash2, Percent, Edit, Eye } from 'lucide-react';

interface Promotion {
  id: string;
  title: string;
  description: string;
  image?: string;
  price: number;
  originalPrice?: number;
  active: boolean;
  createdAt: string;
}

export default function PromotionList() {
  const [promos, setPromos] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await api.get('/promotions');
        if (!cancelled) setPromos(res.data);
      } catch (error) {
        console.error('Error fetching promotions:', error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  async function handleToggle(id: string, current: boolean) {
    try {
      await api.put(`/promotions/${id}`, { active: !current });
      setPromos(promos.map(p => p.id === id ? { ...p, active: !current } : p));
    } catch (error) {
      console.error('Error toggling promotion:', error);
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm('¿Estás seguro de que deseas eliminar esta promoción?')) return;
    try {
      await api.delete(`/promotions/${id}`);
      setPromos(promos.filter(p => p.id !== id));
    } catch (error) {
      console.error('Error deleting promotion:', error);
    }
  }

  function getImageUrl(image?: string) {
    if (!image) return null;
    if (image.startsWith('/uploads')) return `${(import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:3000')}${image}`;
    return image;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-gray-800 border-t-yellow-500"></div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Promociones</h1>
          <p className="text-gray-500 text-sm">{promos.length} activas</p>
        </div>
        <Link to="/promotions/new" className="inline-flex items-center gap-2 px-4 py-2.5 gold-gradient text-gray-950 rounded-xl hover:opacity-90 transition-opacity text-sm font-semibold">
          <Plus size={16} /> Nueva Promo
        </Link>
      </div>

      {promos.length === 0 ? (
        <div className="glass rounded-xl border border-gray-800/50 p-16 text-center">
          <Percent className="h-12 w-12 text-gray-700 mx-auto mb-3" />
          <p className="text-gray-600">No hay promociones</p>
          <Link to="/promotions/new" className="mt-3 inline-flex items-center gap-2 text-sm text-gold-400 hover:text-gold-300">
            <Plus className="h-4 w-4" /> Crear primera promoción
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {promos.map((promo) => (
            <div key={promo.id} className="glass rounded-xl border border-gray-800/50 overflow-hidden hover:border-gray-700/50 transition-colors">
              <div className="aspect-video bg-gray-900 relative">
                {getImageUrl(promo.image) ? (
                  <img src={getImageUrl(promo.image)!} alt={promo.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Percent size={32} className="text-gray-700" />
                  </div>
                )}
                <div className="absolute top-2 right-2">
                  <button
                    onClick={() => handleToggle(promo.id, promo.active)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm transition-all ${
                      promo.active
                        ? 'bg-green-500/80 text-white'
                        : 'bg-gray-800/80 text-gray-400'
                    }`}
                  >
                    {promo.active ? 'Activa' : 'Inactiva'}
                  </button>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="min-w-0">
                    <h3 className="text-white font-semibold truncate">{promo.title}</h3>
                    <p className="text-gray-500 text-xs line-clamp-2 mt-1">{promo.description}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-baseline gap-2">
                    <span className="text-yellow-400 font-bold text-lg">${promo.price.toLocaleString('es-AR')}</span>
                    {promo.originalPrice && (
                      <span className="text-gray-600 text-sm line-through">${promo.originalPrice.toLocaleString('es-AR')}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <Link to={`/promotions/edit/${promo.id}`} className="p-2 text-gray-500 hover:text-yellow-400 rounded-lg hover:bg-gray-800 transition-all">
                      <Edit2 size={14} />
                    </Link>
                    <button onClick={() => handleDelete(promo.id)} className="p-2 text-gray-500 hover:text-red-400 rounded-lg hover:bg-gray-800 transition-all">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

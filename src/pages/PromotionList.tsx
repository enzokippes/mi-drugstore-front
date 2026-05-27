import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { Plus, Edit2, Trash2, Percent, ToggleLeft, ToggleRight } from 'lucide-react';

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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Promociones</h1>
          <p className="text-gray-400">Gestioná las promos de Barba Negra</p>
        </div>
        <Link to="/promotions/new" className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-500 text-black rounded-lg hover:bg-yellow-400 transition-colors text-sm font-medium">
          <Plus size={16} /> Nueva Promo
        </Link>
      </div>

      <div className="bg-gray-900 rounded-xl border border-gray-800">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Imagen</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Título</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Precio Promo</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Precio Original</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Estado</th>
                <th className="px-5 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {promos.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-gray-600">
                    <div className="flex flex-col items-center gap-2">
                      <Percent className="text-gray-700" size={32} />
                      <p>No hay promociones creadas</p>
                    </div>
                  </td>
                </tr>
              ) : (
                promos.map((promo) => (
                  <tr key={promo.id} className="hover:bg-gray-800/50 transition-colors">
                    <td className="px-5 py-3">
                      {getImageUrl(promo.image) ? (
                        <img src={getImageUrl(promo.image)!} alt={promo.title} className="w-10 h-10 rounded-lg object-cover" />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center text-lg">
                          <Percent size={16} className="text-gray-600" />
                        </div>
                      )}
                    </td>
                    <td className="px-5 py-3">
                      <p className="text-sm font-medium text-white">{promo.title}</p>
                      <p className="text-xs text-gray-500 truncate max-w-[200px]">{promo.description}</p>
                    </td>
                    <td className="px-5 py-3 text-sm text-yellow-400 font-medium">${promo.price.toLocaleString('es-AR')}</td>
                    <td className="px-5 py-3 text-sm text-gray-400">
                      {promo.originalPrice ? `$${promo.originalPrice.toLocaleString('es-AR')}` : '-'}
                    </td>
                    <td className="px-5 py-3">
                      <button
                        onClick={() => handleToggle(promo.id, promo.active)}
                        className="flex items-center gap-1.5"
                      >
                        {promo.active ? (
                          <>
                            <ToggleRight size={22} className="text-green-500" />
                            <span className="text-xs text-green-400">Activa</span>
                          </>
                        ) : (
                          <>
                            <ToggleLeft size={22} className="text-gray-600" />
                            <span className="text-xs text-gray-500">Inactiva</span>
                          </>
                        )}
                      </button>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Link to={`/promotions/edit/${promo.id}`} className="p-2 text-gray-500 hover:text-yellow-400 rounded-lg hover:bg-gray-800 transition-all">
                          <Edit2 size={15} />
                        </Link>
                        <button onClick={() => handleDelete(promo.id)} className="p-2 text-gray-500 hover:text-red-400 rounded-lg hover:bg-gray-800 transition-all">
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

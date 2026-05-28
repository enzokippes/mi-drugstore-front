import { useState, useEffect } from 'react';
import { ArrowLeft, Percent, Plus, ShoppingCart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { getImageUrl } from '../utils/imageUrl';
import { useCart } from '../context/CartContext';
import { useToast } from '../components/Toast';

interface Promotion {
  id: string;
  title: string;
  description: string;
  image?: string;
  price: number;
  originalPrice?: number;
  active: boolean;
}

export default function Promotions() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { addToCart, cartCount } = useCart();
  const [promos, setPromos] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await api.get('/promotions/active');
        if (!cancelled) setPromos(res.data);
      } catch { /* silent */ }
      finally { if (!cancelled) setLoading(false); }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  function handleAddPromo(promo: Promotion) {
    addToCart({
      id: `promo-${promo.id}`,
      name: promo.title,
      price: promo.price,
      stock: 999,
      unlimitedStock: true,
      categoryId: '',
    });
    showToast(`${promo.title} agregado`, 'success');
  }

  return (
    <div className="min-h-screen bg-gray-950">
      <header className="bg-gray-900/95 backdrop-blur border-b border-gray-800/80 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/')}
              className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <div className="flex items-center gap-2">
              <Percent className="text-yellow-400" size={20} />
              <h1 className="text-white font-bold text-lg">Promociones</h1>
            </div>
          </div>
          {cartCount > 0 && (
            <button
              onClick={() => navigate('/')}
              className="relative p-2 text-gray-300 hover:text-white transition-colors"
            >
              <ShoppingCart size={22} />
              <span className="absolute -top-0.5 -right-0.5 bg-green-500 text-white text-[10px] rounded-full w-5 h-5 flex items-center justify-center font-bold">
                {cartCount > 9 ? '9+' : cartCount}
              </span>
            </button>
          )}
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-6">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-gray-800 border-t-yellow-500"></div>
          </div>
        ) : promos.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 rounded-2xl bg-gray-900 border border-gray-800 flex items-center justify-center mx-auto mb-4">
              <Percent className="text-gray-700" size={32} />
            </div>
            <h2 className="text-white font-bold text-xl mb-2">No hay promos activas</h2>
            <p className="text-gray-500 text-sm">Volvé pronto, seguro traemos algo nuevo</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {promos.map(promo => {
              const discount = promo.originalPrice && promo.originalPrice > promo.price
                ? Math.round((1 - promo.price / promo.originalPrice) * 100)
                : null;

              return (
                <div
                  key={promo.id}
                  className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden hover:border-yellow-500/30 transition-all"
                >
                  <div className="aspect-video bg-gray-800 flex items-center justify-center overflow-hidden relative">
                    {promo.image ? (
                      <img
                        src={getImageUrl(promo.image)}
                        alt={promo.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center text-gray-700">
                        <Percent size={48} />
                      </div>
                    )}
                    {discount && (
                      <span className="absolute top-3 right-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-black text-xs font-bold px-2.5 py-1 rounded-full">
                        -{discount}%
                      </span>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="text-white font-bold text-lg mb-1">{promo.title}</h3>
                    <p className="text-gray-400 text-sm mb-3">{promo.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-yellow-400 font-bold text-2xl">
                          ${promo.price.toLocaleString('es-AR')}
                        </span>
                        {promo.originalPrice && promo.originalPrice > promo.price && (
                          <span className="text-gray-500 line-through text-base">
                            ${promo.originalPrice.toLocaleString('es-AR')}
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() => handleAddPromo(promo)}
                        className="bg-yellow-500/20 hover:bg-yellow-500 text-yellow-400 hover:text-black rounded-full p-2.5 transition-all active:scale-90"
                        aria-label={`Agregar ${promo.title}`}
                      >
                        <Plus size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {cartCount > 0 && (
        <button
          onClick={() => navigate('/')}
          className="fixed bottom-6 right-6 z-50 bg-green-600 text-white px-5 py-3.5 rounded-full shadow-lg shadow-green-600/30 hover:bg-green-700 transition-all hover:scale-105 active:scale-95 flex items-center gap-2 font-medium text-sm"
        >
          <ShoppingCart size={18} />
          Ir al carrito ({cartCount})
        </button>
      )}
    </div>
  );
}

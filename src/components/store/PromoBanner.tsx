import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Percent, ChevronLeft, ChevronRight } from 'lucide-react';
import api from '../../services/api';
import { getImageUrl } from '../../utils/imageUrl';

interface Promotion {
  id: string;
  title: string;
  description: string;
  image?: string;
  price: number;
  originalPrice?: number;
}

export default function PromoBanner() {
  const navigate = useNavigate();
  const [promos, setPromos] = useState<Promotion[]>([]);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await api.get('/promotions/active');
        if (!cancelled) setPromos(res.data);
      } catch { /* silent */ }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (promos.length <= 1) return;
    const interval = setInterval(() => {
      setCurrent(prev => (prev + 1) % promos.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [promos.length]);

  if (promos.length === 0) return null;

  const promo = promos[current];

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 pt-4">
      <div
        onClick={() => navigate('/promociones')}
        className="relative cursor-pointer rounded-2xl overflow-hidden border border-gold-500/30 bg-gradient-to-r from-gold-900/20 via-gold-800/10 to-gold-900/20 hover:border-gold-500/50 transition-all group"
      >
        <div className="flex items-stretch">
          {promo.image && (
            <div className="w-24 sm:w-36 shrink-0">
              <img
                src={getImageUrl(promo.image)}
                alt={promo.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <div className="flex-1 p-3 sm:p-4 flex items-center gap-3">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gold-500/20 flex items-center justify-center">
                <Percent className="text-gold-400" size={20} />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-gold-400">Promo</span>
                {promos.length > 1 && (
                  <span className="text-[10px] text-gray-500">{current + 1}/{promos.length}</span>
                )}
              </div>
              <h3 className="text-white font-bold text-sm sm:text-base truncate">{promo.title}</h3>
              <p className="text-gray-400 text-xs sm:text-sm truncate">{promo.description}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="gold-text font-bold text-sm sm:text-lg">${promo.price.toLocaleString('es-AR')}</span>
                {promo.originalPrice && promo.originalPrice > promo.price && (
                  <span className="text-gray-500 line-through text-xs">${promo.originalPrice.toLocaleString('es-AR')}</span>
                )}
              </div>
            </div>
            <div className="hidden sm:flex items-center text-gold-400 text-sm font-medium group-hover:translate-x-1 transition-transform">
              Ver todas →
            </div>
          </div>
        </div>

        {promos.length > 1 && (
          <>
            <button
              onClick={(e) => { e.stopPropagation(); setCurrent(prev => (prev - 1 + promos.length) % promos.length); }}
              className="absolute left-1 top-1/2 -translate-y-1/2 p-1 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
            >
              <ChevronLeft size={14} />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); setCurrent(prev => (prev + 1) % promos.length); }}
              className="absolute right-1 top-1/2 -translate-y-1/2 p-1 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
            >
              <ChevronRight size={14} />
            </button>
          </>
        )}
      </div>
    </div>
  );
}

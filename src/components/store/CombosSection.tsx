import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { getImageUrl } from '../../utils/imageUrl';

interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  stock: number;
  unlimitedStock: boolean;
  image?: string;
  categoryId: string;
  category?: { id: string; name: string };
  isCombo?: boolean;
}

interface CombosSectionProps {
  products: Product[];
  onAdd: (product: Product) => void;
}

export default function CombosSection({ products, onAdd }: CombosSectionProps) {
  const combos = products.filter(p => p.isCombo);
  if (combos.length === 0) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 py-5">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg gold-gradient flex items-center justify-center">
          <span className="text-base">🔥</span>
        </div>
        <div>
          <h2 className="text-white font-bold text-lg">Combos Exclusivos</h2>
          <p className="text-on-surface-variant text-xs">Aprovechá las mejores ofertas</p>
        </div>
      </div>

      <div className="flex overflow-x-auto gap-3 pb-3 snap-x snap-mandatory scrollbar-hide">
        {combos.map(product => (
          <div key={product.id} className="min-w-[260px] md:min-w-[320px] shrink-0 snap-start bg-surface-light border border-surface-border rounded-xl overflow-hidden card-hover group">
            <Link to={`/producto/${product.id}`} className="block">
              <div className="h-48 bg-surface-lighter flex items-center justify-center overflow-hidden relative">
                {product.image ? (
                  <img
                    src={getImageUrl(product.image)}
                    alt={product.name}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-surface-muted">
                    <span className="text-4xl">🎁</span>
                    <span className="text-xs mt-1">{product.name}</span>
                  </div>
                )}
                <div className="absolute top-2 right-2 gold-gradient text-surface-dark text-[10px] font-bold px-2 py-0.5 rounded-full">
                  COMBO
                </div>
              </div>
            </Link>
            <div className="p-4">
              <Link to={`/producto/${product.id}`} className="block">
                <h3 className="text-white font-semibold text-sm line-clamp-2 leading-tight group-hover:text-gold-400 transition-colors">
                  {product.name}
                </h3>
              </Link>
              {product.description && (
                <p className="text-on-surface-variant text-xs mt-1 line-clamp-1">
                  {product.description}
                </p>
              )}
              <div className="flex items-center justify-between mt-2">
                <p className="text-gold-400 font-bold text-base">
                  ${product.price.toLocaleString('es-AR')}
                </p>
                <button
                  onClick={(e) => { e.preventDefault(); onAdd(product); }}
                  className="gold-gradient text-surface-dark w-8 h-8 rounded-full flex items-center justify-center hover:opacity-90 transition-all active:scale-95"
                  aria-label={`Agregar ${product.name}`}
                >
                  <Plus size={16} strokeWidth={2.5} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
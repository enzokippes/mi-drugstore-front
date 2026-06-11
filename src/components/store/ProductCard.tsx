import { Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getImageUrl } from '../../utils/imageUrl';

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  unlimitedStock: boolean;
  image?: string;
  categoryId: string;
  category?: { id: string; name: string };
  isCombo?: boolean;
}

interface ProductCardProps {
  product: Product;
  onAdd: (product: Product) => void;
  trackInventory: boolean;
}

export default function ProductCard({ product, onAdd, trackInventory }: ProductCardProps) {
  const available = isProductAvailable(product, trackInventory);

  return (
    <div
      className={`bg-surface-light border border-surface-border rounded-lg overflow-hidden transition-all duration-300 group flex flex-col ${
        !available ? 'opacity-50 pointer-events-none' : 'hover:border-gold-400/40'
      }`}
    >
      <Link to={`/producto/${product.id}`} className="block">
        <div className="aspect-square bg-surface-lighter relative p-3 flex items-center justify-center overflow-hidden">
          {product.image ? (
            <img
              src={getImageUrl(product.image)}
              alt={product.name}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-surface-muted">
              <span className="text-3xl">📦</span>
              <span className="text-[8px] mt-1">{product.name.slice(0, 12)}</span>
            </div>
          )}
          {product.isCombo && (
            <span className="absolute top-1.5 right-1.5 gold-gradient text-surface-dark text-[8px] font-bold px-1.5 py-0.5 rounded-full shadow-lg">
              COMBO
            </span>
          )}
          <button
            onClick={(e) => { e.preventDefault(); onAdd(product); }}
            disabled={!available}
            className="absolute bottom-3 right-3 gold-gradient text-surface-dark w-7 h-7 rounded-full flex items-center justify-center opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all translate-y-1 md:group-hover:translate-y-0 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label={`Agregar ${product.name}`}
          >
            <Plus size={14} strokeWidth={2.5} />
          </button>
        </div>
      </Link>
      <div className="p-3 space-y-0.5 flex-1">
        <Link to={`/producto/${product.id}`} className="block">
          <h3 className="text-on-surface text-xs font-semibold truncate leading-tight">{product.name}</h3>
        </Link>
        <p className="text-gold-400 font-bold text-sm">
          ${product.price.toLocaleString('es-AR')}
        </p>
      </div>
    </div>
  );
}

function isProductAvailable(product: Product, trackInventory: boolean): boolean {
  if (!trackInventory) return true;
  if (product.unlimitedStock) return true;
  return product.stock > 0;
}
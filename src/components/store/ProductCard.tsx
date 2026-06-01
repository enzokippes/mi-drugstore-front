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
  const stockInfo = getStockDisplay(product, trackInventory);

  return (
    <div
      className={`bg-gray-900/80 border border-gray-800/80 rounded-2xl overflow-hidden transition-all card-hover ${
        !available ? 'opacity-50 pointer-events-none' : 'hover:border-gold-500/30'
      }`}
    >
      <Link to={`/producto/${product.id}`} className="block">
        <div className="aspect-square bg-gray-800/50 flex items-center justify-center overflow-hidden relative">
          {product.image ? (
            <img
              src={getImageUrl(product.image)}
              alt={product.name}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-gray-700">
              <span className="text-4xl sm:text-5xl">📦</span>
              <span className="text-[10px] mt-1 text-gray-600">{product.name.slice(0, 20)}</span>
            </div>
          )}
          {product.isCombo && (
            <span className="absolute top-2 right-2 bg-gradient-to-r from-gold-400 to-gold-600 text-gray-950 text-[10px] font-bold px-2 py-0.5 rounded-full shadow-lg">
              COMBO
            </span>
          )}
          {stockInfo && (
            <span className={`absolute bottom-2 left-2 text-[10px] font-medium px-2 py-0.5 rounded-full bg-black/80 backdrop-blur-sm ${stockInfo.color}`}>
              {stockInfo.text}
            </span>
          )}
        </div>
      </Link>
      <div className="p-2.5 sm:p-3">
        <Link to={`/producto/${product.id}`} className="block">
          <h3 className="text-white text-xs sm:text-sm font-medium line-clamp-2 leading-tight">{product.name}</h3>
        </Link>
        <div className="flex items-center justify-between mt-1.5">
          <p className="gold-text font-bold text-sm sm:text-base">
            ${product.price.toLocaleString('es-AR')}
          </p>
          <button
            onClick={() => onAdd(product)}
            disabled={!available}
            className="bg-gold-500/20 hover:bg-gold-500 text-gold-400 hover:text-gray-950 rounded-full p-1.5 sm:p-2 transition-all active:scale-90 disabled:bg-gray-800 disabled:text-gray-600 border border-gold-500/30 hover:border-gold-500"
            aria-label={`Agregar ${product.name}`}
          >
            <Plus size={16} className="sm:hidden" />
            <Plus size={18} className="hidden sm:inline" />
          </button>
        </div>
      </div>
    </div>
  );
}

function isProductAvailable(product: Product, trackInventory: boolean): boolean {
  if (!trackInventory) return true;
  if (product.unlimitedStock) return true;
  return product.stock > 0;
}

function getStockDisplay(product: Product, trackInventory: boolean): { text: string; color: string } | null {
  if (!trackInventory) return null;
  if (product.unlimitedStock) return null;
  if (product.stock === 0) return { text: 'Sin stock', color: 'text-red-400' };
  if (product.stock <= 10) return { text: `Ultimas ${product.stock} uds`, color: 'text-gold-400' };
  return null;
}

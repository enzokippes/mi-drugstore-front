import { Star } from 'lucide-react';
import ProductCard from './ProductCard';

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

interface FeaturedSectionProps {
  products: Product[];
  onAdd: (product: Product) => void;
  trackInventory: boolean;
}

export default function FeaturedSection({ products, onAdd, trackInventory }: FeaturedSectionProps) {
  if (products.length === 0) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg gold-gradient flex items-center justify-center">
          <Star size={16} className="text-surface-dark" />
        </div>
        <h3 className="text-white font-bold text-lg">Los más pedidos</h3>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-3 snap-x snap-mandatory scrollbar-hide">
        {products.map(product => (
          <div key={product.id} className="w-32 sm:w-36 shrink-0 snap-start">
            <ProductCard
              product={product}
              onAdd={onAdd}
              trackInventory={trackInventory}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

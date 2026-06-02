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

interface CombosSectionProps {
  products: Product[];
  onAdd: (product: Product) => void;
  trackInventory: boolean;
}

export default function CombosSection({ products, onAdd, trackInventory }: CombosSectionProps) {
  const combos = products.filter(p => p.isCombo);
  if (combos.length === 0) return null;

  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-3 py-3">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-lg">🔥</span>
        <h3 className="text-white font-bold text-sm sm:text-base">Combos</h3>
      </div>

      <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-hide">
        {combos.map(product => (
          <div key={product.id} className="w-32 sm:w-40 shrink-0 snap-start">
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

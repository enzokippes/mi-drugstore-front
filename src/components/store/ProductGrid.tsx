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

interface ProductGridProps {
  products: Product[];
  onAdd: (product: Product) => void;
  trackInventory: boolean;
}

export default function ProductGrid({ products, onAdd, trackInventory }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="text-center py-20 px-4">
        <span className="text-5xl block mb-4">📦</span>
        <p className="text-on-surface-variant text-sm">No se encontraron productos</p>
        <p className="text-surface-muted text-xs mt-1">Probá con otra búsqueda o categoría</p>
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-2 sm:gap-3 px-2 sm:px-3">
        {products.map(product => (
          <ProductCard
            key={product.id}
            product={product}
            onAdd={onAdd}
            trackInventory={trackInventory}
          />
        ))}
      </div>
    </div>
  );
}
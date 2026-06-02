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
      <div className="text-center py-16 px-4">
        <span className="text-5xl block mb-3">📦</span>
        <p className="text-gray-500 text-sm">No se encontraron productos</p>
        <p className="text-gray-600 text-xs mt-1">Probá con otra búsqueda o categoría</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-2.5 px-2 sm:px-3">
      {products.map(product => (
        <ProductCard
          key={product.id}
          product={product}
          onAdd={onAdd}
          trackInventory={trackInventory}
        />
      ))}
    </div>
  );
}

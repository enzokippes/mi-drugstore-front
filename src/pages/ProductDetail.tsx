import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Plus, Minus, ShoppingCart, Star, Package } from 'lucide-react';
import api from '../services/api';
import { useCart } from '../context/useCart';
import { useToast } from '../components/useToast';
import { getImageUrl } from '../utils/imageUrl';
import type { Product } from '../types';

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await api.get(`/products/${id}`);
        if (!cancelled) {
          setProduct(res.data);
          const allRes = await api.get('/products');
          const sameCategory = allRes.data.filter(
            (p: Product) => p.categoryId === res.data.categoryId && p.id !== res.data.id
          );
          setRelated(sameCategory.slice(0, 6));
        }
      } catch { /* silent */ }
      if (!cancelled) setLoading(false);
    }
    load();
    return () => { cancelled = true; };
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-gray-800 border-t-gold-500" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <Package className="text-gray-600 mx-auto mb-3" size={48} />
          <p className="text-gray-400 text-lg">Producto no encontrado</p>
          <Link to="/" className="text-gold-400 hover:text-gold-300 mt-2 inline-block">Volver a la tienda</Link>
        </div>
      </div>
    );
  }

  const available = product.unlimitedStock || product.stock > 0;

  function handleAddToCart() {
    if (!product || !available) return;
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    showToast(`${quantity}x ${product.name} agregado`, 'success');
  }

  return (
    <div className="min-h-screen bg-gray-950">
      <header className="glass-dark sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="text-gray-400 hover:text-white transition-colors">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-white font-bold text-lg truncate">{product.name}</h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
        <div className="glass rounded-xl overflow-hidden border border-gray-800/50">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
            <div className="aspect-[4/3] sm:aspect-square bg-gray-800/50 flex items-center justify-center relative">
              {product.image ? (
                <img
                  src={getImageUrl(product.image)}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-8xl">📦</span>
              )}
              {product.isCombo && (
                <span className="absolute top-4 right-4 bg-gradient-to-r from-gold-400 to-gold-600 text-gray-950 text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                  COMBO
                </span>
              )}
              {product.isFeatured && (
                <span className="absolute top-4 left-4 bg-gold-500/20 text-gold-400 text-xs font-bold px-3 py-1 rounded-full border border-gold-500/30 flex items-center gap-1">
                  <Star size={12} /> Destacado
                </span>
              )}
            </div>

            <div className="p-6 flex flex-col">
              {product.category && (
                <span className="text-gold-400 text-xs font-medium uppercase tracking-wider mb-2">
                  {product.category.name}
                </span>
              )}
              <h2 className="text-white text-2xl font-bold mb-2">{product.name}</h2>
              <p className="gold-text text-3xl font-bold mb-4">${product.price.toLocaleString('es-AR')}</p>

              {product.description && (
                <p className="text-gray-400 text-sm leading-relaxed mb-4">{product.description}</p>
              )}

              <div className="mt-auto space-y-4">
                {!available ? (
                  <div className="bg-red-900/20 border border-red-800/30 text-red-400 p-3 rounded-xl text-sm text-center">
                    Sin stock disponible
                  </div>
                ) : (
                  <>
                    {!product.unlimitedStock && product.stock <= 10 && (
                      <p className="text-gold-400 text-xs">Ultimas {product.stock} unidades!</p>
                    )}
                    <div className="flex items-center gap-4">
                      <span className="text-gray-400 text-sm">Cantidad:</span>
                      <div className="flex items-center gap-2 bg-gray-800/80 rounded-xl p-1 border border-gray-700/50">
                        <button
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                          className="p-2 text-gray-400 hover:text-white transition-colors"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="w-8 text-center font-bold text-white">{quantity}</span>
                        <button
                          onClick={() => setQuantity(Math.min(product.unlimitedStock ? 99 : product.stock, quantity + 1))}
                          className="p-2 text-gray-400 hover:text-white transition-colors"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                    </div>
                    <button
                      onClick={handleAddToCart}
                      className="w-full gold-gradient text-gray-950 font-bold py-3 rounded-xl hover:opacity-90 transition-all flex items-center justify-center gap-2"
                    >
                      <ShoppingCart size={18} />
                      Agregar al carrito - ${(product.price * quantity).toLocaleString('es-AR')}
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <div className="mt-6">
            <h3 className="text-white font-bold text-base sm:text-lg mb-3">Productos relacionados</h3>
            <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3">
              {related.map(p => (
                <Link
                  key={p.id}
                  to={`/producto/${p.id}`}
                  className="glass rounded-xl overflow-hidden border border-gray-800/50 card-hover"
                >
                  <div className="aspect-[4/3] bg-gray-800/50 flex items-center justify-center">
                    {p.image ? (
                      <img src={getImageUrl(p.image)} alt={p.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-3xl">📦</span>
                    )}
                  </div>
                  <div className="p-2">
                    <p className="text-white text-[11px] font-medium line-clamp-2">{p.name}</p>
                    <p className="gold-text font-bold text-xs mt-0.5">${p.price.toLocaleString('es-AR')}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

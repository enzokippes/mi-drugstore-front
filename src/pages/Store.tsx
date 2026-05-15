import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Search, MapPin, Phone, Mail, Trash2, Plus, Minus, Package, X } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

interface Category {
  id: string;
  name: string;
}

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  categoryId: string;
  category?: { id: string; name: string };
}

interface CartItem {
  product: Product;
  quantity: number;
}

const categoryIcons: Record<string, string> = {
  Bebidas: '🥤',
  Snacks: '🍿',
  Alcohol: '🍺',
  Helados: '🍦',
};

const Store = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderError, setOrderError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, prodRes] = await Promise.all([
          api.get('/categories'),
          api.get('/products'),
        ]);
        setCategories(catRes.data);
        setProducts(prodRes.data);
        if (catRes.data.length > 0) {
          setSelectedCategory(catRes.data[0].id);
        }
      } catch (error) {
        console.error('Error loading store data:', error);
      } finally {
        setLoadingProducts(false);
      }
    };
    fetchData();
  }, []);

  const filteredProducts = products.filter((p) => {
    const matchesCategory = selectedCategory ? p.categoryId === selectedCategory : true;
    const matchesSearch = search.trim() === '' || p.name.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.product.id === productId
            ? { ...item, quantity: item.quantity + delta }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (cart.length === 0) return;

    try {
      await api.post('/orders', {
        total: cartTotal,
        items: cart.map((item) => ({
          productId: item.product.id,
          quantity: item.quantity,
          price: item.product.price,
        })),
      });
      setCart([]);
      setOrderSuccess(true);
      setOrderError('');
      setTimeout(() => setOrderSuccess(false), 3000);
    } catch (err: any) {
      setOrderError(err.response?.data?.message || 'Error al procesar el pedido.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Top Banner */}
      <header className="bg-gray-900 text-white py-3 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="bg-green-500 rounded-lg p-2">
              <Package className="h-6 w-6 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight">MiDrugstore</span>
          </div>
          <div className="flex items-center gap-5 text-sm text-gray-300 flex-wrap">
            <span className="flex items-center gap-1">
              <MapPin className="h-4 w-4 text-green-400" /> San Martín 123
            </span>
            <span className="flex items-center gap-1">
              <Phone className="h-4 w-4 text-green-400" /> 345-4110830
            </span>
            <span className="flex items-center gap-1">
              <Mail className="h-4 w-4 text-green-400" /> contacto@midrugstore.com
            </span>
          </div>
          {isAuthenticated ? (
            <button
              onClick={() => navigate('/dashboard')}
              className="text-xs bg-green-600 hover:bg-green-700 transition-colors px-3 py-1.5 rounded-full font-medium"
            >
              Panel Admin
            </button>
          ) : (
            <button
              onClick={() => navigate('/login')}
              className="text-xs bg-green-600 hover:bg-green-700 transition-colors px-3 py-1.5 rounded-full font-medium"
            >
              Ingresar
            </button>
          )}
        </div>
      </header>

      {/* Delivery Mode Bar */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center gap-4 text-sm">
          <div className="flex bg-gray-100 rounded-full p-1 gap-1">
            <button className="bg-gray-900 text-white px-4 py-1.5 rounded-full font-medium text-xs">
              Delivery
            </button>
            <button className="text-gray-600 px-4 py-1.5 rounded-full font-medium text-xs hover:bg-gray-200 transition-colors">
              Para retirar
            </button>
          </div>
          <span className="text-gray-400">Horario: 10:00 a 23:00</span>
          <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full font-medium">Disponible</span>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto w-full px-4 py-6 flex gap-6 flex-1">
        {/* Left: Catalog */}
        <div className="flex-1 min-w-0">
          {/* Search */}
          <div className="relative mb-5">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar productos..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl bg-white text-sm outline-none focus:ring-2 focus:ring-green-400 transition-all"
            />
          </div>

          {/* Category Tabs */}
          <div className="flex gap-3 mb-6 overflow-x-auto pb-1">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap border-2 ${
                selectedCategory === null
                  ? 'border-green-500 bg-green-50 text-green-700'
                  : 'border-transparent bg-white text-gray-500 hover:bg-gray-50'
              }`}
            >
              <span className="text-xl">🛒</span>
              <span>Todo</span>
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap border-2 ${
                  selectedCategory === cat.id
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : 'border-transparent bg-white text-gray-500 hover:bg-gray-50'
                }`}
              >
                <span className="text-xl">{categoryIcons[cat.name] || '📦'}</span>
                <span>{cat.name.toUpperCase()}</span>
              </button>
            ))}
          </div>

          {/* Category Title */}
          {selectedCategory && (
            <h2 className="text-base font-bold text-gray-700 uppercase mb-3 tracking-wide">
              {categories.find((c) => c.id === selectedCategory)?.name}
            </h2>
          )}

          {/* Products Grid */}
          {loadingProducts ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl h-28 animate-pulse border border-gray-100" />
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <Package className="h-12 w-12 mx-auto mb-3 opacity-30" />
              <p className="text-sm">No se encontraron productos.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredProducts.map((product) => (
                <button
                  key={product.id}
                  onClick={() => addToCart(product)}
                  disabled={product.stock === 0}
                  className="bg-white rounded-xl border border-gray-100 p-4 flex items-center justify-between hover:shadow-md hover:border-green-200 transition-all text-left group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="flex-1 min-w-0 pr-4">
                    <p className="font-semibold text-gray-800 text-sm truncate group-hover:text-green-700 transition-colors">
                      {product.name}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Stock: {product.stock === 0 ? 'Sin stock' : product.stock}
                    </p>
                    <p className="text-green-600 font-bold mt-1 text-base">
                      ${product.price.toLocaleString('es-AR')}
                    </p>
                  </div>
                  <div className="w-16 h-16 bg-gradient-to-br from-green-50 to-green-100 rounded-lg flex items-center justify-center text-3xl flex-shrink-0">
                    {categoryIcons[product.category?.name || ''] || '📦'}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Cart Sidebar */}
        <aside className="w-80 flex-shrink-0 hidden lg:block">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm sticky top-6 overflow-hidden">
            <div className="bg-gray-900 text-white px-5 py-4 flex items-center justify-between">
              <h2 className="font-bold text-base">Mi pedido</h2>
              <div className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="bg-green-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                    {cartCount}
                  </span>
                )}
              </div>
            </div>

            {orderSuccess && (
              <div className="bg-green-50 border-b border-green-100 px-5 py-3 text-green-700 text-sm font-medium">
                ✅ ¡Pedido realizado con éxito!
              </div>
            )}
            {orderError && (
              <div className="bg-red-50 border-b border-red-100 px-5 py-3 text-red-600 text-sm">
                {orderError}
              </div>
            )}

            <div className="p-4 flex flex-col gap-4 min-h-64">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-48 text-gray-400">
                  <ShoppingCart className="h-12 w-12 mb-3 opacity-20" />
                  <p className="text-sm">Pedido vacío</p>
                  <p className="text-xs mt-1">Agregá productos al carrito</p>
                </div>
              ) : (
                <>
                  <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                    {cart.map((item) => (
                      <div key={item.product.id} className="flex items-center gap-3 text-sm">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-800 truncate text-xs leading-tight">
                            {item.product.name}
                          </p>
                          <p className="text-green-600 font-semibold text-xs">
                            ${(item.product.price * item.quantity).toLocaleString('es-AR')}
                          </p>
                        </div>
                        <div className="flex items-center gap-1.5 bg-gray-100 rounded-lg p-0.5">
                          <button
                            onClick={() => updateQuantity(item.product.id, -1)}
                            className="p-0.5 hover:text-green-600 transition-colors"
                          >
                            <Minus className="h-3.5 w-3.5" />
                          </button>
                          <span className="w-5 text-center font-bold text-xs">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.product.id, 1)}
                            className="p-0.5 hover:text-green-600 transition-colors"
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="text-gray-300 hover:text-red-500 transition-colors"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-gray-100 pt-4 space-y-3">
                    <div className="flex justify-between items-center font-bold text-gray-800">
                      <span>Total</span>
                      <span className="text-green-600 text-lg">${cartTotal.toLocaleString('es-AR')}</span>
                    </div>
                    <button
                      onClick={handleCheckout}
                      className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl transition-colors text-sm"
                    >
                      {isAuthenticated ? 'Confirmar pedido' : 'Iniciar sesión para pedir'}
                    </button>
                    <button
                      onClick={() => setCart([])}
                      className="w-full text-gray-400 hover:text-red-500 text-xs flex items-center justify-center gap-1 transition-colors"
                    >
                      <Trash2 className="h-3.5 w-3.5" /> Vaciar carrito
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Store;

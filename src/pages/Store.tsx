import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../components/Toast';
import StoreHeader from '../components/store/StoreHeader';
import QuickSearch from '../components/store/QuickSearch';
import CombosSection from '../components/store/CombosSection';
import FeaturedSection from '../components/store/FeaturedSection';
import CategoryTabs from '../components/store/CategoryTabs';
import ProductGrid from '../components/store/ProductGrid';
import LocationMap from '../components/store/LocationMap';
import PaymentMethods from '../components/store/PaymentMethods';
import WhatsAppButton from '../components/store/WhatsAppButton';
import CheckoutSheet from '../components/store/CheckoutSheet';
import PromoBanner from '../components/store/PromoBanner';
import type { Category, Product } from '../types';

function generateTimeSlots(): string[] {
  const now = new Date();
  const day = now.getDay();
  const isSunday = day === 0;
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  const currentMinutes = currentHour * 60 + currentMinute;

  const slots: string[] = [];
  const endHour = isSunday ? 23 : 25;

  for (let h = 18; h < endHour; h++) {
    const displayHour = h >= 24 ? h - 24 : h;
    slots.push(`${displayHour.toString().padStart(2, '0')}:00`);
    slots.push(`${displayHour.toString().padStart(2, '0')}:30`);
  }

  return slots.filter(slot => {
    const [h, m] = slot.split(':').map(Number);
    const slotMinutes = h * 60 + m;
    if (h < 12) return true;
    return slotMinutes > currentMinutes;
  });
}

export default function Store() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const { cart, cartTotal, cartCount, addToCart, updateQuantity, removeFromCart, clearCart } = useCart();

  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [trackInventory, setTrackInventory] = useState(true);
  const [timeSlots] = useState<string[]>(generateTimeSlots);
  const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await api.get('/categories');
        if (!cancelled) setCategories(res.data);
      } catch { /* silent */ }
      try {
        const res = await api.get('/products');
        if (!cancelled) setProducts(res.data);
      } catch { /* silent */ }
      try {
        const res = await api.get('/products/featured');
        if (!cancelled) setFeaturedProducts(res.data);
      } catch { /* silent */ }
      try {
        const res = await api.get('/settings');
        if (!cancelled) setTrackInventory(res.data.trackInventory === 'true');
      } catch { /* silent */ }
      if (!cancelled) setInitialLoading(false);
    }
    load();
    return () => { cancelled = true; };
  }, []);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  function handleAddToCart(product: Product) {
    addToCart(product);
    showToast(`${product.name} agregado`, 'success');
  }

  async function handleCheckout(
    deliveryType: 'pickup' | 'delivery',
    address: string,
    phone: string,
    notes: string,
    deliveryTime: string,
    deliveryZoneId?: string
  ) {
    if (cart.length === 0) return;
    if (deliveryType === 'delivery') {
      if (!address.trim()) { showToast('Ingresa tu direccion', 'error'); return; }
      if (!phone.trim()) { showToast('Ingresa tu telefono', 'error'); return; }
      if (!deliveryTime) { showToast('Selecciona un horario', 'error'); return; }
    }

    setLoading(true);
    try {
      const res = await api.post('/orders', {
        total: cartTotal,
        items: cart.map(item => ({
          productId: item.product.id,
          quantity: item.quantity,
          price: item.product.price,
        })),
        deliveryType: deliveryType.toUpperCase(),
        deliveryZoneId: deliveryType === 'delivery' ? deliveryZoneId : undefined,
        address: deliveryType === 'delivery' ? address : undefined,
        phone: deliveryType === 'delivery' ? phone : undefined,
        notes: deliveryType === 'delivery' ? notes : undefined,
        deliveryTime: deliveryType === 'delivery' ? deliveryTime : undefined,
      });

      const orderId = res.data.id;

      try {
        const prefRes = await api.post('/payments/create-preference', { orderId });
        if (prefRes.data?.init_point) {
          clearCart();
          window.location.href = prefRes.data.init_point;
          return;
        }
      } catch {
        // MP not configured
      }

      showToast('Pedido realizado con exito', 'success');
      clearCart();
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } };
      const msg = typeof axiosErr === 'object' && axiosErr !== null ? axiosErr.response?.data?.message : undefined;
      showToast(msg || 'Error al realizar el pedido', 'error');
    } finally {
      setLoading(false);
    }
  }

  const filteredProducts = products.filter(product => {
    const matchesSearch = !searchQuery || product.name.toLowerCase().includes(searchQuery.toLowerCase());
    let matchesCategory = true;
    if (selectedCategory) {
      const selectedCat = categories.find(c => c.id === selectedCategory);
      if (selectedCat && selectedCat.children && selectedCat.children.length > 0) {
        const childIds = selectedCat.children.map(c => c.id);
        matchesCategory = product.categoryId === selectedCategory || childIds.includes(product.categoryId);
      } else {
        matchesCategory = product.categoryId === selectedCategory;
      }
    }
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-950">
      <StoreHeader cartCount={cartCount} onCartClick={() => {
        if (cartCount === 0) { showToast('Carrito vacio!', 'error'); return; }
        setCartOpen(true);
      }} />

      <main id="main-content">
        <section className="bg-gradient-to-br from-gray-900 via-gray-900 to-gold-950/30 pt-6 pb-8 px-3 sm:px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-3">
              <img src="/logo.jpeg" alt="Barba Negra" className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover shadow-lg ring-2 ring-gold-500/30" />
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-2">Barba Negra <span className="gold-text">Drugstore</span></h2>
            <p className="text-gray-400 text-sm sm:text-lg mb-4">Tu Drugstore, siempre cerca tuyo</p>
            <div className="inline-flex flex-wrap items-center justify-center gap-x-3 gap-y-1 glass rounded-full px-4 py-2 text-xs sm:text-sm text-gray-300">
              <span>📌 H. Primo ESQ Balcarce</span>
              <span className="text-gray-600">•</span>
              <span>🕐 Lun a Sab 7:00 - 1:00</span>
            </div>
          </div>
        </section>

        <div className="sticky top-[56px] z-40 bg-gray-950/90 backdrop-blur pt-3 pb-1.5">
          <QuickSearch
            products={products.map(p => ({ id: p.id, name: p.name, price: p.price }))}
            onSelect={(productId) => {
              setSelectedCategory(null);
              setSearchQuery(products.find(p => p.id === productId)?.name || '');
            }}
            onSearch={handleSearch}
          />
        </div>

        <PromoBanner />

        <FeaturedSection
          products={featuredProducts}
          onAdd={handleAddToCart}
          trackInventory={trackInventory}
        />

        <CombosSection
          products={products}
          onAdd={handleAddToCart}
          trackInventory={trackInventory}
        />

        <CategoryTabs
          categories={categories}
          selected={selectedCategory}
          onSelect={setSelectedCategory}
        />

        {initialLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-3 px-3 sm:px-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden animate-pulse">
                <div className="aspect-square bg-gray-800" />
                <div className="p-3 space-y-2">
                  <div className="h-4 bg-gray-800 rounded w-3/4" />
                  <div className="h-3 bg-gray-800 rounded w-1/2" />
                  <div className="flex justify-between items-center pt-1">
                    <div className="h-5 bg-gray-800 rounded w-16" />
                    <div className="h-8 bg-gray-800 rounded-lg w-20" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <ProductGrid
            products={filteredProducts}
            onAdd={handleAddToCart}
            trackInventory={trackInventory}
          />
        )}

        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4">
          <div className="glass rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-lg">🏪</span>
              <div>
                <p className="text-white font-medium text-sm">Envio a domicilio?</p>
                <p className="text-gray-500 text-xs">Selecciona retiro o delivery en el carrito</p>
              </div>
            </div>
            <button
              onClick={() => {
                if (!isAuthenticated) { navigate('/login'); return; }
                if (cartCount === 0) { showToast('Carrito vacio!', 'error'); return; }
                setCartOpen(true);
              }}
              className="flex items-center gap-1.5 px-4 py-2 gold-gradient text-gray-950 rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity"
            >
              {isAuthenticated ? 'Ir al carrito' : 'Ingresa para pedir'}
            </button>
          </div>
        </div>

        <LocationMap />
        <PaymentMethods />
      </main>

      {cartOpen && (
        <CheckoutSheet
          cart={cart}
          cartTotal={cartTotal}
          cartCount={cartCount}
          onUpdateQuantity={updateQuantity}
          onRemoveItem={removeFromCart}
          onClearCart={clearCart}
          onCheckout={handleCheckout}
          isAuthenticated={isAuthenticated}
          loading={loading}
          timeSlots={timeSlots}
          isOpen={cartOpen}
          onOpen={() => setCartOpen(true)}
          onClose={() => setCartOpen(false)}
        />
      )}

      <WhatsAppButton
        cartItems={cart}
        cartCount={cartCount}
      />

      <footer className="border-t border-gray-800/50 py-6 px-3 sm:px-4 mt-8">
        <div className="max-w-7xl mx-auto text-center text-gray-600 text-xs">
          <p className="mb-1">Barba Negra Drugstore &copy; {new Date().getFullYear()}</p>
          <p>Humberto Primo ESQ Balcarce, Concordia, Entre Rios</p>
        </div>
      </footer>
    </div>
  );
}

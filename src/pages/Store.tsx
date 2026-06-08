import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../components/Toast';
import StoreHeader from '../components/store/StoreHeader';
import QuickSearch from '../components/store/QuickSearch';
import FeaturedSection from '../components/store/FeaturedSection';
import CombosSection from '../components/store/CombosSection';
import CategoryTabs from '../components/store/CategoryTabs';
import ProductGrid from '../components/store/ProductGrid';
import LocationMap from '../components/store/LocationMap';
import WhatsAppButton from '../components/store/WhatsAppButton';
import CheckoutSheet from '../components/store/CheckoutSheet';
import PromoBanner from '../components/store/PromoBanner';
import Footer from '../components/store/Footer';
import MobileBottomNav from '../components/store/MobileBottomNav';
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

  function handleCategorySelect(categoryId: string | null) {
    setSelectedCategory(categoryId);
    const element = document.getElementById('products-anchor');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  function handleCategorySelectByName(categoryName: string | null) {
    if (!categoryName) {
      setSelectedCategory(null);
      return;
    }
    const found = categories.find(
      c => c.name.toLowerCase() === categoryName.toLowerCase()
    );
    setSelectedCategory(found?.id || null);
    const element = document.getElementById('products-anchor');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
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
      await api.post('/orders', {
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
    <div className="min-h-screen bg-surface">
      <StoreHeader
        cartCount={cartCount}
        onCartClick={() => {
          if (cartCount === 0) { showToast('Carrito vacio!', 'error'); return; }
          setCartOpen(true);
        }}
        onCategoryClick={handleCategorySelectByName}
      />

      <main id="main-content" className="pb-20 md:pb-0">
        <PromoBanner />

        <CombosSection
          products={products}
          onAdd={handleAddToCart}
        />

        <div id="products-anchor" className="h-0" style={{ scrollMarginTop: '140px' }} />

        <div className="sticky top-16 lg:top-20 z-40 bg-surface/95 backdrop-blur-md py-3 border-b border-surface-border">
          <div className="max-w-7xl mx-auto px-4 flex flex-col gap-3">
            <QuickSearch
              products={products.map(p => ({ id: p.id, name: p.name, price: p.price }))}
              onSelect={(productId) => {
                setSelectedCategory(null);
                setSearchQuery(products.find(p => p.id === productId)?.name || '');
              }}
              onSearch={handleSearch}
            />
            <CategoryTabs
              categories={categories}
              selected={selectedCategory}
              onSelect={handleCategorySelect}
            />
          </div>
        </div>

        <FeaturedSection
          products={featuredProducts}
          onAdd={handleAddToCart}
          trackInventory={trackInventory}
        />

        <section id="products-section" className="py-6">
          {initialLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 px-4">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="bg-surface-light border border-surface-border rounded-2xl overflow-hidden animate-pulse">
                  <div className="aspect-square bg-surface-lighter" />
                  <div className="p-3 space-y-2">
                    <div className="h-4 bg-surface-lighter rounded w-3/4" />
                    <div className="h-3 bg-surface-lighter rounded w-1/2" />
                    <div className="flex justify-between items-center pt-1">
                      <div className="h-5 bg-surface-lighter rounded w-16" />
                      <div className="h-8 bg-surface-lighter rounded-full w-8" />
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
        </section>

        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="glass rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl gold-gradient flex items-center justify-center">
                <span className="text-xl">🚚</span>
              </div>
              <div>
                <p className="text-white font-semibold text-sm">¿Envío a domicilio?</p>
                <p className="text-on-surface-variant text-xs mt-0.5">Retiro en local o delivery en Concordia</p>
              </div>
            </div>
            <button
              onClick={() => {
                if (!isAuthenticated) { navigate('/login'); return; }
                if (cartCount === 0) { showToast('Carrito vacío!', 'error'); return; }
                setCartOpen(true);
              }}
              className="flex items-center gap-2 px-5 py-2.5 gold-gradient text-surface-dark rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity"
            >
              {isAuthenticated ? 'Ir al carrito' : 'Ingresá para pedir'}
            </button>
          </div>
        </div>

        <LocationMap />

        <Footer />
      </main>

      <MobileBottomNav cartCount={cartCount} onCartClick={() => setCartOpen(true)} />

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
          onClose={() => setCartOpen(false)}
        />
      )}

      <WhatsAppButton
        cartItems={cart}
        cartCount={cartCount}
      />
    </div>
  );
}
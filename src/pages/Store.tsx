import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../components/Toast';
import StoreHeader from '../components/store/StoreHeader';
import CombosSection from '../components/store/CombosSection';
import FeaturedSection from '../components/store/FeaturedSection';
import CategoryTabs from '../components/store/CategoryTabs';
import ProductGrid from '../components/store/ProductGrid';
import LocationMap from '../components/store/LocationMap';
import PaymentMethods from '../components/store/PaymentMethods';
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
      if (!address.trim()) { showToast('Ingresá tu dirección', 'error'); return; }
      if (!phone.trim()) { showToast('Ingresá tu teléfono', 'error'); return; }
      if (!deliveryTime) { showToast('Seleccioná un horario', 'error'); return; }
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

      showToast('Pedido realizado con éxito', 'success');
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
    <div className="min-h-screen bg-background">
      <StoreHeader cartCount={cartCount} onCartClick={() => {
        if (cartCount === 0) { showToast('Carrito vacío!', 'error'); return; }
        setCartOpen(true);
      }} />

      <main id="main-content" className="pt-20 pb-20 md:pb-12">
        {/* Promo Banner - Hero Section */}
        <PromoBanner />

        {/* Featured Products */}
        <FeaturedSection
          products={featuredProducts}
          onAdd={handleAddToCart}
          trackInventory={trackInventory}
        />

        {/* Combos Section */}
        <CombosSection
          products={products}
          onAdd={handleAddToCart}
          trackInventory={trackInventory}
        />

        {/* Category Tabs with Search */}
        <CategoryTabs
          categories={categories}
          selected={selectedCategory}
          onSelect={setSelectedCategory}
          onSearch={handleSearch}
          searchQuery={searchQuery}
        />

        {/* Product Grid */}
        {initialLoading ? (
          <div className="max-w-container-max mx-auto px-4 lg:px-margin-desktop">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="bg-surface-container-low border border-outline-variant rounded-xl overflow-hidden animate-pulse">
                  <div className="aspect-square bg-surface-container" />
                  <div className="p-4 space-y-2">
                    <div className="h-4 bg-surface-container rounded w-3/4" />
                    <div className="h-5 bg-surface-container rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="max-w-container-max mx-auto px-4 lg:px-margin-desktop">
            <ProductGrid
              products={filteredProducts}
              onAdd={handleAddToCart}
              trackInventory={trackInventory}
            />
          </div>
        )}

        {/* Delivery CTA */}
        <div className="max-w-container-max mx-auto px-4 lg:px-margin-desktop py-6">
          <div className="bg-surface-container rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-outline-variant">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-surface-container-high flex items-center justify-center">
                <span className="material-symbols-outlined text-primary">local_shipping</span>
              </div>
              <div>
                <p className="text-on-surface font-medium font-title-md">Envío a domicilio</p>
                <p className="text-on-surface-variant text-sm">Delivery 24/7 en toda la ciudad</p>
              </div>
            </div>
            <button
              onClick={() => {
                if (!isAuthenticated) { navigate('/login'); return; }
                if (cartCount === 0) { showToast('Carrito vacío!', 'error'); return; }
                setCartOpen(true);
              }}
              className="bg-primary-container text-on-primary font-bold px-6 py-3 rounded-lg hover:brightness-110 transition-all"
            >
              {isAuthenticated ? 'Ir al carrito' : 'Ingresá para pedir'}
            </button>
          </div>
        </div>

        {/* Map Section */}
        <div className="max-w-container-max mx-auto px-4 lg:px-margin-desktop">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter">
            <div className="lg:col-span-2 rounded-2xl overflow-hidden h-80 border border-outline-variant relative">
              <iframe
                src={`https://maps.google.com/maps?q=-31.385226592108864,-58.02879512303576&z=18&ie=UTF8&iwloc=&output=embed`}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Barba Negra Drugstore - Ubicación"
                className="grayscale brightness-50"
              />
              <div className="absolute bottom-4 left-4 bg-surface-container/90 backdrop-blur-md p-4 rounded-xl border border-outline-variant">
                <h3 className="font-title-md text-title-md text-on-surface">Visitá nuestro local</h3>
                <p className="text-on-surface-variant text-sm">H. Primo ESQ Balcarce, Concordia</p>
                <p className="text-primary-container text-xs mt-1">Abierto 24/7 • Delivery disponible</p>
              </div>
            </div>
            <div className="bg-surface-container-high rounded-2xl p-8 border border-outline-variant flex flex-col justify-center space-y-4">
              <h3 className="font-headline-lg text-headline-lg">24/7 Drugstore</h3>
              <p className="text-on-surface-variant">Tu drugstore de confianza las 24 horas. Productos de calidad para el estilo de vida moderno.</p>
              <div className="space-y-2 text-sm text-on-surface-variant">
                <p className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">location_on</span>
                  H. Primo ESQ Balcarce
                </p>
                <p className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">phone</span>
                  +54 9 345 4322631
                </p>
                <p className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">schedule</span>
                  Abierto las 24 horas
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <PaymentMethods />

        {/* Footer */}
        <Footer />
      </main>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav onCartClick={() => {
        if (cartCount === 0) { showToast('Carrito vacío!', 'error'); return; }
        setCartOpen(true);
      }} />

      {/* Checkout Sheet */}
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

      {/* WhatsApp Button */}
      <WhatsAppButton
        cartItems={cart}
        cartCount={cartCount}
      />
    </div>
  );
}
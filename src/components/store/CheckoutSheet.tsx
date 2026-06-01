import { useState, useEffect } from 'react';
import { X, Minus, Plus, CheckCircle, ShoppingCart, Trash2, Store as StoreIcon, Truck, MapPin } from 'lucide-react';
import api from '../../services/api';
import type { DeliveryZone, Address } from '../../types';

interface Product {
  id: string;
  name: string;
  price: number;
}

interface CartItem {
  product: Product;
  quantity: number;
}

interface CheckoutSheetProps {
  cart: CartItem[];
  cartTotal: number;
  cartCount: number;
  onUpdateQuantity: (productId: string, delta: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  onCheckout: (deliveryType: 'pickup' | 'delivery', address: string, phone: string, notes: string, deliveryTime: string, deliveryZoneId?: string) => void;
  isAuthenticated: boolean;
  loading: boolean;
  timeSlots: string[];
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export default function CheckoutSheet({
  cart,
  cartTotal,
  cartCount,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onCheckout,
  isAuthenticated,
  loading,
  timeSlots,
  isOpen,
  onOpen,
  onClose,
}: CheckoutSheetProps) {
  const [step, setStep] = useState<'cart' | 'delivery_form'>('cart');
  const [deliveryType, setDeliveryType] = useState<'pickup' | 'delivery'>('pickup');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [deliveryTime, setDeliveryTime] = useState('');
  const [error, setError] = useState('');
  const [zones, setZones] = useState<DeliveryZone[]>([]);
  const [selectedZone, setSelectedZone] = useState<string>('');
  const [savedAddresses, setSavedAddresses] = useState<Address[]>([]);

  useEffect(() => {
    let cancelled = false;
    async function loadZones() {
      try {
        const res = await api.get('/delivery-zones?active=true');
        if (!cancelled) setZones(res.data);
      } catch { /* silent */ }
    }
    loadZones();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (deliveryType === 'delivery' && isAuthenticated) {
      let cancelled = false;
      async function loadAddresses() {
        try {
          const res = await api.get('/addresses');
          if (!cancelled) setSavedAddresses(res.data);
        } catch { /* silent */ }
      }
      loadAddresses();
      return () => { cancelled = true; };
    } else {
      setSavedAddresses([]);
    }
  }, [deliveryType, isAuthenticated]);

  useEffect(() => {
    if (deliveryType === 'delivery' && zones.length > 0 && !selectedZone) {
      setSelectedZone(zones[0].id);
    }
  }, [deliveryType, zones, selectedZone]);

  const selectedZoneData = zones.find(z => z.id === selectedZone);
  const deliveryCost = selectedZoneData ? selectedZoneData.basePrice + selectedZoneData.surcharge : 0;
  const finalTotal = cartTotal + (deliveryType === 'delivery' ? deliveryCost : 0);

  function selectSavedAddress(addr: Address) {
    setAddress(`${addr.street} ${addr.number}`);
    setNotes(addr.notes || '');
    if (addr.zoneId) setSelectedZone(addr.zoneId);
  }

  if (cartCount === 0) return null;

  function handleConfirm() {
    setError('');
    if (deliveryType === 'delivery') {
      if (step === 'cart') {
        setStep('delivery_form');
        return;
      }
      if (!selectedZone) { setError('Selecciona una zona de entrega'); return; }
      if (!address.trim()) { setError('Ingresa tu direccion'); return; }
      if (!phone.trim()) { setError('Ingresa tu telefono'); return; }
      if (!deliveryTime) { setError('Selecciona un horario'); return; }
    }
    onCheckout(deliveryType, address, phone, notes, deliveryTime, deliveryType === 'delivery' ? selectedZone : undefined);
    onClose();
    setStep('cart');
    setAddress('');
    setPhone('');
    setNotes('');
    setDeliveryTime('');
    setSelectedZone('');
    setError('');
  }

  function handleOpen() {
    setStep('cart');
    setDeliveryType('pickup');
    setError('');
    onOpen();
  }

  function handleClose() {
    onClose();
    setStep('cart');
    setError('');
  }

  return (
    <>
      <button
        onClick={handleOpen}
        className="lg:hidden fixed bottom-6 right-6 z-50 gold-gradient text-gray-950 p-4 rounded-full shadow-lg shadow-gold-500/30 hover:opacity-90 transition-all hover:scale-110 active:scale-95"
        aria-label="Ver carrito"
      >
        <ShoppingCart className="h-5 w-5" />
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
          {cartCount > 9 ? '9+' : cartCount}
        </span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/80" onClick={handleClose}>
          <div
            className="absolute bottom-0 left-0 right-0 bg-gray-900 border-t border-gold-500/20 rounded-t-3xl max-h-[85vh] flex flex-col transition-transform duration-200 ease-out"
            onClick={e => e.stopPropagation()}
            style={{ transform: 'translateY(0)' }}
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800 shrink-0">
              <div>
                <h2 className="font-bold text-white text-base">
                  {step === 'cart' ? 'Mi pedido' : 'Datos de envio'}
                </h2>
                {step === 'delivery_form' && (
                  <button
                    onClick={() => setStep('cart')}
                    className="text-gold-400 text-xs mt-0.5 hover:underline"
                  >
                    ← Volver al carrito
                  </button>
                )}
              </div>
              <button onClick={handleClose} className="text-gray-500 hover:text-white p-1">
                <X className="h-5 w-5" />
              </button>
            </div>

            {step === 'cart' && (
              <>
                <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2">
                  {cart.map(item => (
                    <div key={item.product.id} className="flex items-center gap-3 bg-gray-800/60 rounded-xl p-3 border border-gray-700/30">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-white truncate text-sm">{item.product.name}</p>
                        <p className="gold-text font-semibold text-xs mt-0.5">
                          ${(item.product.price * item.quantity).toLocaleString('es-AR')}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 bg-gray-700/80 rounded-lg p-0.5 border border-gray-600/30">
                        <button onClick={() => onUpdateQuantity(item.product.id, -1)} className="p-1.5 text-gray-400 hover:text-white">
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="w-6 text-center font-bold text-xs text-white">{item.quantity}</span>
                        <button onClick={() => onUpdateQuantity(item.product.id, 1)} className="p-1.5 text-gray-400 hover:text-white">
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                      <button onClick={() => onRemoveItem(item.product.id)} className="text-gray-600 hover:text-red-400 p-1">
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}

                  <button onClick={onClearCart} className="flex items-center gap-1 text-gray-600 hover:text-red-400 text-xs py-1 transition-colors">
                    <Trash2 className="h-3 w-3" />
                    Vaciar carrito
                  </button>
                </div>

                <div className="border-t border-gray-800 px-4 py-3 space-y-3 bg-gray-900/95 shrink-0">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setDeliveryType('pickup')}
                      className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-xs font-medium transition-all ${
                        deliveryType === 'pickup' ? 'gold-gradient text-gray-950' : 'bg-gray-800 text-gray-400 border border-gray-700/50'
                      }`}
                    >
                      <StoreIcon size={15} />
                      Retiro
                    </button>
                    <button
                      onClick={() => { if (isAuthenticated) setDeliveryType('delivery'); }}
                      className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-xs font-medium transition-all ${
                        deliveryType === 'delivery' ? 'gold-gradient text-gray-950' : 'bg-gray-800 text-gray-400 border border-gray-700/50'
                      }`}
                    >
                      <Truck size={15} />
                      Delivery
                    </button>
                  </div>

                  {deliveryType === 'delivery' && zones.length > 0 && (
                    <div>
                      <label className="text-gray-400 text-xs mb-1.5 block flex items-center gap-1">
                        <MapPin size={12} />
                        Zona de entrega
                      </label>
                      <div className="grid grid-cols-2 gap-1.5">
                        {zones.map(zone => (
                          <button
                            key={zone.id}
                            onClick={() => setSelectedZone(zone.id)}
                            className={`px-3 py-2 rounded-lg text-xs font-medium transition-all text-left ${
                              selectedZone === zone.id
                                ? 'bg-gold-500/20 text-gold-400 border border-gold-500/50'
                                : 'bg-gray-800 text-gray-300 border border-gray-700/50 hover:border-gray-600'
                            }`}
                          >
                            <span className="block">{zone.name}</span>
                            <span className="text-[10px] opacity-70">${(zone.basePrice + zone.surcharge).toLocaleString('es-AR')}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {error && (
                    <p className="text-red-400 text-xs text-center">{error}</p>
                  )}

                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 text-sm">Productos</span>
                      <span className="text-white text-sm">${cartTotal.toLocaleString('es-AR')}</span>
                    </div>
                    {deliveryType === 'delivery' && selectedZoneData && (
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400 text-sm">Envio ({selectedZoneData.name})</span>
                        <span className="text-white text-sm">${deliveryCost.toLocaleString('es-AR')}</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center pt-1 border-t border-gray-800">
                      <span className="text-gray-400 text-sm font-medium">Total</span>
                      <span className="gold-text font-bold text-xl">${finalTotal.toLocaleString('es-AR')}</span>
                    </div>
                  </div>

                  <button
                    onClick={handleConfirm}
                    disabled={loading}
                    className="w-full gold-gradient hover:opacity-90 disabled:opacity-50 text-gray-950 font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <span className="animate-spin w-5 h-5 border-2 border-gray-950/30 border-t-gray-950 rounded-full" />
                    ) : (
                      <>
                        <CheckCircle size={18} />
                        {deliveryType === 'delivery' ? 'Completar datos' : 'Confirmar pedido'}
                      </>
                    )}
                  </button>
                </div>
              </>
            )}

            {step === 'delivery_form' && (
              <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 flex flex-col">
                {savedAddresses.length > 0 && (
                  <div>
                    <label className="text-gray-400 text-xs mb-1.5 block flex items-center gap-1">
                      <MapPin size={12} />
                      Direcciones guardadas
                    </label>
                    <div className="space-y-1.5">
                      {savedAddresses.map(addr => (
                        <button
                          key={addr.id}
                          onClick={() => selectSavedAddress(addr)}
                          className={`w-full text-left px-3 py-2.5 rounded-xl text-xs transition-all flex items-center gap-2 ${
                            address === `${addr.street} ${addr.number}`
                              ? 'bg-gold-500/20 text-gold-400 border border-gold-500/50'
                              : 'bg-gray-800/80 text-gray-300 border border-gray-700/50 hover:border-gray-600'
                          }`}
                        >
                          <MapPin size={14} className="shrink-0 text-gold-400/60" />
                          <div className="min-w-0">
                            <span className="font-medium block truncate">{addr.label}: {addr.street} {addr.number}</span>
                            {addr.notes && <span className="text-[10px] text-gray-500 block truncate">{addr.notes}</span>}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <label className="text-gray-400 text-xs mb-1.5 block flex items-center gap-1">
                    <MapPin size={12} />
                    Zona de entrega *
                  </label>
                  <div className="grid grid-cols-2 gap-1.5">
                    {zones.map(zone => (
                      <button
                        key={zone.id}
                        onClick={() => setSelectedZone(zone.id)}
                        className={`px-3 py-2 rounded-lg text-xs font-medium transition-all text-left ${
                          selectedZone === zone.id
                            ? 'bg-gold-500/20 text-gold-400 border border-gold-500/50'
                            : 'bg-gray-800 text-gray-300 border border-gray-700/50 hover:border-gray-600'
                        }`}
                      >
                        <span className="block">{zone.name}</span>
                        <span className="text-[10px] opacity-70">${(zone.basePrice + zone.surcharge).toLocaleString('es-AR')}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <input
                  type="text"
                  placeholder="Direccion de entrega *"
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  className="bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500/30"
                />
                <input
                  type="tel"
                  placeholder="Telefono de contacto *"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500/30"
                />
                <textarea
                  placeholder="Notas adicionales (opcional)"
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  rows={2}
                  className="bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500/30 resize-none"
                />
                <div>
                  <label className="text-gray-400 text-xs mb-2 block">Horario de entrega</label>
                  {timeSlots.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5">
                      {timeSlots.map(slot => (
                        <button
                          key={slot}
                          onClick={() => setDeliveryTime(slot)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                            deliveryTime === slot
                              ? 'gold-gradient text-gray-950'
                              : 'bg-gray-800 text-gray-300 border border-gray-700'
                          }`}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <p className="text-red-400 text-xs">No hay horarios disponibles hoy</p>
                  )}
                </div>

                {selectedZoneData && (
                  <div className="bg-gray-800/60 rounded-xl p-3 border border-gold-500/20">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 text-sm">Envio ({selectedZoneData.name})</span>
                      <span className="gold-text font-bold">${deliveryCost.toLocaleString('es-AR')}</span>
                    </div>
                    <div className="flex justify-between items-center mt-1 pt-1 border-t border-gray-700">
                      <span className="text-white text-sm font-medium">Total con envio</span>
                      <span className="gold-text font-bold text-lg">${finalTotal.toLocaleString('es-AR')}</span>
                    </div>
                  </div>
                )}

                {error && (
                  <p className="text-red-400 text-xs text-center">{error}</p>
                )}

                <button
                  onClick={handleConfirm}
                  disabled={loading}
                  className="mt-auto w-full gold-gradient hover:opacity-90 disabled:opacity-50 text-gray-950 font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <span className="animate-spin w-5 h-5 border-2 border-gray-950/30 border-t-gray-950 rounded-full" />
                  ) : (
                    <>
                      <CheckCircle size={18} />
                      Confirmar pedido
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

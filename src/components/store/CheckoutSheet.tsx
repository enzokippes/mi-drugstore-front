import { useState, useEffect, useMemo, useCallback, memo } from 'react';
import { X, CheckCircle, Trash2, Store as StoreIcon, Truck, MapPin } from 'lucide-react';
import api from '../../services/api';
import type { DeliveryZone, Address } from '../../types';
import CartItemRow from './CartItemRow';

interface Product {
  id: string;
  name: string;
  price: number;
}

interface CartItem {
  product: Product;
  quantity: number;
  isReward?: boolean;
  rewardId?: string;
  rewardPointsCost?: number;
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
  onClose: () => void;
}

const CheckoutSheet = memo(function CheckoutSheet({
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
  onClose,
}: CheckoutSheetProps) {
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
    if (deliveryType === 'pickup') {
      setSelectedZone('');
      setAddress('');
      setPhone('');
      setNotes('');
      setDeliveryTime('');
    }
  }, [deliveryType, zones, selectedZone]);

  const selectedZoneData = useMemo(() => zones.find(z => z.id === selectedZone), [zones, selectedZone]);
  const deliveryCost = useMemo(() => selectedZoneData ? selectedZoneData.basePrice + selectedZoneData.surcharge : 0, [selectedZoneData]);
  const finalTotal = useMemo(() => cartTotal + (deliveryType === 'delivery' ? deliveryCost : 0), [cartTotal, deliveryType, deliveryCost]);

  const totalRewardPoints = useMemo(() => {
    return cart
      .filter(item => item.isReward && item.rewardPointsCost)
      .reduce((sum, item) => sum + (item.rewardPointsCost || 0), 0);
  }, [cart]);

  const selectSavedAddress = useCallback((addr: Address) => {
    setAddress(`${addr.street} ${addr.number}`);
    setNotes(addr.notes || '');
    if (addr.zoneId) setSelectedZone(addr.zoneId);
  }, []);

  const handleClose = useCallback(() => {
    onClose();
    setError('');
  }, [onClose]);

  const handleConfirm = useCallback(() => {
    setError('');
    if (deliveryType === 'delivery') {
      if (!selectedZone) { setError('Selecciona una zona de entrega'); return; }
      if (!address.trim()) { setError('Ingresa tu direccion'); return; }
      if (!phone.trim()) { setError('Ingresa tu telefono'); return; }
      if (!deliveryTime) { setError('Selecciona un horario'); return; }
    }
    onCheckout(deliveryType, address, phone, notes, deliveryTime, deliveryType === 'delivery' ? selectedZone : undefined);
    onClose();
    setDeliveryType('pickup');
    setAddress('');
    setPhone('');
    setNotes('');
    setDeliveryTime('');
    setSelectedZone('');
    setError('');
  }, [deliveryType, selectedZone, address, phone, notes, deliveryTime, onCheckout, onClose]);

  if (cartCount === 0) return null;

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 md:backdrop-blur-sm" onClick={handleClose}>
          <div
            className="absolute right-0 top-0 h-full w-full md:w-[400px] bg-surface-dark border-l border-surface-border flex flex-col transition-transform duration-300"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-surface-border shrink-0">
              <div className="flex items-center gap-2">
                <span className="text-lg">👑</span>
                <h2 className="font-bold text-white text-base">Mi pedido</h2>
              </div>
              <button onClick={handleClose} className="p-1.5 text-surface-muted hover:text-white rounded-lg hover:bg-surface-light transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2">
              {cart.map(item => (
                <CartItemRow
                  key={item.product.id}
                  item={item}
                  onUpdateQuantity={onUpdateQuantity}
                  onRemoveItem={onRemoveItem}
                />
              ))}

              <button
                onClick={onClearCart}
                className="flex items-center gap-1.5 text-surface-muted hover:text-red-400 text-xs py-1.5 transition-colors"
              >
                <Trash2 className="h-3 w-3" />
                Vaciar carrito
              </button>
            </div>

            <div className="border-t border-surface-border px-4 py-3 space-y-3 shrink-0">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setDeliveryType('pickup')}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-xs font-medium transition-all ${
                    deliveryType === 'pickup'
                      ? 'gold-gradient text-surface-dark'
                      : 'bg-surface-light text-on-surface-variant border border-surface-border'
                  }`}
                >
                  <StoreIcon size={14} />
                  Retiro
                </button>
                <button
                  onClick={() => { if (isAuthenticated) setDeliveryType('delivery'); }}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-xs font-medium transition-all ${
                    deliveryType === 'delivery'
                      ? 'gold-gradient text-surface-dark'
                      : 'bg-surface-light text-on-surface-variant border border-surface-border'
                  }`}
                >
                  <Truck size={14} />
                  Delivery
                </button>
              </div>

              {deliveryType === 'delivery' && (
                <div className="space-y-3 animate-in slide-in-from-top-2 duration-200">
                  {savedAddresses.length > 0 && (
                    <div>
                      <label className="text-surface-muted text-[10px] mb-1.5 block flex items-center gap-1 uppercase tracking-wider font-semibold">
                        <MapPin size={10} />
                        Direcciones guardadas
                      </label>
                      <div className="space-y-1">
                        {savedAddresses.map(addr => (
                          <button
                            key={addr.id}
                            onClick={() => selectSavedAddress(addr)}
                            className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-all flex items-center gap-2 ${
                              address === `${addr.street} ${addr.number}`
                                ? 'bg-gold-500/20 text-gold-400 border border-gold-500/50'
                                : 'bg-surface-light text-on-surface-variant border border-surface-border hover:border-gold-500/30'
                            }`}
                          >
                            <span className="font-medium truncate">{addr.label}: {addr.street} {addr.number}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {zones.length > 0 && (
                    <div>
                      <label className="text-surface-muted text-[10px] mb-1.5 block flex items-center gap-1 uppercase tracking-wider font-semibold">
                        <MapPin size={10} />
                        Zona de entrega
                      </label>
                      <div className="grid grid-cols-2 gap-1.5">
                        {zones.map(zone => (
                          <button
                            key={zone.id}
                            onClick={() => setSelectedZone(zone.id)}
                            className={`px-2.5 py-2 rounded-lg text-xs font-medium transition-all text-left ${
                              selectedZone === zone.id
                                ? 'bg-gold-500/20 text-gold-400 border border-gold-500/50'
                                : 'bg-surface-light text-on-surface-variant border border-surface-border hover:border-gold-500/30'
                            }`}
                          >
                            <span className="block truncate">{zone.name}</span>
                            <span className="text-[10px] opacity-70">${(zone.basePrice + zone.surcharge).toLocaleString('es-AR')}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <input
                    type="text"
                    placeholder="Direccion de entrega *"
                    value={address}
                    onChange={e => setAddress(e.target.value)}
                    className="bg-surface-light border border-surface-border text-white rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-gold-500 w-full"
                  />
                  <input
                    type="tel"
                    placeholder="Telefono de contacto *"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="bg-surface-light border border-surface-border text-white rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-gold-500 w-full"
                  />
                  <textarea
                    placeholder="Notas adicionales (opcional)"
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    rows={2}
                    className="bg-surface-light border border-surface-border text-white rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-gold-500 w-full resize-none"
                  />

                  <div>
                    <label className="text-surface-muted text-[10px] mb-1.5 block uppercase tracking-wider font-semibold">
                      Horario de entrega
                    </label>
                    {timeSlots.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {timeSlots.map(slot => (
                          <button
                            key={slot}
                            onClick={() => setDeliveryTime(slot)}
                            className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                              deliveryTime === slot
                                ? 'gold-gradient text-surface-dark'
                                : 'bg-surface-light text-on-surface-variant border border-surface-border'
                            }`}
                          >
                            {slot}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="bg-surface-light/50 rounded-lg p-3 border border-surface-border">
                        <p className="text-on-surface-variant text-xs text-center">
                          El horario de delivery ya no está disponible.
                        </p>
                        <p className="text-surface-muted text-[10px] text-center mt-1">
                          Probá con retiro en local o intentá mañana.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {error && (
                <p className="text-red-400 text-xs text-center py-1.5 bg-red-500/10 rounded-lg">{error}</p>
              )}

              <div className="space-y-1 pt-1 border-t border-surface-border">
                <div className="flex justify-between items-center">
                  <span className="text-surface-muted text-xs">Productos</span>
                  <span className="text-white text-xs">${cartTotal.toLocaleString('es-AR')}</span>
                </div>
                {deliveryType === 'delivery' && selectedZoneData && (
                  <div className="flex justify-between items-center">
                    <span className="text-surface-muted text-xs">Envio ({selectedZoneData.name})</span>
                    <span className="text-white text-xs">${deliveryCost.toLocaleString('es-AR')}</span>
                  </div>
                )}
                {totalRewardPoints > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-yellow-400 text-xs">Puntos a descontar</span>
                    <span className="text-yellow-400 text-xs">-{totalRewardPoints} pts</span>
                  </div>
                )}
                <div className="flex justify-between items-center pt-1">
                  <span className="text-white text-sm font-semibold">Total</span>
                  <span className="text-gold-400 font-bold text-lg">${finalTotal.toLocaleString('es-AR')}</span>
                </div>
              </div>

              <p className="text-center text-[10px] text-surface-muted uppercase tracking-wider">Pagas al recibir</p>

              <button
                onClick={handleConfirm}
                disabled={loading}
                className="w-full gold-gradient hover:opacity-90 disabled:opacity-50 text-surface-dark font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2"
              >
                {loading ? (
                  <span className="animate-spin w-5 h-5 border-2 border-surface-dark/30 border-t-surface-dark rounded-full" />
                ) : (
                  <>
                    <CheckCircle size={16} />
                    Confirmar pedido
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
});

export default CheckoutSheet;
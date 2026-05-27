import { useState } from 'react';
import { X, Minus, Plus, CheckCircle, ShoppingCart, Trash2, Store as StoreIcon, Truck } from 'lucide-react';

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
  onCheckout: (deliveryType: 'pickup' | 'delivery', address: string, phone: string, notes: string, deliveryTime: string) => void;
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

  if (cartCount === 0) return null;

  function handleConfirm() {
    setError('');
    if (deliveryType === 'delivery') {
      if (step === 'cart') {
        setStep('delivery_form');
        return;
      }
      if (!address.trim()) { setError('Ingresá tu dirección'); return; }
      if (!phone.trim()) { setError('Ingresá tu teléfono'); return; }
      if (!deliveryTime) { setError('Seleccioná un horario'); return; }
    }
    onCheckout(deliveryType, address, phone, notes, deliveryTime);
    onClose();
    setStep('cart');
    setAddress('');
    setPhone('');
    setNotes('');
    setDeliveryTime('');
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
        className="lg:hidden fixed bottom-6 right-6 z-50 bg-green-600 text-white p-4 rounded-full shadow-lg shadow-green-600/30 hover:bg-green-700 transition-all hover:scale-110 active:scale-95"
        aria-label="Ver carrito"
      >
        <ShoppingCart className="h-5 w-5" />
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
          {cartCount > 9 ? '9+' : cartCount}
        </span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm" onClick={handleClose}>
          <div
            className="absolute bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 rounded-t-3xl max-h-[85vh] flex flex-col animate-slide-up"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800 shrink-0">
              <div>
                <h2 className="font-bold text-white text-base">
                  {step === 'cart' ? 'Mi pedido' : 'Datos de envío'}
                </h2>
                {step === 'delivery_form' && (
                  <button
                    onClick={() => setStep('cart')}
                    className="text-green-400 text-xs mt-0.5 hover:underline"
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
                    <div key={item.product.id} className="flex items-center gap-3 bg-gray-800/60 rounded-xl p-3">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-white truncate text-sm">{item.product.name}</p>
                        <p className="text-green-400 font-semibold text-xs mt-0.5">
                          ${(item.product.price * item.quantity).toLocaleString('es-AR')}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 bg-gray-700 rounded-lg p-0.5">
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
                        deliveryType === 'pickup' ? 'bg-green-600 text-white' : 'bg-gray-800 text-gray-400'
                      }`}
                    >
                      <StoreIcon size={15} />
                      Retiro
                    </button>
                    <button
                      onClick={() => { if (isAuthenticated) setDeliveryType('delivery'); }}
                      className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-xs font-medium transition-all ${
                        deliveryType === 'delivery' ? 'bg-green-600 text-white' : 'bg-gray-800 text-gray-400'
                      }`}
                    >
                      <Truck size={15} />
                      Delivery
                    </button>
                  </div>

                  {error && (
                    <p className="text-red-400 text-xs text-center">{error}</p>
                  )}

                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-sm">Total</span>
                    <span className="text-green-400 font-bold text-xl">${cartTotal.toLocaleString('es-AR')}</span>
                  </div>

                  <button
                    onClick={handleConfirm}
                    disabled={loading}
                    className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-800 text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <span className="animate-spin w-5 h-5 border-2 border-white/30 border-t-white rounded-full" />
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
                <input
                  type="text"
                  placeholder="Dirección de entrega *"
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  className="bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-green-500"
                />
                <input
                  type="tel"
                  placeholder="Teléfono de contacto *"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-green-500"
                />
                <textarea
                  placeholder="Notas adicionales (opcional)"
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  rows={2}
                  className="bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-green-500 resize-none"
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
                              ? 'bg-green-600 text-white'
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

                {error && (
                  <p className="text-red-400 text-xs text-center">{error}</p>
                )}

                <button
                  onClick={handleConfirm}
                  disabled={loading}
                  className="mt-auto w-full bg-green-600 hover:bg-green-700 disabled:bg-green-800 text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <span className="animate-spin w-5 h-5 border-2 border-white/30 border-t-white rounded-full" />
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

import { useState } from 'react';
import { ShoppingCart, X, Plus, Minus } from 'lucide-react';

interface CartItem {
  product: { id: string; name: string; price: number };
  quantity: number;
}

interface FloatingCartProps {
  cart: CartItem[];
  cartTotal: number;
  cartCount: number;
  onUpdateQuantity: (productId: string, delta: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  onCheckout: () => void;
  isAuthenticated: boolean;
}

const FloatingCart = ({ cart, cartTotal, cartCount, onUpdateQuantity, onRemoveItem, onClearCart, onCheckout, isAuthenticated }: FloatingCartProps) => {
  const [isOpen, setIsOpen] = useState(false);

  if (cartCount === 0) return null;

  return (
    <>
      <button onClick={() => setIsOpen(true)} className="lg:hidden fixed bottom-6 right-6 z-50 bg-green-600 text-white p-4 rounded-full shadow-lg shadow-green-600/20 hover:bg-green-700 transition-all hover:scale-110 active:scale-95">
        <ShoppingCart className="h-6 w-6" />
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">{cartCount}</span>
      </button>

      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-sm" onClick={() => setIsOpen(false)}>
          <div className="absolute bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 rounded-t-2xl max-h-[80vh] flex flex-col animate-slide-up" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-800">
              <h2 className="font-bold text-lg text-white">Mi pedido</h2>
              <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-white"><X className="h-5 w-5" /></button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-3 space-y-3">
              {cart.map((item) => (
                <div key={item.product.id} className="flex items-center gap-3 text-sm bg-gray-800/50 rounded-xl p-3">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-white truncate text-sm">{item.product.name}</p>
                    <p className="text-green-500 font-semibold text-xs">${(item.product.price * item.quantity).toLocaleString('es-AR')}</p>
                  </div>
                  <div className="flex items-center gap-1 bg-gray-800 rounded-lg p-0.5 border border-gray-700">
                    <button onClick={() => onUpdateQuantity(item.product.id, -1)} className="p-1 hover:text-green-500 transition-colors text-gray-400"><Minus className="h-3 w-3" /></button>
                    <span className="w-5 text-center font-bold text-xs text-white">{item.quantity}</span>
                    <button onClick={() => onUpdateQuantity(item.product.id, 1)} className="p-1 hover:text-green-500 transition-colors text-gray-400"><Plus className="h-3 w-3" /></button>
                  </div>
                  <button onClick={() => onRemoveItem(item.product.id)} className="text-gray-600 hover:text-red-400 transition-colors"><X className="h-4 w-4" /></button>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-800 px-5 py-4 space-y-3">
              <div className="flex justify-between items-center font-bold text-white">
                <span>Total</span>
                <span className="text-green-500 text-xl">${cartTotal.toLocaleString('es-AR')}</span>
              </div>
              <button onClick={() => { onCheckout(); setIsOpen(false); }} className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl transition-colors">
                {isAuthenticated ? 'Confirmar pedido' : 'Iniciar sesión para pedir'}
              </button>
              <button onClick={onClearCart} className="w-full text-gray-600 hover:text-red-400 text-xs flex items-center justify-center gap-1 transition-colors py-1">
                Vaciar carrito
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FloatingCart;

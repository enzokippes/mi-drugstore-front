import { memo } from 'react';
import { Minus, Plus, Trash2 } from 'lucide-react';

interface CartItem {
  product: {
    id: string;
    name: string;
    price: number;
  };
  quantity: number;
}

interface CartItemRowProps {
  item: CartItem;
  onUpdateQuantity: (productId: string, delta: number) => void;
  onRemoveItem: (productId: string) => void;
}

const CartItemRow = memo(function CartItemRow({ item, onUpdateQuantity, onRemoveItem }: CartItemRowProps) {
  return (
    <div className="flex items-center gap-2 bg-surface-light rounded-lg p-2.5 border border-surface-border">
      <div className="flex-1 min-w-0">
        <p className="font-medium text-white text-xs truncate">{item.product.name}</p>
        <p className="text-gold-400 font-semibold text-xs mt-0.5">
          ${(item.product.price * item.quantity).toLocaleString('es-AR')}
        </p>
      </div>
      <div className="flex items-center gap-1 bg-surface border border-surface-border rounded-lg p-0.5">
        <button
          onClick={() => onUpdateQuantity(item.product.id, -1)}
          className="p-1 text-surface-muted hover:text-white transition-colors"
        >
          <Minus className="h-3 w-3" />
        </button>
        <span className="w-5 text-center font-bold text-xs text-white">{item.quantity}</span>
        <button
          onClick={() => onUpdateQuantity(item.product.id, 1)}
          className="p-1 text-surface-muted hover:text-white transition-colors"
        >
          <Plus className="h-3 w-3" />
        </button>
      </div>
      <button
        onClick={() => onRemoveItem(item.product.id)}
        className="p-1 text-surface-muted hover:text-red-400 transition-colors"
      >
        <Trash2 className="h-3.5 w-3.5" />
      </button>
    </div>
  );
});

export default CartItemRow;
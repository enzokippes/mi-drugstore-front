import { memo } from 'react';
import { Minus, Plus, Trash2 } from 'lucide-react';

interface CartItem {
  product: {
    id: string;
    name: string;
    price: number;
  };
  quantity: number;
  isReward?: boolean;
  rewardPointsCost?: number;
}

interface CartItemRowProps {
  item: CartItem;
  onUpdateQuantity: (productId: string, delta: number) => void;
  onRemoveItem: (productId: string) => void;
}

const CartItemRow = memo(function CartItemRow({ item, onUpdateQuantity, onRemoveItem }: CartItemRowProps) {
  return (
    <div className={`flex items-center gap-2 rounded-lg p-2.5 border ${
      item.isReward ? 'bg-yellow-500/5 border-yellow-500/20' : 'bg-surface-light border-surface-border'
    }`}>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <p className="font-medium text-white text-xs truncate">{item.product.name}</p>
          {item.isReward && (
            <span className="text-[9px] bg-yellow-500/20 text-yellow-400 px-1.5 py-0.5 rounded-full font-bold">
              CANJE
            </span>
          )}
        </div>
        <p className={`font-semibold text-xs mt-0.5 ${
          item.isReward ? 'text-yellow-400' : 'text-gold-400'
        }`}>
          {item.isReward ? (
            <span>{item.rewardPointsCost} pts canjeados</span>
          ) : (
            <span>${(item.product.price * item.quantity).toLocaleString('es-AR')}</span>
          )}
        </p>
      </div>
      {!item.isReward && (
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
      )}
      {item.isReward && (
        <span className="text-[10px] text-yellow-400/60">x1</span>
      )}
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
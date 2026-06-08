import { Home, Percent, ShoppingBag, Package } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

interface MobileBottomNavProps {
  cartCount?: number;
  onCartClick?: () => void;
}

export default function MobileBottomNav({ cartCount = 0, onCartClick }: MobileBottomNavProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const items = [
    { icon: Home, label: 'Inicio', path: '/' },
    { icon: Percent, label: 'Promos', path: '/promociones' },
    { icon: ShoppingBag, label: 'Tienda', path: '/', cart: true },
    { icon: Package, label: 'Pedidos', path: '/my-orders' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 glass-dark border-t border-surface-border md:hidden">
      <div className="flex items-center justify-around h-16 px-2">
        {items.map((item, index) => {
          const Icon = item.icon;
          const active = isActive(item.path);

          if (item.cart) {
            return (
              <button
                key={index}
                onClick={() => onCartClick ? onCartClick() : navigate(item.path)}
                className="relative flex flex-col items-center justify-center gap-0.5 w-16 h-full"
              >
                <div className="relative">
                  <Icon size={22} className="text-gold-400" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 gold-gradient text-surface-dark text-[9px] rounded-full w-4 h-4 flex items-center justify-center font-bold">
                      {cartCount > 9 ? '9+' : cartCount}
                    </span>
                  )}
                </div>
                <span className="text-[10px] text-gold-400 font-medium">{item.label}</span>
              </button>
            );
          }

          return (
            <button
              key={index}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center justify-center gap-0.5 w-16 h-full transition-colors ${
                active ? 'text-gold-400' : 'text-surface-muted hover:text-on-surface-variant'
              }`}
            >
              <Icon size={22} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
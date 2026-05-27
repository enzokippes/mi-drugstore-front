import { MapPin, Phone, Clock, ShoppingCart, LayoutDashboard, Package, LogOut, Percent } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface StoreHeaderProps {
  cartCount: number;
  onCartClick: () => void;
}

export default function StoreHeader({ cartCount, onCartClick }: StoreHeaderProps) {
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin, logout } = useAuth();
  const wspNumber = '5493454322631';

  return (
    <header className="bg-gray-900/95 backdrop-blur border-b border-gray-800/80 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2.5 sm:py-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5 sm:gap-3">
          <img src="/logo.jpeg" alt="Barba Negra" className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg object-cover" />
          <div>
            <h1 className="text-white font-bold text-sm sm:text-lg leading-tight">Barba Negra Drugstore</h1>
            <div className="flex items-center gap-2 sm:gap-3 text-gray-500 text-[10px] sm:text-xs flex-wrap">
              <a
                href="https://maps.google.com/maps?q=-31.385226592108864,-58.02879512303576"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-0.5 hover:text-green-400 transition-colors"
              >
                <MapPin size={10} className="sm:hidden" />
                <MapPin size={12} className="hidden sm:inline" />
                <span className="truncate max-w-[120px] sm:max-w-none">H. Primo ESQ Balcarce</span>
              </a>
              <span className="flex items-center gap-0.5">
                <Phone size={10} className="sm:hidden" />
                <Phone size={12} className="hidden sm:inline" />
                <a href={`https://wa.me/${wspNumber}`} target="_blank" rel="noopener noreferrer" className="hover:text-green-400 transition-colors">345-4322631</a>
              </span>
              <span className="hidden sm:flex items-center gap-0.5">
                <Clock size={12} />
                <span>8:00 - 20:00</span>
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            onClick={() => navigate('/promociones')}
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs sm:text-sm bg-yellow-500/20 text-yellow-400 rounded-lg hover:bg-yellow-500/30 transition-colors"
            title="Promociones"
          >
            <Percent size={14} className="sm:hidden" />
            <Percent size={16} className="hidden sm:inline" />
            <span className="hidden sm:inline">Promos</span>
          </button>
          {isAdmin && (
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-1 px-2.5 py-1.5 text-xs sm:text-sm bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
              title="Panel Admin"
            >
              <LayoutDashboard size={14} className="sm:hidden" />
              <LayoutDashboard size={16} className="hidden sm:inline" />
              <span className="hidden sm:inline">Panel Admin</span>
            </button>
          )}
          {isAuthenticated ? (
            <>
              <button
                onClick={() => navigate('/my-orders')}
                className="flex items-center gap-1 px-2.5 py-1.5 text-xs sm:text-sm bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
                title="Mis Pedidos"
              >
                <Package size={14} className="sm:hidden" />
                <Package size={16} className="hidden sm:inline" />
                <span className="hidden sm:inline">Mis Pedidos</span>
              </button>
              <button
                onClick={() => { logout(); navigate('/'); }}
                className="flex items-center gap-1 px-2.5 py-1.5 text-xs sm:text-sm bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
                title="Salir"
              >
                <LogOut size={14} className="sm:hidden" />
                <LogOut size={16} className="hidden sm:inline" />
                <span className="hidden sm:inline">Salir</span>
              </button>
            </>
          ) : (
            <button
              onClick={() => navigate('/login')}
              className="flex items-center gap-1 px-2.5 py-1.5 text-xs sm:text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Ingresar
            </button>
          )}
          <button
            onClick={onCartClick}
            className="relative p-1.5 sm:p-2 text-gray-300 hover:text-white transition-colors"
            title="Ver carrito"
          >
            <ShoppingCart size={20} className="sm:hidden" />
            <ShoppingCart size={22} className="hidden sm:inline" />
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-green-500 text-white text-[10px] rounded-full w-5 h-5 flex items-center justify-center font-bold animate-pulse-green">
                {cartCount > 9 ? '9+' : cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}

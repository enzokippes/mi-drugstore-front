import { useState, useRef, useEffect } from 'react';
import { MapPin, Phone, Clock, ShoppingCart, LayoutDashboard, Package, LogOut, Percent, Star, User, Menu, X, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface StoreHeaderProps {
  cartCount: number;
  onCartClick: () => void;
}

export default function StoreHeader({ cartCount, onCartClick }: StoreHeaderProps) {
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin, logout } = useAuth();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);
  const wspNumber = '5493454322631';

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (drawerRef.current && !drawerRef.current.contains(e.target as Node)) {
        const trigger = document.getElementById('store-menu-trigger');
        if (trigger && !trigger.contains(e.target as Node)) {
          setDrawerOpen(false);
        }
      }
    };
    if (drawerOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [drawerOpen]);

  const handleLogout = () => {
    logout();
    navigate('/');
    setDrawerOpen(false);
  };

  return (
    <>
      <header className="glass-dark sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2.5 sm:py-3 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <img src="/logo.jpeg" alt="Barba Negra" className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg object-cover ring-1 ring-gold-400/30 shrink-0" />
            <div className="min-w-0 hidden sm:block">
              <h1 className="text-white font-bold text-lg leading-tight">Barba Negra <span className="gold-text">Drugstore</span></h1>
              <div className="flex items-center gap-3 text-gray-500 text-xs">
                <a href="https://maps.google.com/maps?q=-31.385226592108864,-58.02879512303576" target="_blank" rel="noopener noreferrer" className="flex items-center gap-0.5 hover:text-gold-400 transition-colors">
                  <MapPin size={12} />
                  <span>H. Primo ESQ Balcarce</span>
                </a>
                <span className="flex items-center gap-0.5">
                  <Phone size={12} />
                  <a href={`https://wa.me/${wspNumber}`} target="_blank" rel="noopener noreferrer" className="hover:text-gold-400 transition-colors">345-4322631</a>
                </span>
                <span className="flex items-center gap-0.5">
                  <Clock size={12} />
                  <span>8:00 - 20:00</span>
                </span>
              </div>
            </div>
            <div className="sm:hidden min-w-0">
              <h1 className="text-white font-bold text-sm leading-tight">Barba Negra <span className="gold-text">Drugstore</span></h1>
              <div className="flex items-center gap-2 text-gray-500 text-[10px]">
                <a href="https://maps.google.com/maps?q=-31.385226592108864,-58.02879512303576" target="_blank" rel="noopener noreferrer" className="hover:text-gold-400 transition-colors flex items-center gap-0.5">
                  <MapPin size={10} />
                  <span className="truncate max-w-[80px]">H. Primo ESQ</span>
                </a>
                <span className="flex items-center gap-0.5">
                  <Phone size={10} />
                  <a href={`https://wa.me/${wspNumber}`} target="_blank" rel="noopener noreferrer" className="hover:text-gold-400 transition-colors">345-4322631</a>
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              id="store-menu-trigger"
              onClick={() => setDrawerOpen(!drawerOpen)}
              className="sm:hidden p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
              aria-label="Abrir menú"
            >
              {drawerOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>

            <div className="hidden sm:flex items-center gap-2">
              <button
                onClick={() => navigate('/promociones')}
                className="flex items-center gap-1 px-3 py-1.5 text-sm bg-gold-500/10 text-gold-400 rounded-lg hover:bg-gold-500/20 transition-colors border border-gold-500/20"
              >
                <Percent size={16} />
                <span>Promos</span>
              </button>
              {isAuthenticated && (
                <button
                  onClick={() => navigate('/points')}
                  className="flex items-center gap-1 px-3 py-1.5 text-sm bg-gold-500/10 text-gold-400 rounded-lg hover:bg-gold-500/20 transition-colors border border-gold-500/20"
                >
                  <Star size={16} />
                  <span>Points</span>
                </button>
              )}
              {isAdmin && (
                <button
                  onClick={() => navigate('/dashboard')}
                  className="flex items-center gap-1 px-3 py-1.5 text-sm bg-gray-800/80 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors border border-gray-700/50"
                >
                  <LayoutDashboard size={16} />
                  <span>Panel</span>
                </button>
              )}
              {isAuthenticated ? (
                <>
                  <button onClick={() => navigate('/profile')} className="flex items-center gap-1 px-3 py-1.5 text-sm bg-gray-800/80 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors border border-gray-700/50">
                    <User size={16} />
                    <span>Perfil</span>
                  </button>
                  <button onClick={() => navigate('/my-orders')} className="flex items-center gap-1 px-3 py-1.5 text-sm bg-gray-800/80 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors border border-gray-700/50">
                    <Package size={16} />
                    <span>Pedidos</span>
                  </button>
                  <button onClick={handleLogout} className="flex items-center gap-1 px-3 py-1.5 text-sm bg-gray-800/80 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors border border-gray-700/50">
                    <LogOut size={16} />
                    <span>Salir</span>
                  </button>
                </>
              ) : (
                <button onClick={() => navigate('/login')} className="flex items-center gap-1 px-4 py-1.5 gold-gradient text-gray-950 rounded-lg hover:opacity-90 transition-opacity font-semibold text-sm">
                  Ingresar
                </button>
              )}
            </div>

            <button
              onClick={onCartClick}
              className="relative p-2 text-gray-300 hover:text-gold-400 transition-colors"
              title="Ver carrito"
            >
              <ShoppingCart size={22} />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 gold-gradient text-gray-950 text-[10px] rounded-full w-5 h-5 flex items-center justify-center font-bold animate-pulse-gold">
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {drawerOpen && (
        <div className="fixed inset-0 z-50 sm:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setDrawerOpen(false)} />
          <div ref={drawerRef} className="absolute left-0 top-0 h-full w-72 glass-dark border-r border-gold-500/10 transform transition-transform duration-300">
            <div className="p-5 border-b border-gold-500/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <img src="/logo.jpeg" alt="Barba Negra" className="h-8 w-8 rounded-lg object-cover ring-1 ring-gold-400/30" />
                  <span className="text-white font-bold">Barba Negra</span>
                </div>
                <button onClick={() => setDrawerOpen(false)} className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors">
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            <nav className="p-4">
              <div className="space-y-1">
                <DrawerLink icon={<Percent size={18} />} label="Promociones" onClick={() => { navigate('/promociones'); setDrawerOpen(false); }} />
                {isAuthenticated && (
                  <DrawerLink icon={<Star size={18} />} label="Points" onClick={() => { navigate('/points'); setDrawerOpen(false); }} />
                )}
                {isAdmin && (
                  <DrawerLink icon={<LayoutDashboard size={18} />} label="Panel Admin" onClick={() => { navigate('/dashboard'); setDrawerOpen(false); }} />
                )}
                {isAuthenticated && (
                  <>
                    <DrawerLink icon={<User size={18} />} label="Mi Perfil" onClick={() => { navigate('/profile'); setDrawerOpen(false); }} />
                    <DrawerLink icon={<Package size={18} />} label="Mis Pedidos" onClick={() => { navigate('/my-orders'); setDrawerOpen(false); }} />
                  </>
                )}
              </div>
            </nav>

            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gold-500/10 space-y-2">
              {isAuthenticated ? (
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-500/10 text-red-400 rounded-xl hover:bg-red-500/20 transition-colors font-medium"
                >
                  <LogOut size={18} />
                  Cerrar sesión
                </button>
              ) : (
                <button
                  onClick={() => { navigate('/login'); setDrawerOpen(false); }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 gold-gradient text-gray-950 rounded-xl hover:opacity-90 transition-colors font-semibold"
                >
                  Ingresar
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function DrawerLink({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-400 hover:text-white hover:bg-gray-800/50 transition-all"
    >
      <span className="text-gold-400">{icon}</span>
      {label}
      <ChevronRight size={16} className="ml-auto text-gray-600" />
    </button>
  );
}
import { useState, useRef, useEffect } from 'react';
import { MapPin, ShoppingCart, LayoutDashboard, Package, LogOut, Percent, Star, User, Menu, X, ChevronRight, Phone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';

interface StoreHeaderProps {
  cartCount: number;
  onCartClick: () => void;
  onCategoryClick?: (categoryName: string | null) => void;
}

const NAV_ITEMS = [
  { label: 'ALCOHOL', categoryName: 'Alcohol' },
  { label: 'BEBIDAS', categoryName: 'Bebidas' },
  { label: 'HELADOS', categoryName: 'Helados' },
  { label: 'HIELO', categoryName: 'Hielo' },
  { label: 'SNACKS', categoryName: 'Snacks' },
];

export default function StoreHeader({ cartCount, onCartClick, onCategoryClick }: StoreHeaderProps) {
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

  const handleNavClick = (categoryName: string) => {
    if (onCategoryClick) {
      onCategoryClick(categoryName);
    }
  };

  return (
    <>
      <header className="glass-nav sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 lg:px-6">
          <div className="flex items-center justify-between h-16 lg:h-20 gap-4">
            <div className="flex items-center gap-3 shrink-0">
              <img src="/logo.jpeg" alt="Barba Negra" className="w-9 h-9 lg:w-11 lg:h-11 rounded-xl object-cover ring-1 ring-gold-400/20" />
              <div className="flex flex-col">
                <h1 className="text-white font-bold text-base lg:text-lg leading-tight tracking-tight">
                  Barba Negra <span className="gold-text">Drugstore</span>
                </h1>
                <div className="hidden sm:flex items-center gap-1.5 text-surface-muted text-[10px] lg:text-xs">
                  <MapPin size={10} className="text-gold-400" />
                  <span className="hover:text-gold-400 transition-colors cursor-pointer">H. Primo ESQ Balcarce</span>
                </div>
              </div>
            </div>

            <nav className="hidden lg:flex items-center gap-1">
              {NAV_ITEMS.map(item => (
                <button
                  key={item.categoryName}
                  onClick={() => handleNavClick(item.categoryName)}
                  className="px-4 py-2 text-xs font-semibold text-on-surface-variant hover:text-gold-400 hover:bg-surface-light rounded-full transition-all tracking-wide"
                >
                  {item.label}
                </button>
              ))}
            </nav>

            <div className="flex items-center gap-2">
              <a
                href={`https://wa.me/${wspNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden md:flex items-center gap-1.5 text-xs text-surface-muted hover:text-gold-400 transition-colors px-3 py-1.5 rounded-full bg-surface-light border border-surface-border"
              >
                <Phone size={12} />
                <span className="whitespace-nowrap">345 432-2631</span>
              </a>

              <div className="hidden lg:flex items-center gap-2">
                <button
                  onClick={() => navigate('/promociones')}
                  className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-gold-400 hover:bg-gold-400/10 rounded-full transition-colors border border-gold-400/20"
                >
                  <Percent size={14} />
                  <span>Promos</span>
                </button>
                {isAuthenticated && (
                  <button
                    onClick={() => navigate('/points')}
                    className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-blue hover:bg-slate-blue/10 rounded-full transition-colors border border-slate-blue/20"
                  >
                    <Star size={14} />
                    <span>Puntos</span>
                  </button>
                )}
                {isAdmin && (
                  <button
                    onClick={() => navigate('/dashboard')}
                    className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-on-surface-variant hover:text-white hover:bg-surface-light rounded-full transition-colors border border-surface-border"
                  >
                    <LayoutDashboard size={14} />
                    <span>Panel</span>
                  </button>
                )}
                {isAuthenticated ? (
                  <>
                    <button onClick={() => navigate('/profile')} className="p-2 text-on-surface-variant hover:text-white hover:bg-surface-light rounded-full transition-colors border border-surface-border">
                      <User size={16} />
                    </button>
                    <button onClick={() => navigate('/my-orders')} className="p-2 text-on-surface-variant hover:text-white hover:bg-surface-light rounded-full transition-colors border border-surface-border">
                      <Package size={16} />
                    </button>
                    <button onClick={handleLogout} className="p-2 text-on-surface-variant hover:text-red-400 hover:bg-red-500/10 rounded-full transition-colors border border-surface-border">
                      <LogOut size={16} />
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => navigate('/login')}
                    className="flex items-center gap-1.5 px-5 py-2 text-xs font-semibold gold-gradient text-surface-dark rounded-full hover:opacity-90 transition-opacity"
                  >
                    Ingresar
                  </button>
                )}
              </div>

              <button
                onClick={onCartClick}
                className="relative p-2.5 text-on-surface-variant hover:text-gold-400 transition-colors"
                title="Ver carrito"
              >
                <ShoppingCart size={22} />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 gold-gradient text-surface-dark text-[10px] rounded-full w-5 h-5 flex items-center justify-center font-bold animate-pulse-gold">
                    {cartCount > 9 ? '9+' : cartCount}
                  </span>
                )}
              </button>

              <button
                id="store-menu-trigger"
                onClick={() => setDrawerOpen(!drawerOpen)}
                className="lg:hidden p-2 text-on-surface-variant hover:text-white hover:bg-surface-light rounded-lg transition-colors"
                aria-label="Abrir menú"
              >
                {drawerOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {drawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setDrawerOpen(false)} />
          <div ref={drawerRef} className="absolute right-0 top-0 h-full w-80 bg-surface-dark border-l border-surface-border transform transition-transform duration-300">
            <div className="p-5 border-b border-surface-border">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <img src="/logo.jpeg" alt="Barba Negra" className="h-9 w-9 rounded-xl object-cover ring-1 ring-gold-400/20" />
                  <span className="text-white font-bold">Barba Negra</span>
                </div>
                <button onClick={() => setDrawerOpen(false)} className="p-2 rounded-lg text-on-surface-variant hover:text-white hover:bg-surface-light transition-colors">
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            <nav className="p-4">
              <div className="space-y-1">
                <p className="text-surface-muted text-xs font-semibold uppercase tracking-wider px-4 mb-3">Navegación</p>
                {NAV_ITEMS.map(item => (
                  <button
                    key={item.categoryName}
                    onClick={() => { handleNavClick(item.categoryName); setDrawerOpen(false); }}
                    className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium text-on-surface-variant hover:text-white hover:bg-surface-light transition-all"
                  >
                    <span>{item.label}</span>
                    <ChevronRight size={16} className="text-surface-muted" />
                  </button>
                ))}

                <div className="border-t border-surface-border my-4 pt-4">
                  <p className="text-surface-muted text-xs font-semibold uppercase tracking-wider px-4 mb-3">Cuenta</p>
                  <DrawerLink icon={<Percent size={18} />} label="Promociones" onClick={() => { navigate('/promociones'); setDrawerOpen(false); }} />
                  {isAuthenticated && (
                    <DrawerLink icon={<Star size={18} />} label="Puntos" onClick={() => { navigate('/points'); setDrawerOpen(false); }} />
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
              </div>
            </nav>

            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-surface-border space-y-2">
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
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 gold-gradient text-surface-dark rounded-xl hover:opacity-90 transition-colors font-semibold"
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
      className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-on-surface-variant hover:text-white hover:bg-surface-light transition-all"
    >
      <span className="text-gold-400">{icon}</span>
      {label}
      <ChevronRight size={16} className="ml-auto text-surface-muted" />
    </button>
  );
}
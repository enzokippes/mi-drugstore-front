import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, ShoppingBag, LayoutDashboard, ClipboardList, MapPin, Gift, BarChart3, Menu, X, ChevronRight, User } from 'lucide-react';

interface NavItem {
  to: string;
  label: string;
  icon: string;
  adminOnly?: boolean;
}

const navItems: NavItem[] = [
  { to: '/dashboard', label: 'Estadísticas', icon: 'bar_chart', adminOnly: true },
  { to: '/products', label: 'Productos', icon: 'inventory_2', adminOnly: true },
  { to: '/orders', label: 'Pedidos', icon: 'receipt_long', adminOnly: true },
  { to: '/admin/delivery-zones', label: 'Zonas', icon: 'map', adminOnly: true },
  { to: '/admin/rewards', label: 'Recompensas', icon: 'card_giftcard', adminOnly: true },
  { to: '/my-orders', label: 'Mis Pedidos', icon: 'shopping_bag' },
];

export default function AdminNav() {
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setDrawerOpen(false);
  }, [location]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (drawerRef.current && !drawerRef.current.contains(e.target as Node)) {
        const trigger = document.getElementById('drawer-trigger');
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

  const isActive = (path: string) => location.pathname === path || location.pathname.startsWith(path + '/');

  return (
    <>
      <nav className="glass-header sticky top-0 z-40 border-b border-outline-variant">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center text-white font-bold text-xl">
                <span className="font-headline-lg text-headline-lg font-bold text-primary mr-2">Barba Negra</span>
                <span className="text-on-surface-variant text-sm hidden md:inline">Admin</span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              {isAuthenticated && isAdmin && navItems.filter(i => i.adminOnly).map(item => (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive(item.to)
                      ? 'bg-primary-container/20 text-primary border border-primary-container'
                      : 'text-on-surface-variant hover:text-primary hover:bg-surface-container'
                  }`}
                >
                  <span className="material-symbols-outlined mr-2" style={{ fontSize: '18px' }}>{item.icon}</span>
                  {item.label}
                </Link>
              ))}
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-4">
              {isAuthenticated ? (
                <>
                  {/* User Badge */}
                  <div className="hidden sm:flex items-center gap-2 bg-surface-container px-3 py-1.5 rounded-lg border border-outline-variant">
                    <User size={16} className="text-on-surface-variant" />
                    <span className="text-on-surface text-sm font-medium">{user?.name?.split(' ')[0]}</span>
                  </div>

                  {/* Mobile Menu Trigger */}
                  <button
                    id="drawer-trigger"
                    onClick={() => setDrawerOpen(!drawerOpen)}
                    className="lg:hidden p-2 rounded-lg text-on-surface-variant hover:text-primary hover:bg-surface-container transition-colors"
                    aria-label="Abrir menú"
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>
                      {drawerOpen ? 'close' : 'menu'}
                    </span>
                  </button>

                  {/* Logout - Desktop */}
                  <button
                    onClick={handleLogout}
                    className="hidden lg:flex items-center gap-1 px-3 py-2 text-on-surface-variant hover:text-error transition-colors text-sm rounded-lg hover:bg-surface-container"
                  >
                    <LogOut size={16} />
                    <span>Salir</span>
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="text-on-surface-variant hover:text-primary font-medium text-sm transition-colors">Ingresar</Link>
                  <Link to="/register" className="bg-primary-container text-on-primary px-4 py-2 rounded-lg hover:brightness-110 font-bold text-sm transition-all">Registrarse</Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setDrawerOpen(false)} />
          <div
            ref={drawerRef}
            className="absolute left-0 top-0 h-full w-72 bg-surface-container-low border-r border-outline-variant transform transition-transform duration-300 ease-out"
          >
            <div className="p-5 border-b border-outline-variant">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-headline-lg text-headline-lg font-bold text-primary">Barba Negra</span>
                </div>
                <button
                  onClick={() => setDrawerOpen(false)}
                  className="p-2 rounded-lg text-on-surface-variant hover:text-primary hover:bg-surface-container transition-colors"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
              {user && (
                <p className="text-on-surface-variant text-sm mt-2">@{user.name}</p>
              )}
            </div>

            <nav className="p-4">
              <div className="space-y-1">
                {isAuthenticated && isAdmin && navItems.filter(i => i.adminOnly).map(item => (
                  <button
                    key={item.to}
                    onClick={() => { navigate(item.to); setDrawerOpen(false); }}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                      isActive(item.to)
                        ? 'bg-primary-container/20 text-primary border border-primary-container'
                        : 'text-on-surface-variant hover:text-primary hover:bg-surface-container'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>{item.icon}</span>
                      {item.label}
                    </div>
                    {isActive(item.to) && <ChevronRight size={16} className="text-outline" />}
                  </button>
                ))}
                {isAuthenticated && navItems.filter(i => !i.adminOnly).map(item => (
                  <button
                    key={item.to}
                    onClick={() => { navigate(item.to); setDrawerOpen(false); }}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                      isActive(item.to)
                        ? 'bg-primary-container/20 text-primary border border-primary-container'
                        : 'text-on-surface-variant hover:text-primary hover:bg-surface-container'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>{item.icon}</span>
                      {item.label}
                    </div>
                    {isActive(item.to) && <ChevronRight size={16} className="text-outline" />}
                  </button>
                ))}
              </div>
            </nav>

            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-outline-variant">
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-surface-container-high text-error rounded-xl hover:bg-error hover:text-on-error transition-colors font-medium"
              >
                <LogOut size={18} />
                Cerrar sesión
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
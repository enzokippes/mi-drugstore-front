import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, ShoppingBag, LayoutDashboard, ClipboardList, MapPin, Gift, BarChart3, Menu, X, ChevronRight } from 'lucide-react';

interface NavItem {
  to: string;
  label: string;
  icon: typeof BarChart3;
  adminOnly?: boolean;
}

const navItems: NavItem[] = [
  { to: '/dashboard', label: 'Estadísticas', icon: BarChart3, adminOnly: true },
  { to: '/products', label: 'Productos', icon: LayoutDashboard, adminOnly: true },
  { to: '/orders', label: 'Pedidos', icon: ClipboardList, adminOnly: true },
  { to: '/admin/delivery-zones', label: 'Zonas', icon: MapPin, adminOnly: true },
  { to: '/admin/rewards', label: 'Recompensas', icon: Gift, adminOnly: true },
  { to: '/my-orders', label: 'Mis Pedidos', icon: ShoppingBag },
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
  };

  const toggleDrawer = () => setDrawerOpen(!drawerOpen);

  return (
    <>
      <nav className="glass-dark border-b border-gold-500/10 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center text-white font-bold text-xl">
                <img src="/logo.jpeg" alt="Barba Negra" className="h-8 w-8 mr-2 rounded-lg object-cover ring-1 ring-gold-400/30" />
                <span className="hidden sm:inline">Barba Negra</span>
                <span className="gold-text ml-1 text-sm hidden md:inline">Admin</span>
              </Link>
            </div>

            <div className="hidden lg:flex items-center gap-1">
              {isAuthenticated && isAdmin && navItems.filter(i => i.adminOnly).map(item => (
                <NavLink key={item.to} item={item} currentPath={location.pathname} />
              ))}
              {isAuthenticated && navItems.filter(i => !i.adminOnly).map(item => (
                <NavLink key={item.to} item={item} currentPath={location.pathname} />
              ))}
            </div>

            <div className="flex items-center gap-2 lg:gap-4">
              {isAuthenticated ? (
                <>
                  <div className="hidden sm:flex items-center gap-2">
                    <span className="text-gray-500 text-sm">{user?.name}</span>
                    <button
                      onClick={handleLogout}
                      className="flex items-center text-gray-500 hover:text-red-400 transition-colors text-sm p-2 rounded-lg hover:bg-gray-800"
                    >
                      <LogOut className="h-4 w-4 lg:mr-1" />
                      <span className="hidden lg:inline">Salir</span>
                    </button>
                  </div>
                  <button
                    id="drawer-trigger"
                    onClick={toggleDrawer}
                    className="lg:hidden p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
                    aria-label="Abrir menú"
                  >
                    {drawerOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                  </button>
                  <div className="hidden lg:flex items-center gap-2">
                    <button
                      onClick={handleLogout}
                      className="flex items-center text-gray-500 hover:text-red-400 transition-colors text-sm p-2 rounded-lg hover:bg-gray-800"
                    >
                      <LogOut className="h-4 w-4 mr-1" />
                      Salir
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <Link to="/login" className="text-gray-400 hover:text-gold-400 font-medium text-sm transition-colors">Ingresar</Link>
                  <Link to="/register" className="gold-gradient text-gray-950 px-4 py-2 rounded-lg hover:opacity-90 font-semibold text-sm transition-colors">Registrarse</Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {drawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setDrawerOpen(false)} />
          <div
            ref={drawerRef}
            className="absolute left-0 top-0 h-full w-72 glass-dark border-r border-gold-500/10 transform transition-transform duration-300 ease-out"
          >
            <div className="p-5 border-b border-gold-500/10">
              <div className="flex items-center justify-between">
                <Link to="/" className="flex items-center text-white font-bold text-lg" onClick={() => setDrawerOpen(false)}>
                  <img src="/logo.jpeg" alt="Barba Negra" className="h-8 w-8 mr-2 rounded-lg object-cover ring-1 ring-gold-400/30" />
                  Barba Negra
                </Link>
                <button
                  onClick={() => setDrawerOpen(false)}
                  className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              {user && (
                <p className="text-gray-500 text-sm mt-2">@{user.name}</p>
              )}
            </div>

            <nav className="p-4">
              <div className="space-y-1">
                {isAuthenticated && isAdmin && navItems.filter(i => i.adminOnly).map(item => (
                  <DrawerNavLink key={item.to} item={item} currentPath={location.pathname} onClick={() => setDrawerOpen(false)} />
                ))}
                {isAuthenticated && navItems.filter(i => !i.adminOnly).map(item => (
                  <DrawerNavLink key={item.to} item={item} currentPath={location.pathname} onClick={() => setDrawerOpen(false)} />
                ))}
              </div>
            </nav>

            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gold-500/10">
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-500/10 text-red-400 rounded-xl hover:bg-red-500/20 transition-colors font-medium"
              >
                <LogOut className="h-5 w-5" />
                Cerrar sesión
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function NavLink({ item, currentPath }: { item: NavItem; currentPath: string }) {
  const isActive = currentPath === item.to || currentPath.startsWith(item.to + '/');
  return (
    <Link
      to={item.to}
      className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all ${
        isActive
          ? 'bg-gold-500/10 text-gold-400'
          : 'text-gray-400 hover:text-white hover:bg-gray-800'
      }`}
    >
      <item.icon className="h-4 w-4 mr-2" />
      <span className="hidden xl:inline">{item.label}</span>
    </Link>
  );
}

function DrawerNavLink({ item, currentPath, onClick }: { item: NavItem; currentPath: string; onClick: () => void }) {
  const isActive = currentPath === item.to || currentPath.startsWith(item.to + '/');
  return (
    <Link
      to={item.to}
      onClick={onClick}
      className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all ${
        isActive
          ? 'bg-gold-500/10 text-gold-400 border border-gold-500/20'
          : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
      }`}
    >
      <div className="flex items-center gap-3">
        <item.icon className="h-5 w-5" />
        {item.label}
      </div>
      {isActive && <ChevronRight className="h-4 w-4" />}
    </Link>
  );
}
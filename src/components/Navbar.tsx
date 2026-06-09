import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import { LogOut, ShoppingBag, LayoutDashboard, ClipboardList, MapPin, Gift, BarChart3 } from 'lucide-react';

const Navbar = () => {
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="glass-dark border-b border-gold-500/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center text-white font-bold text-xl">
              <img src="/logo.jpeg" alt="Barba Negra" className="h-8 w-8 mr-2 rounded-lg object-cover ring-1 ring-gold-400/30" />
              Barba Negra <span className="gold-text ml-1">Admin</span>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                {isAdmin && (
                  <>
                    <Link to="/dashboard" className="flex items-center text-gray-400 hover:text-gold-400 font-medium text-sm transition-colors">
                      <BarChart3 className="h-4 w-4 mr-1" />
                      Stats
                    </Link>
                    <Link to="/products" className="flex items-center text-gray-400 hover:text-gold-400 font-medium text-sm transition-colors">
                      <LayoutDashboard className="h-4 w-4 mr-1" />
                      Productos
                    </Link>
                    <Link to="/orders" className="flex items-center text-gray-400 hover:text-gold-400 font-medium text-sm transition-colors">
                      <ClipboardList className="h-4 w-4 mr-1" />
                      Pedidos
                    </Link>
                    <Link to="/admin/delivery-zones" className="flex items-center text-gray-400 hover:text-gold-400 font-medium text-sm transition-colors">
                      <MapPin className="h-4 w-4 mr-1" />
                      Zonas
                    </Link>
                    <Link to="/admin/rewards" className="flex items-center text-gray-400 hover:text-gold-400 font-medium text-sm transition-colors">
                      <Gift className="h-4 w-4 mr-1" />
                      Recompensas
                    </Link>
                  </>
                )}
                <Link to="/my-orders" className="flex items-center text-gray-400 hover:text-gold-400 font-medium text-sm transition-colors">
                  <ShoppingBag className="h-4 w-4 mr-1" />
                  Mis Pedidos
                </Link>
                <span className="text-gray-500 text-sm">{user?.name}</span>
                <button onClick={handleLogout} className="flex items-center text-gray-500 hover:text-red-400 transition-colors text-sm">
                  <LogOut className="h-4 w-4 mr-1" />
                  Salir
                </button>
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
  );
};

export default Navbar;

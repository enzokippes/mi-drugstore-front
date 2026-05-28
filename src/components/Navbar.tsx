import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, ShoppingBag, LayoutDashboard, ClipboardList } from 'lucide-react';

const Navbar = () => {
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-gray-900 border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center text-white font-bold text-xl">
              <img src="/logo.jpeg" alt="Barba Negra" className="h-8 w-8 mr-2 rounded-lg object-cover" />
              Barba Negra Drugstore
            </Link>
          </div>
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                {isAdmin && (
                  <>
                    <Link to="/dashboard" className="flex items-center text-gray-400 hover:text-white font-medium text-sm transition-colors">
                      <LayoutDashboard className="h-4 w-4 mr-1" />
                      Dashboard
                    </Link>
                    <Link to="/orders" className="flex items-center text-gray-400 hover:text-white font-medium text-sm transition-colors">
                      <ClipboardList className="h-4 w-4 mr-1" />
                      Pedidos
                    </Link>
                  </>
                )}
                <Link to="/my-orders" className="flex items-center text-gray-400 hover:text-white font-medium text-sm transition-colors">
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
                <Link to="/login" className="text-gray-400 hover:text-white font-medium text-sm transition-colors">Ingresar</Link>
                <Link to="/register" className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 font-medium text-sm transition-colors">Registrarse</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

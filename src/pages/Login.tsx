import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { LogIn, ArrowLeft, Eye, EyeOff } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [shake, setShake] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await api.post('/auth/login', { email, password });
      const { user, token } = response.data;
      login(token, user);
      navigate(user.role === 'ADMIN' ? '/dashboard' : '/');
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } };
      setError(axiosErr.response?.data?.message || 'Error al iniciar sesión.');
      setShake(true);
      setTimeout(() => setShake(false), 500);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col">
      <div className="bg-gray-900 border-b border-gray-800 py-2 px-6">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-white transition-colors">
          <ArrowLeft className="h-4 w-4" /> Volver a la tienda
        </Link>
      </div>
      <div className="flex-1 flex items-center justify-center p-4">
        <div className={`bg-gray-900 border border-gray-800 p-8 rounded-2xl shadow-2xl max-w-md w-full ${shake ? 'animate-shake' : 'animate-fade-in'}`}>
          <div className="flex justify-center mb-6">
            <div className="bg-green-900/30 p-4 rounded-2xl">
              <LogIn className="h-10 w-10 text-green-500" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-center text-white mb-2">Bienvenido de vuelta</h2>
          <p className="text-center text-gray-500 text-sm mb-6">Iniciá sesión para continuar</p>
          {error && <div className="bg-red-900/20 border border-red-800/30 text-red-400 p-3 rounded-xl mb-4 text-sm text-center">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-400 mb-1.5">Email</label>
              <input type="email" required className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-600 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all text-sm" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="tu@email.com" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-400 mb-1.5">Contraseña</label>
              <div className="relative">
                <input type={showPassword ? 'text' : 'password'} required className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-600 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all text-sm pr-10" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-400">
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading} className="w-full bg-green-600 text-white font-semibold py-2.5 px-4 rounded-xl hover:bg-green-700 transition-all mt-2 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2">
              {loading ? <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" /> : 'Ingresar'}
            </button>
          </form>
          <p className="mt-6 text-center text-sm text-gray-500">
            ¿No tenés cuenta? <Link to="/register" className="text-green-500 hover:text-green-400 font-semibold">Registrate acá</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

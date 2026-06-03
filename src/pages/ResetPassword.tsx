import { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { ArrowLeft, Lock, Eye, EyeOff, CheckCircle } from 'lucide-react';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token) {
      setError('Token invalido o faltante');
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres');
      return;
    }

    setLoading(true);
    try {
      await api.post('/auth/reset-password', { token, password });
      setDone(true);
    } catch {
      setError('No se pudo restablecer la contraseña. El link puede haber expirado.');
    } finally {
      setLoading(false);
    }
  };

  if (!token && !error) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Token invalido</p>
          <Link to="/login" className="text-gold-400 hover:text-gold-300 font-semibold">Volver al login</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-gold-950/20 via-transparent to-gold-950/10 pointer-events-none" />
      <div className="glass-dark border-b border-gray-800/50 py-2 px-6 relative">
        <Link to="/login" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gold-400 transition-colors">
          <ArrowLeft className="h-4 w-4" /> Volver al login
        </Link>
      </div>
      <div className="flex-1 flex items-center justify-center p-4 relative">
        {done ? (
          <div className="glass p-8 rounded-2xl shadow-2xl max-w-md w-full border border-gold-500/10 animate-fade-in text-center">
            <div className="bg-green-500/10 p-4 rounded-2xl border border-green-500/20 inline-flex mb-6">
              <CheckCircle className="h-10 w-10 text-green-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Contraseña actualizada</h2>
            <p className="text-gray-500 text-sm mb-6">Ya podes iniciar sesion con tu nueva contraseña</p>
            <button
              onClick={() => navigate('/login')}
              className="gold-gradient text-gray-950 font-semibold px-6 py-2.5 rounded-xl hover:opacity-90 transition-all"
            >
              Iniciar sesion
            </button>
          </div>
        ) : (
          <div className="glass p-8 rounded-2xl shadow-2xl max-w-md w-full border border-gold-500/10 animate-fade-in">
            <div className="flex justify-center mb-6">
              <div className="bg-gold-500/10 p-4 rounded-2xl border border-gold-500/20">
                <Lock className="h-10 w-10 text-gold-400" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-center text-white mb-2">Nueva contraseña</h2>
            <p className="text-center text-gray-500 text-sm mb-6">Ingresá tu nueva contraseña</p>
            {error && <div className="bg-red-900/20 border border-red-800/30 text-red-400 p-3 rounded-xl mb-4 text-sm text-center">{error}</div>}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-400 mb-1.5">Nueva contraseña</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    className="w-full px-4 py-2.5 bg-gray-800/80 border border-gray-700/60 rounded-xl text-white placeholder-gray-600 focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500 outline-none transition-all text-sm pr-10"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimo 8 caracteres"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-400">
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-400 mb-1.5">Confirmar contraseña</label>
                <div className="relative">
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    required
                    className="w-full px-4 py-2.5 bg-gray-800/80 border border-gray-700/60 rounded-xl text-white placeholder-gray-600 focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500 outline-none transition-all text-sm pr-10"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeti la contraseña"
                  />
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-400">
                    {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <button
                type="submit"
                disabled={loading || !token}
                className="w-full gold-gradient text-gray-950 font-semibold py-2.5 px-4 rounded-xl hover:opacity-90 transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? <div className="animate-spin rounded-full h-5 w-5 border-2 border-gray-950/30 border-t-gray-950" /> : 'Actualizar contraseña'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
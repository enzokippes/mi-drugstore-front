import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { ArrowLeft, Mail, CheckCircle } from 'lucide-react';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.post('/auth/forgot-password', { email });
      setSent(true);
    } catch {
      setError('No pudimos procesar tu solicitud');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-gold-950/20 via-transparent to-gold-950/10 pointer-events-none" />
      <div className="glass-dark border-b border-gray-800/50 py-2 px-6 relative">
        <Link to="/login" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gold-400 transition-colors">
          <ArrowLeft className="h-4 w-4" /> Volver al login
        </Link>
      </div>
      <div className="flex-1 flex items-center justify-center p-4 relative">
        {sent ? (
          <div className="glass p-8 rounded-2xl shadow-2xl max-w-md w-full border border-gold-500/10 animate-fade-in text-center">
            <div className="bg-green-500/10 p-4 rounded-2xl border border-green-500/20 inline-flex mb-6">
              <CheckCircle className="h-10 w-10 text-green-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Email enviado</h2>
            <p className="text-gray-500 text-sm mb-6">
              Si existe una cuenta con ese email, vas a recibir un link para restablecer tu contraseña.
            </p>
            <p className="text-xs text-gray-600 mb-6">
              Revisá tu casilla de correo (incluyendo spam).
            </p>
            <Link to="/login" className="text-gold-400 hover:text-gold-300 font-semibold text-sm">
              Volver al login
            </Link>
          </div>
        ) : (
          <div className="glass p-8 rounded-2xl shadow-2xl max-w-md w-full border border-gold-500/10 animate-fade-in">
            <div className="flex justify-center mb-6">
              <div className="bg-gold-500/10 p-4 rounded-2xl border border-gold-500/20">
                <Mail className="h-10 w-10 text-gold-400" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-center text-white mb-2">Olvidaste tu contraseña?</h2>
            <p className="text-center text-gray-500 text-sm mb-6">Ingresa tu email y te enviaremos un link para recuperarla</p>
            {error && <div className="bg-red-900/20 border border-red-800/30 text-red-400 p-3 rounded-xl mb-4 text-sm text-center">{error}</div>}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-400 mb-1.5">Email</label>
                <input
                  type="email"
                  required
                  className="w-full px-4 py-2.5 bg-gray-800/80 border border-gray-700/60 rounded-xl text-white placeholder-gray-600 focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500 outline-none transition-all text-sm"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full gold-gradient text-gray-950 font-semibold py-2.5 px-4 rounded-xl hover:opacity-90 transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? <div className="animate-spin rounded-full h-5 w-5 border-2 border-gray-950/30 border-t-gray-950" /> : 'Enviar email'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
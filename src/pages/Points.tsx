import { useState, useEffect } from 'react';
import { Star, Gift, History, ArrowLeft, Trophy, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useToast } from '../components/useToast';
import { useCart } from '../context/useCart';
import type { UserPoints, LoyaltyPointEntry, PointReward } from '../types';

export default function Points() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { addRewardToCart } = useCart();
  const [points, setPoints] = useState<UserPoints>({ totalPoints: 0 });
  const [history, setHistory] = useState<LoyaltyPointEntry[]>([]);
  const [rewards, setRewards] = useState<PointReward[]>([]);
  const [loading, setLoading] = useState(true);
  const [redeeming, setRedeeming] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const [pointsRes, historyRes, rewardsRes] = await Promise.all([
          api.get('/loyalty/my-points'),
          api.get('/loyalty/history'),
          api.get('/loyalty/rewards'),
        ]);
        if (!cancelled) {
          setPoints(pointsRes.data);
          setHistory(historyRes.data);
          setRewards(rewardsRes.data);
        }
      } catch { /* silent */ }
      if (!cancelled) setLoading(false);
    }
    load();
    return () => { cancelled = true; };
  }, []);

  async function handleRedeem(reward: PointReward) {
    if (!reward.productId || !reward.product) {
      showToast('Esta recompensa no tiene producto asociado', 'error');
      return;
    }

    setRedeeming(reward.id);
    try {
      await api.post('/loyalty/validate-reward', { rewardId: reward.id });
      addRewardToCart(reward.product, reward.id, reward.pointsCost);
      showToast(`${reward.name} agregado al carrito`, 'success');
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } };
      const msg = axiosErr.response?.data?.message;
      showToast(msg || 'Error al validar recompensa', 'error');
    } finally {
      setRedeeming(null);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-gray-800 border-t-gold-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950">
      <header className="glass-dark sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-3">
          <button onClick={() => navigate('/')} className="text-gray-400 hover:text-white transition-colors">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-white font-bold text-lg">Barba Negra <span className="gold-text">Points</span></h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        <div className="glass rounded-2xl p-6 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-gold-500/5 via-transparent to-gold-500/5" />
          <div className="relative">
            <div className="w-16 h-16 mx-auto mb-3 rounded-full gold-gradient flex items-center justify-center shadow-lg shadow-gold-500/20">
              <Trophy className="text-gray-950" size={32} />
            </div>
            <p className="text-gray-400 text-sm mb-1">Tus puntos</p>
            <p className="text-5xl font-bold gold-text">{points.totalPoints}</p>
            <p className="text-gray-500 text-xs mt-2">Gana 1 punto por cada $100 gastados</p>
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-3">
            <Gift size={18} className="text-gold-400" />
            <h2 className="text-white font-bold text-lg">Canjea tus puntos</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {rewards.map(reward => {
              const canAfford = points.totalPoints >= reward.pointsCost;
              return (
                <div key={reward.id} className={`glass rounded-2xl p-4 border ${canAfford ? 'border-gold-500/20' : 'border-gray-800/50 opacity-60'}`}>
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gold-500/10 flex items-center justify-center shrink-0">
                      <Star className="text-gold-400" size={20} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-white font-semibold text-sm">{reward.name}</h3>
                      {reward.description && (
                        <p className="text-gray-400 text-xs mt-0.5">{reward.description}</p>
                      )}
                      <div className="flex items-center gap-1.5 mt-2">
                        <Star size={12} className="text-gold-400" />
                        <span className="gold-text font-bold text-sm">{reward.pointsCost} pts</span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRedeem(reward)}
                    disabled={!canAfford || !reward.product || redeeming === reward.id}
                    className={`w-full mt-3 py-2 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
                      canAfford && reward.product && redeeming !== reward.id
                        ? 'gold-gradient text-gray-950 hover:opacity-90'
                        : 'bg-gray-800 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    {redeeming === reward.id ? (
                      <>
                        <div className="w-4 h-4 border-2 border-gray-500 border-t-gray-950 rounded-full animate-spin" />
                        Validando...
                      </>
                    ) : canAfford && reward.product ? (
                      'Agregar al carrito'
                    ) : !reward.product ? (
                      'Sin producto'
                    ) : (
                      'Puntos insuficientes'
                    )}
                  </button>
                </div>
              );
            })}
          </div>
          {rewards.length === 0 && (
            <div className="glass rounded-2xl p-8 text-center">
              <Gift className="text-gray-600 mx-auto mb-2" size={32} />
              <p className="text-gray-500 text-sm">No hay recompensas disponibles por ahora</p>
            </div>
          )}
        </div>

        <div>
          <div className="flex items-center gap-2 mb-3">
            <History size={18} className="text-gold-400" />
            <h2 className="text-white font-bold text-lg">Historial</h2>
          </div>
          <div className="space-y-2">
            {history.slice(0, 20).map(entry => (
              <div key={entry.id} className="glass rounded-xl p-3 flex items-center justify-between border border-gray-800/50">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    entry.points > 0 ? 'bg-gold-500/10' : 'bg-red-500/10'
                  }`}>
                    {entry.points > 0 ? (
                      <TrendingUp size={14} className="text-gold-400" />
                    ) : (
                      <Gift size={14} className="text-red-400" />
                    )}
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium">
                      {entry.reason === 'PURCHASE' ? 'Compra' : entry.reason === 'REDEMPTION' ? 'Canje' : entry.reason === 'BONUS' ? 'Bonus' : entry.reason}
                    </p>
                    <p className="text-gray-500 text-xs">
                      {new Date(entry.createdAt).toLocaleDateString('es-AR')}
                    </p>
                  </div>
                </div>
                <span className={`font-bold text-sm ${entry.points > 0 ? 'text-gold-400' : 'text-red-400'}`}>
                  {entry.points > 0 ? '+' : ''}{entry.points}
                </span>
              </div>
            ))}
            {history.length === 0 && (
              <div className="glass rounded-2xl p-8 text-center">
                <History className="text-gray-600 mx-auto mb-2" size={32} />
                <p className="text-gray-500 text-sm">Todavia no tenes puntos. Hace tu primer pedido!</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

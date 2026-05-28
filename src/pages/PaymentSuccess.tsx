import { useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle, ShoppingBag } from 'lucide-react';

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const paymentId = searchParams.get('payment_id');
  const orderId = searchParams.get('external_reference');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="max-w-lg mx-auto animate-fade-in">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 text-center">
        <div className="flex justify-center mb-6">
          <div className="bg-green-900/30 p-6 rounded-full">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">Pago exitoso</h1>
        <p className="text-gray-400 mb-6">Tu pago fue procesado correctamente. Recibiras un email de confirmacion.</p>
        {paymentId && (
          <div className="bg-gray-800/50 rounded-xl p-4 mb-6">
            <p className="text-gray-500 text-xs mb-1">ID de pago</p>
            <p className="text-white font-mono text-sm">{paymentId}</p>
          </div>
        )}
        {orderId && (
          <div className="bg-gray-800/50 rounded-xl p-4 mb-6">
            <p className="text-gray-500 text-xs mb-1">Pedido</p>
            <p className="text-white font-mono text-sm">#{orderId.slice(0, 8).toUpperCase()}</p>
          </div>
        )}
        <div className="flex flex-col sm:flex-row gap-3">
          <Link to="/my-orders" className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 transition-colors font-medium">
            <ShoppingBag className="h-4 w-4" />
            Ver mis pedidos
          </Link>
          <Link to="/" className="flex-1 flex items-center justify-center gap-2 bg-gray-800 text-white px-6 py-3 rounded-xl hover:bg-gray-700 transition-colors font-medium">
            Volver a la tienda
          </Link>
        </div>
      </div>
    </div>
  );
}

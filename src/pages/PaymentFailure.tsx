import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { XCircle, ShoppingBag } from 'lucide-react';

export default function PaymentFailure() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="max-w-lg mx-auto animate-fade-in">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 text-center">
        <div className="flex justify-center mb-6">
          <div className="bg-red-900/30 p-6 rounded-full">
            <XCircle className="h-16 w-16 text-red-500" />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">Pago rechazado</h1>
        <p className="text-gray-400 mb-6">No se pudo procesar tu pago. Podes intentar nuevamente o elegir otro metodo de pago.</p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Link to="/" className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 transition-colors font-medium">
            <ShoppingBag className="h-4 w-4" />
            Volver a la tienda
          </Link>
          <Link to="/my-orders" className="flex-1 flex items-center justify-center gap-2 bg-gray-800 text-white px-6 py-3 rounded-xl hover:bg-gray-700 transition-colors font-medium">
            Ver mis pedidos
          </Link>
        </div>
      </div>
    </div>
  );
}

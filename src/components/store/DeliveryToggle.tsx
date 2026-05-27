import { useState } from 'react';
import { Store as StoreIcon, Truck } from 'lucide-react';

interface DeliveryToggleProps {
  isAuthenticated: boolean;
  onTypeChange: (type: 'pickup' | 'delivery') => void;
}

export default function DeliveryToggle({ isAuthenticated, onTypeChange }: DeliveryToggleProps) {
  const [deliveryType, setDeliveryType] = useState<'pickup' | 'delivery'>('pickup');

  function handleTypeChange(type: 'pickup' | 'delivery') {
    setDeliveryType(type);
    onTypeChange(type);
  }

  return (
    <div className="flex items-center justify-center gap-2.5 py-2 px-3 sm:px-4">
      <button
        onClick={() => handleTypeChange('pickup')}
        className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${
          deliveryType === 'pickup'
            ? 'bg-green-600 text-white shadow-lg shadow-green-600/20'
            : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
        }`}
      >
        <StoreIcon size={16} />
        Para retirar
      </button>
      <button
        onClick={() => { if (isAuthenticated) handleTypeChange('delivery'); }}
        className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${
          deliveryType === 'delivery'
            ? 'bg-green-600 text-white shadow-lg shadow-green-600/20'
            : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
        }`}
      >
        <Truck size={16} />
        Delivery
      </button>
    </div>
  );
}

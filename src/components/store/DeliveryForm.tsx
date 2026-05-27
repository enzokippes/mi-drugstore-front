interface DeliveryFormProps {
  address: string;
  phone: string;
  notes: string;
  deliveryTime: string;
  timeSlots: string[];
  onAddressChange: (v: string) => void;
  onPhoneChange: (v: string) => void;
  onNotesChange: (v: string) => void;
  onTimeChange: (v: string) => void;
}

export default function DeliveryForm({
  address, phone, notes, deliveryTime, timeSlots,
  onAddressChange, onPhoneChange, onNotesChange, onTimeChange,
}: DeliveryFormProps) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4 space-y-3 animate-fade-in">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <input
          type="text"
          placeholder="Dirección de entrega"
          value={address}
          onChange={e => onAddressChange(e.target.value)}
          className="bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-green-500 transition-colors"
        />
        <input
          type="tel"
          placeholder="Teléfono de contacto"
          value={phone}
          onChange={e => onPhoneChange(e.target.value)}
          className="bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-green-500 transition-colors"
        />
      </div>
      <textarea
        placeholder="Notas adicionales (opcional)"
        value={notes}
        onChange={e => onNotesChange(e.target.value)}
        rows={2}
        className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-green-500 transition-colors resize-none"
      />
      <div>
        <label className="text-gray-400 text-sm mb-2 block">Horario de entrega</label>
        {timeSlots.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {timeSlots.map(slot => (
              <button
                key={slot}
                onClick={() => onTimeChange(slot)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  deliveryTime === slot
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-800 text-gray-300 border border-gray-700 hover:border-green-600/50'
                }`}
              >
                {slot}
              </button>
            ))}
          </div>
        ) : (
          <p className="text-red-400 text-sm">No hay horarios disponibles</p>
        )}
      </div>
    </div>
  );
}

export default function PaymentMethods() {
  return (
    <section className="max-w-7xl mx-auto px-3 sm:px-4 py-6">
      <h3 className="text-white font-bold text-sm mb-3">Medios de pago</h3>
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide snap-x snap-mandatory">
        <div className="flex items-center gap-2 bg-gray-900 border border-gray-800 rounded-xl px-4 py-2.5 snap-start shrink-0">
          <div className="flex gap-1">
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="2" y="4" width="20" height="16" rx="3" fill="#1A1F71" />
              <text x="7" y="15" fill="white" fontSize="9" fontWeight="bold" fontFamily="Arial">VISA</text>
            </svg>
          </div>
          <span className="text-gray-300 text-xs sm:text-sm whitespace-nowrap">Tarjetas</span>
        </div>

        <div className="flex items-center gap-2 bg-gray-900 border border-gray-800 rounded-xl px-4 py-2.5 snap-start shrink-0">
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="2" y="4" width="20" height="16" rx="3" fill="#EB001B" />
            <circle cx="10" cy="12" r="4" fill="#F79E1B" />
          </svg>
          <span className="text-gray-300 text-xs sm:text-sm whitespace-nowrap">Débito/Crédito</span>
        </div>

        <div className="flex items-center gap-2 bg-gray-900 border border-gray-800 rounded-xl px-4 py-2.5 snap-start shrink-0">
          <svg className="w-6 h-6 text-green-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="3" y="6" width="18" height="12" rx="2" />
            <line x1="3" y1="10" x2="21" y2="10" />
            <line x1="6" y1="14" x2="8" y2="14" />
          </svg>
          <span className="text-gray-300 text-xs sm:text-sm whitespace-nowrap">Transferencia</span>
        </div>

        <div className="flex items-center gap-2 bg-gray-900 border border-gray-800 rounded-xl px-4 py-2.5 snap-start shrink-0">
          <svg className="w-6 h-6 text-yellow-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="3" y="4" width="18" height="16" rx="3" />
            <circle cx="12" cy="12" r="3" />
            <path d="M12 2v2M12 20v2M2 12h2M20 12h2" />
          </svg>
          <span className="text-gray-300 text-xs sm:text-sm whitespace-nowrap">Efectivo</span>
        </div>
      </div>
    </section>
  );
}

export default function PaymentMethods() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex items-center gap-2 bg-surface-light border border-surface-border rounded-xl px-4 py-2.5">
        <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none">
          <rect x="2" y="4" width="20" height="16" rx="3" fill="#1A1F71" />
          <text x="6" y="15" fill="white" fontSize="8" fontWeight="bold" fontFamily="Arial">VISA</text>
        </svg>
        <span className="text-on-surface text-sm">Tarjetas</span>
      </div>

      <div className="flex items-center gap-2 bg-surface-light border border-surface-border rounded-xl px-4 py-2.5">
        <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none">
          <rect x="2" y="4" width="20" height="16" rx="3" fill="#252a30" />
          <rect x="4" y="6" width="16" height="12" rx="2" fill="#30353b" stroke="#ffd672" strokeWidth="0.5" />
          <text x="5" y="14" fill="#ffd672" fontSize="6" fontWeight="bold" fontFamily="Arial">DEBITO</text>
        </svg>
        <span className="text-on-surface text-sm">Débito</span>
      </div>

      <div className="flex items-center gap-2 bg-surface-light border border-surface-border rounded-xl px-4 py-2.5">
        <svg className="w-7 h-7 text-green-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" fill="none" stroke="currentColor" />
          <path d="M12 6v6l4 2" strokeLinecap="round" />
        </svg>
        <span className="text-on-surface text-sm">Transferencia</span>
      </div>

      <div className="flex items-center gap-2 bg-surface-light border border-surface-border rounded-xl px-4 py-2.5">
        <svg className="w-7 h-7 text-yellow-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="12" cy="12" r="9" />
          <text x="8" y="15" fill="currentColor" fontSize="8" fontWeight="bold" fontFamily="Arial">$</text>
        </svg>
        <span className="text-on-surface text-sm">Efectivo</span>
      </div>
    </div>
  );
}
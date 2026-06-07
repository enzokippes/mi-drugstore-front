import { MapPin, Phone, Clock, CreditCard, Banknote, ArrowRightLeft, Wallet } from 'lucide-react';

export default function Footer() {
  const wspNumber = '5493454322631';

  return (
    <footer className="bg-surface-dark border-t border-surface-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <img src="/logo.jpeg" alt="Barba Negra" className="w-10 h-10 rounded-xl object-cover ring-1 ring-gold-400/20" />
              <div>
                <h3 className="text-white font-bold text-lg">Barba Negra</h3>
                <p className="text-gold-400 text-xs font-medium">Drugstore</p>
              </div>
            </div>
            <p className="text-on-surface-variant text-sm leading-relaxed">
              Tu drugstore de confianza en Concordia. Productos de calidad, precios irresistibles y atención personalizada las 24 horas.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Contacto</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin size={16} className="text-gold-400 mt-0.5 shrink-0" />
                <span className="text-on-surface-variant text-sm">Humberto Primo ESQ Balcarce, Concordia, Entre Ríos</span>
              </li>
              <li>
                <a href={`https://wa.me/${wspNumber}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-on-surface-variant text-sm hover:text-gold-400 transition-colors">
                  <Phone size={16} className="text-gold-400 shrink-0" />
                  <span>345-4322631</span>
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Clock size={16} className="text-gold-400 shrink-0" />
                <span className="text-on-surface-variant text-sm">Abierto 24/7</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Soporte</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-on-surface-variant text-sm hover:text-gold-400 transition-colors inline-block">
                  Preguntas Frecuentes
                </a>
              </li>
              <li>
                <a href="#" className="text-on-surface-variant text-sm hover:text-gold-400 transition-colors inline-block">
                  Términos y Condiciones
                </a>
              </li>
              <li>
                <a href="#" className="text-on-surface-variant text-sm hover:text-gold-400 transition-colors inline-block">
                  Política de Privacidad
                </a>
              </li>
              <li>
                <a href="#" className="text-on-surface-variant text-sm hover:text-gold-400 transition-colors inline-block">
                  Política de Envíos
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Medios de Pago</h4>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center gap-2 bg-surface-light border border-surface-border rounded-lg px-3 py-2">
                <CreditCard size={18} className="text-gold-400" />
                <span className="text-on-surface text-xs">Tarjetas</span>
              </div>
              <div className="flex items-center gap-2 bg-surface-light border border-surface-border rounded-lg px-3 py-2">
                <Wallet size={18} className="text-slate-blue" />
                <span className="text-on-surface text-xs">Débito</span>
              </div>
              <div className="flex items-center gap-2 bg-surface-light border border-surface-border rounded-lg px-3 py-2">
                <ArrowRightLeft size={18} className="text-green-400" />
                <span className="text-on-surface text-xs">Transferencia</span>
              </div>
              <div className="flex items-center gap-2 bg-surface-light border border-surface-border rounded-lg px-3 py-2">
                <Banknote size={18} className="text-yellow-400" />
                <span className="text-on-surface text-xs">Efectivo</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-surface-border mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-surface-muted text-xs">
            © {new Date().getFullYear()} Barba Negra Drugstore. Todos los derechos reservados.
          </p>
          <p className="text-surface-muted text-xs">
            Hecho con 💛 en Concordia
          </p>
        </div>
      </div>
    </footer>
  );
}
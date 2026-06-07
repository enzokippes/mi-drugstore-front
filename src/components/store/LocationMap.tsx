import { MapPin, ExternalLink, Clock } from 'lucide-react';

const lat = -31.385226592108864;
const lng = -58.02879512303576;

export default function LocationMap() {
  return (
    <section className="w-full py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="relative rounded-2xl overflow-hidden" style={{ maxHeight: '500px' }}>
          <iframe
            src={`https://maps.google.com/maps?q=${lat},${lng}&z=18&ie=UTF8&iwloc=&output=embed`}
            width="100%"
            height="500"
            style={{ border: 0, filter: 'grayscale(40%) brightness(0.75) contrast(1.05)' }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Barba Negra Drugstore - Ubicación"
            className="w-full"
          />

          <div className="absolute bottom-6 left-6 right-6 sm:left-auto sm:right-6 sm:max-w-sm z-20">
            <div className="glass-dark rounded-2xl p-5 border border-gold-400/10">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl gold-gradient flex items-center justify-center shrink-0">
                  <MapPin size={18} className="text-surface-dark" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-base">Visitá nuestro local</h3>
                  <p className="text-on-surface-variant text-sm mt-0.5">H. Primo ESQ Balcarce, Concordia</p>
                </div>
              </div>

              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center gap-1.5 bg-gold-400/15 text-gold-400 text-xs font-medium px-2.5 py-1 rounded-full">
                  <Clock size={12} />
                  <span>7:00 - 1:00</span>
                </div>
              </div>

              <a
                href={`https://maps.google.com/maps?q=${lat},${lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full gold-gradient text-surface-dark font-semibold py-2.5 rounded-xl hover:opacity-90 transition-all"
              >
                <ExternalLink size={16} />
                Abrir en Maps
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
import { MapPin, ExternalLink } from 'lucide-react';

const lat = -31.385226592108864;
const lng = -58.02879512303576;

export default function LocationMap() {
  return (
    <section className="max-w-7xl mx-auto px-3 sm:px-4 py-8">
      <div className="flex items-center gap-2 mb-4">
        <MapPin size={20} className="text-green-400" />
        <h3 className="text-white font-bold text-lg">Encontranos</h3>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
        <div className="aspect-video sm:aspect-[21/9] w-full">
          <iframe
            src={`https://maps.google.com/maps?q=${lat},${lng}&z=18&ie=UTF8&iwloc=&output=embed`}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Barba Negra Drugstore - Ubicación"
            className="w-full h-full"
          />
        </div>

        <div className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <p className="text-white font-medium text-sm">Humberto Primo ESQ Balcarce</p>
            <p className="text-gray-500 text-xs">Concordia, Entre Ríos</p>
          </div>
          <a
            href={`https://maps.google.com/maps?q=${lat},${lng}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-4 py-2 bg-green-600/20 text-green-400 rounded-lg text-sm font-medium hover:bg-green-600 hover:text-white transition-all"
          >
            <ExternalLink size={14} />
            Abrir en Maps
          </a>
        </div>
      </div>
    </section>
  );
}

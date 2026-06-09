import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <span className="text-7xl block mb-4">🔍</span>
        <h1 className="text-5xl font-bold gold-text mb-4">404</h1>
        <p className="text-on-surface-variant text-lg mb-2">Ups! Página no encontrada</p>
        <p className="text-surface-muted text-sm mb-6">
          La página que buscás no existe o fue movida.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 gold-gradient text-surface-dark px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity"
        >
          <span>←</span>
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}
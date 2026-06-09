import { Component, type ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="min-h-screen bg-surface flex items-center justify-center p-4">
          <div className="text-center max-w-md">
            <span className="text-6xl block mb-4">⚠️</span>
            <h2 className="text-white font-bold text-2xl mb-2">Algo salió mal</h2>
            <p className="text-on-surface-variant text-sm mb-4">
              Ocurrió un error inesperado. Por favor, intentá de nuevo.
            </p>
            {this.state.error && (
              <p className="text-surface-muted text-xs mb-4 p-2 bg-surface-light rounded-lg">
                {this.state.error.message}
              </p>
            )}
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.reload();
              }}
              className="gold-gradient text-surface-dark px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity"
            >
              Recargar página
            </button>
            <div className="mt-4">
              <Link to="/" className="text-gold-400 hover:text-gold-300 text-sm">
                ← Volver al inicio
              </Link>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
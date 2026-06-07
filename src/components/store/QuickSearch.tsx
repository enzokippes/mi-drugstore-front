import { Search, X } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useDebounce } from '../../hooks/useDebounce';

interface Product {
  id: string;
  name: string;
  price: number;
}

interface QuickSearchProps {
  products: Product[];
  onSelect: (productId: string) => void;
  onSearch: (query: string) => void;
}

export default function QuickSearch({ products, onSelect, onSearch }: QuickSearchProps) {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 200);
  const [showResults, setShowResults] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    onSearch(debouncedQuery);
  }, [debouncedQuery, onSearch]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowResults(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filtered = query.trim()
    ? products
        .filter(p => p.name.toLowerCase().includes(query.toLowerCase()))
        .slice(0, 5)
    : [];

  function handleSelect(productId: string) {
    onSelect(productId);
    setQuery('');
    setShowResults(false);
  }

  return (
    <div className="max-w-7xl mx-auto px-4" ref={containerRef}>
      <div className="relative max-w-md">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-muted" />
        <input
          ref={inputRef}
          type="text"
          role="searchbox"
          aria-label="Buscar productos"
          placeholder="Buscar productos..."
          value={query}
          onChange={e => { setQuery(e.target.value); setShowResults(true); }}
          onFocus={() => { if (query.trim()) setShowResults(true); }}
          className="w-full bg-surface-light border border-surface-border text-on-surface rounded-full pl-11 pr-10 py-2.5 text-sm focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400/20 transition-all placeholder:text-surface-muted"
        />
        {query && (
          <button
            onClick={() => { setQuery(''); setShowResults(false); inputRef.current?.focus(); }}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-surface-muted hover:text-on-surface transition-colors"
            aria-label="Limpiar búsqueda"
          >
            <X size={16} />
          </button>
        )}

        {showResults && query.trim() && (
          <div className="absolute top-full mt-2 left-0 right-0 bg-surface-light border border-surface-border rounded-xl overflow-hidden z-50 shadow-xl shadow-black/30">
            {filtered.length > 0 ? (
              filtered.map(p => (
                <button
                  key={p.id}
                  onClick={() => handleSelect(p.id)}
                  className="w-full flex items-center justify-between px-4 py-3 text-sm hover:bg-surface-variant transition-colors text-left"
                >
                  <span className="text-on-surface truncate">{p.name}</span>
                  <span className="text-gold-400 font-medium ml-3 shrink-0">${p.price.toLocaleString('es-AR')}</span>
                </button>
              ))
            ) : (
              <p className="px-4 py-3 text-sm text-surface-muted">No se encontraron productos</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
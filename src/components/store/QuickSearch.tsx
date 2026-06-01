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
    <div className="max-w-7xl mx-auto px-3 sm:px-4" ref={containerRef}>
      <div className="relative">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
        <input
          ref={inputRef}
          type="text"
          role="searchbox"
          aria-label="Buscar productos"
          placeholder="Buscar productos..."
          value={query}
          onChange={e => { setQuery(e.target.value); setShowResults(true); }}
          onFocus={() => { if (query.trim()) setShowResults(true); }}
          className="w-full bg-gray-800/80 border border-gray-700/60 text-white rounded-xl pl-10 pr-10 py-2.5 text-sm focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500/30 transition-all placeholder:text-gray-500"
        />
        {query && (
          <button
            onClick={() => { setQuery(''); setShowResults(false); inputRef.current?.focus(); }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
            aria-label="Limpiar busqueda"
          >
            <X size={16} />
          </button>
        )}

        {showResults && query.trim() && (
          <div className="absolute top-full mt-1 left-0 right-0 bg-gray-800 border border-gray-700 rounded-xl overflow-hidden z-50 shadow-xl shadow-black/40">
            {filtered.length > 0 ? (
              filtered.map(p => (
                <button
                  key={p.id}
                  onClick={() => handleSelect(p.id)}
                  className="w-full flex items-center justify-between px-4 py-2.5 text-sm hover:bg-gray-700/80 transition-colors text-left"
                >
                  <span className="text-white truncate">{p.name}</span>
                  <span className="gold-text font-medium ml-3 shrink-0">${p.price.toLocaleString('es-AR')}</span>
                </button>
              ))
            ) : (
              <p className="px-4 py-3 text-sm text-gray-500">No se encontraron productos</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

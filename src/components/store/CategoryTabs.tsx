import { useState } from 'react';
import { categoryEmojis } from '../../utils/categoryEmojis';
import { LayoutGrid, Search, X } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  parentId?: string | null;
  children?: Category[];
}

interface CategoryTabsProps {
  categories: Category[];
  selected: string | null;
  onSelect: (categoryId: string | null) => void;
  onSearch?: (query: string) => void;
  searchQuery?: string;
}

export default function CategoryTabs({ categories, selected, onSelect, onSearch, searchQuery = '' }: CategoryTabsProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const topCategories = categories.filter(c => !c.parentId);

  function handleCategoryClick(cat: Category) {
    if (cat.children && cat.children.length > 0) {
      setExpandedId(expandedId === cat.id ? null : cat.id);
    } else {
      onSelect(selected === cat.id ? null : cat.id);
      setExpandedId(null);
    }
  }

  function handleSubClick(subId: string) {
    onSelect(selected === subId ? null : subId);
    setExpandedId(null);
  }

  function handleAllClick() {
    onSelect(null);
    setExpandedId(null);
    setMobileMenuOpen(false);
  }

  function handleMobileSelect(catId: string | null) {
    onSelect(catId);
    setMobileMenuOpen(false);
  }

  return (
    <div className="max-w-container-max mx-auto px-4 lg:px-margin-desktop py-6 space-y-6">
      {/* Category Pills + Search Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Category Pills */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={handleAllClick}
            className={`px-6 py-2 rounded-full font-bold transition-all ${
              !selected
                ? 'bg-primary-container text-on-primary shadow-lg'
                : 'bg-surface-container-high text-on-surface hover:bg-surface-variant border border-outline-variant'
            }`}
          >
            Todos
          </button>
          {topCategories.map(cat => {
            const hasChildren = cat.children && cat.children.length > 0;
            const isSelected = selected === cat.id;
            const isChildSelected = hasChildren && cat.children!.some(c => c.id === selected);
            const isActive = isSelected || isChildSelected;

            return (
              <div key={cat.id} className="relative">
                <button
                  onClick={() => handleCategoryClick(cat)}
                  className={`px-6 py-2 rounded-full font-medium transition-all ${
                    isActive
                      ? 'bg-primary-container text-on-primary'
                      : 'bg-surface-container-high text-on-surface hover:bg-surface-variant border border-outline-variant'
                  }`}
                >
                  {cat.name}
                </button>

                {expandedId === cat.id && hasChildren && (
                  <div className="absolute top-full mt-1 left-0 z-50 bg-surface-container border border-outline-variant rounded-xl shadow-xl overflow-hidden min-w-[160px]">
                    <button
                      onClick={() => { onSelect(cat.id); setExpandedId(null); }}
                      className={`w-full text-left px-4 py-3 text-sm hover:bg-surface-container-high transition-colors ${
                        selected === cat.id ? 'text-primary font-medium' : 'text-on-surface'
                      }`}
                    >
                      Todo en {cat.name}
                    </button>
                    {cat.children!.map(sub => (
                      <button
                        key={sub.id}
                        onClick={() => { handleSubClick(sub.id); setExpandedId(null); }}
                        className={`w-full text-left px-4 py-3 text-sm hover:bg-surface-container-high transition-colors ${
                          selected === sub.id ? 'text-primary font-medium' : 'text-on-surface'
                        }`}
                      >
                        {sub.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Search Bar - Desktop */}
        {onSearch && (
          <div className="relative w-full md:w-80">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearch(e.target.value)}
              placeholder="Buscar productos..."
              className="w-full bg-surface-container-low border border-outline-variant rounded-lg pl-10 pr-4 py-2 text-on-surface focus:border-primary-container focus:ring-1 focus:ring-primary-container outline-none transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => onSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary"
              >
                <X size={16} />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Mobile: Category Pills with Scroll */}
      <div className="flex md:hidden overflow-x-auto gap-2 pb-2 custom-scrollbar">
        <button
          onClick={handleAllClick}
          className={`px-4 py-2 rounded-full font-bold text-sm whitespace-nowrap transition-all shrink-0 ${
            !selected
              ? 'bg-primary-container text-on-primary'
              : 'bg-surface-container-high text-on-surface'
          }`}
        >
          Todos
        </button>
        {topCategories.map(cat => {
          const hasChildren = cat.children && cat.children.length > 0;
          const isSelected = selected === cat.id;
          const isChildSelected = hasChildren && cat.children!.some(c => c.id === selected);
          const isActive = isSelected || isChildSelected;

          return (
            <button
              key={cat.id}
              onClick={() => handleMobileSelect(cat.id)}
              className={`px-4 py-2 rounded-full font-medium text-sm whitespace-nowrap transition-all shrink-0 ${
                isActive
                  ? 'bg-primary-container text-on-primary'
                  : 'bg-surface-container-high text-on-surface'
              }`}
            >
              {cat.name}
            </button>
          );
        })}
      </div>

      {/* Mobile Bottom Sheet for Categories */}
      {mobileMenuOpen && (
        <>
          <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
          <div className="fixed bottom-0 left-0 right-0 z-50 bg-surface-container-low border-t border-outline-variant rounded-t-2xl max-h-[70vh] overflow-y-auto animate-slide-up">
            <div className="sticky top-0 bg-surface-container-low border-b border-outline-variant px-4 py-3 flex items-center justify-between">
              <h3 className="font-title-md text-title-md text-on-surface">Categorías</h3>
              <button onClick={() => setMobileMenuOpen(false)} className="p-2 text-on-surface-variant hover:text-primary">
                <X size={20} />
              </button>
            </div>
            <div className="p-4 space-y-1">
              <button
                onClick={handleAllClick}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  !selected
                    ? 'bg-primary-container/20 text-primary border border-primary-container'
                    : 'text-on-surface-variant hover:bg-surface-container'
                }`}
              >
                <LayoutGrid size={18} className="text-primary" />
                Todos los productos
              </button>
              {topCategories.map(cat => {
                const hasChildren = cat.children && cat.children.length > 0;
                const isSelected = selected === cat.id;
                const isChildSelected = hasChildren && cat.children!.some(c => c.id === selected);

                return (
                  <div key={cat.id}>
                    <button
                      onClick={() => handleMobileSelect(cat.id)}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                        isSelected || isChildSelected
                          ? 'bg-primary-container/20 text-primary border border-primary-container'
                          : 'text-on-surface-variant hover:bg-surface-container'
                      }`}
                    >
                      <span>{categoryEmojis[cat.name.toLowerCase()] || '📦'} {cat.name}</span>
                      {hasChildren && <span className="text-outline text-xs">→</span>}
                    </button>
                    {hasChildren && (
                      <div className="ml-6 mt-1 space-y-1">
                        {cat.children!.map(sub => (
                          <button
                            key={sub.id}
                            onClick={() => handleMobileSelect(sub.id)}
                            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs transition-all ${
                              selected === sub.id
                                ? 'bg-primary-container/10 text-primary'
                                : 'text-on-surface-variant hover:bg-surface-container'
                            }`}
                          >
                            {categoryEmojis[sub.name.toLowerCase()] || '📦'} {sub.name}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
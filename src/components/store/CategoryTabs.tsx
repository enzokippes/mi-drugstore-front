import { useState } from 'react';
import { categoryEmojis } from '../../utils/categoryEmojis';
import { ChevronDown, LayoutGrid } from 'lucide-react';

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
}

export default function CategoryTabs({ categories, selected, onSelect }: CategoryTabsProps) {
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
    <div className="max-w-7xl mx-auto px-4">
      <div className="hidden md:flex gap-2 overflow-x-auto scrollbar-hide snap-x snap-mandatory">
        <button
          onClick={handleAllClick}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap snap-start transition-all shrink-0 ${
            !selected
              ? 'bg-gold-400 text-surface-dark font-semibold'
              : 'bg-surface-light text-on-surface-variant hover:bg-surface-variant border border-surface-border'
          }`}
        >
          Todos
        </button>
        {topCategories.map(cat => {
          const hasChildren = cat.children && cat.children.length > 0;
          const isSelected = selected === cat.id;
          const isExpanded = expandedId === cat.id;
          const isChildSelected = hasChildren && cat.children!.some(c => c.id === selected);

          return (
            <div key={cat.id} className="relative shrink-0 snap-start">
              <button
                onClick={() => handleCategoryClick(cat)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap transition-all ${
                  isSelected || isChildSelected
                    ? 'bg-gold-400 text-surface-dark font-semibold'
                    : 'bg-surface-light text-on-surface-variant hover:bg-surface-variant border border-surface-border'
                }`}
              >
                <span>{categoryEmojis[cat.name.toLowerCase()] || '📦'}</span> {cat.name}
                {hasChildren && (
                  <ChevronDown size={12} className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                )}
              </button>

              {isExpanded && hasChildren && (
                <div className="absolute top-full mt-1 left-0 z-50 bg-surface-light border border-surface-border rounded-xl shadow-xl shadow-black/30 overflow-hidden min-w-[140px]">
                  <button
                    onClick={() => { onSelect(cat.id); setExpandedId(null); }}
                    className={`w-full text-left px-4 py-2.5 text-xs hover:bg-surface-variant transition-colors ${
                      selected === cat.id ? 'text-gold-400 font-medium' : 'text-on-surface'
                    }`}
                  >
                    Todo en {cat.name}
                  </button>
                  {cat.children!.map(sub => (
                    <button
                      key={sub.id}
                      onClick={() => { handleSubClick(sub.id); setExpandedId(null); }}
                      className={`w-full text-left px-4 py-2.5 text-xs hover:bg-surface-variant transition-colors ${
                        selected === sub.id ? 'text-gold-400 font-medium' : 'text-on-surface'
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

      <div className="flex md:hidden mt-3">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all shrink-0 ${
            mobileMenuOpen
              ? 'bg-gold-400 text-surface-dark'
              : 'bg-surface-light text-on-surface-variant border border-surface-border'
          }`}
        >
          <LayoutGrid size={16} />
          {selected ? categories.find(c => c.id === selected)?.name || 'Categoría' : 'Todas las categorías'}
          <ChevronDown size={14} className={`transition-transform ${mobileMenuOpen ? 'rotate-180' : ''}`} />
        </button>

        {mobileMenuOpen && (
          <>
            <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
            <div className="fixed bottom-0 left-0 right-0 z-50 bg-surface-light border-t border-surface-border rounded-t-2xl max-h-[70vh] overflow-y-auto animate-slide-up">
              <div className="sticky top-0 bg-surface-light border-b border-surface-border px-4 py-3 flex items-center justify-between">
                <h3 className="text-white font-semibold">Categorías</h3>
                <button onClick={() => setMobileMenuOpen(false)} className="text-on-surface-variant hover:text-white p-1">
                  <ChevronDown size={20} />
                </button>
              </div>
              <div className="p-4 space-y-1">
                <button
                  onClick={handleAllClick}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    !selected
                      ? 'bg-gold-400/10 text-gold-400 border border-gold-400/20'
                      : 'text-on-surface-variant hover:bg-surface-variant'
                  }`}
                >
                  <span className="text-lg">📦</span> Todos los productos
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
                            ? 'bg-gold-400/10 text-gold-400 border border-gold-400/20'
                            : 'text-on-surface-variant hover:bg-surface-variant'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-lg">{categoryEmojis[cat.name.toLowerCase()] || '📦'}</span>
                          {cat.name}
                        </div>
                        {hasChildren && <ChevronDown size={14} className="text-surface-muted" />}
                      </button>
                      {hasChildren && cat.children!.length > 0 && (
                        <div className="ml-6 mt-1 space-y-1">
                          {cat.children!.map(sub => (
                            <button
                              key={sub.id}
                              onClick={() => handleMobileSelect(sub.id)}
                              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs transition-all ${
                                selected === sub.id
                                  ? 'bg-gold-400/10 text-gold-400'
                                  : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-variant/50'
                              }`}
                            >
                              <span>{categoryEmojis[sub.name.toLowerCase()] || '📦'}</span>
                              {sub.name}
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
    </div>
  );
}
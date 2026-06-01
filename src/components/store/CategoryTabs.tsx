import { useState } from 'react';
import { categoryEmojis } from '../../utils/categoryEmojis';
import { ChevronDown } from 'lucide-react';

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
  }

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 py-3">
      <div className="flex gap-2 overflow-x-auto scrollbar-hide snap-x snap-mandatory">
        <button
          onClick={handleAllClick}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap snap-start transition-all shrink-0 ${
            !selected
              ? 'gold-gradient text-gray-950 shadow-lg shadow-gold-500/20'
              : 'bg-gray-800/80 text-gray-400 hover:bg-gray-700 border border-gray-700/50'
          }`}
        >
          <span>📦</span> Todos
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
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap transition-all ${
                  isSelected || isChildSelected
                    ? 'gold-gradient text-gray-950 shadow-lg shadow-gold-500/20'
                    : 'bg-gray-800/80 text-gray-400 hover:bg-gray-700 border border-gray-700/50'
                }`}
              >
                <span>{categoryEmojis[cat.name.toLowerCase()] || categoryEmojis.default}</span> {cat.name}
                {hasChildren && (
                  <ChevronDown size={12} className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                )}
              </button>

              {isExpanded && hasChildren && (
                <div className="absolute top-full mt-1 left-0 z-50 bg-gray-800 border border-gray-700 rounded-xl shadow-xl shadow-black/40 overflow-hidden min-w-[140px]">
                  <button
                    onClick={() => { onSelect(cat.id); setExpandedId(null); }}
                    className={`w-full text-left px-4 py-2 text-xs hover:bg-gray-700/80 transition-colors ${
                      selected === cat.id ? 'text-gold-400 font-medium' : 'text-gray-300'
                    }`}
                  >
                    Todo en {cat.name}
                  </button>
                  {cat.children!.map(sub => (
                    <button
                      key={sub.id}
                      onClick={() => { handleSubClick(sub.id); setExpandedId(null); }}
                      className={`w-full text-left px-4 py-2 text-xs hover:bg-gray-700/80 transition-colors ${
                        selected === sub.id ? 'text-gold-400 font-medium' : 'text-gray-300'
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
  );
}

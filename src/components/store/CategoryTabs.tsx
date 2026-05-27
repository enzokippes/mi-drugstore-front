import { categoryEmojis } from '../../utils/categoryEmojis';

interface Category {
  id: string;
  name: string;
}

interface CategoryTabsProps {
  categories: Category[];
  selected: string | null;
  onSelect: (categoryId: string | null) => void;
}

export default function CategoryTabs({ categories, selected, onSelect }: CategoryTabsProps) {
  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 py-3">
      <div className="flex gap-2 overflow-x-auto scrollbar-hide snap-x snap-mandatory">
        <button
          onClick={() => onSelect(null)}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap snap-start transition-all shrink-0 ${
            !selected
              ? 'bg-green-600 text-white shadow-lg shadow-green-600/20'
              : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
          }`}
        >
          <span>📦</span> Todos
        </button>
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => onSelect(cat.id)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap snap-start transition-all shrink-0 ${
              selected === cat.id
                ? 'bg-green-600 text-white shadow-lg shadow-green-600/20'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            <span>{categoryEmojis[cat.name.toLowerCase()] || categoryEmojis.default}</span> {cat.name}
          </button>
        ))}
      </div>
    </div>
  );
}

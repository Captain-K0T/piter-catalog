// app/components/CategoryFilter.jsx
import { categories } from '../data/categories';

const CategoryFilter = ({ activeCategory, onCategoryClick }) => {
  return (
    <div className="w-full overflow-x-auto no-scrollbar">
      <div className="flex gap-2 px-4 pb-4">
        {/* All button */}
        <button
          onClick={() => onCategoryClick(null)}
          className={`inline-flex items-center justify-center rounded-md border px-3 py-1.5 text-sm font-medium whitespace-nowrap shrink-0 transition-colors ${
            activeCategory === null
              ? 'bg-[#EC5E54] text-white border-transparent'
              : 'border-gray-300 text-gray-700 hover:bg-gray-100'
          }`}
        >
          Все
        </button>

        {categories.map((category) => (
          <button
            key={category.name}
            onClick={() => onCategoryClick(category.name)}
            className={`inline-flex items-center justify-center rounded-md border px-3 py-1.5 text-sm font-medium whitespace-nowrap shrink-0 transition-colors ${
              activeCategory === category.name
                ? 'bg-[#EC5E54] text-white border-transparent'
                : 'border-gray-300 text-gray-700 hover:bg-gray-100'
            }`}
          >
            {category.emoji} {category.name.replace(/#/g, '').replace(/_/g, ' ')}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilter;

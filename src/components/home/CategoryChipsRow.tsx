import React from 'react';
import { Category } from '../../types/category.types';

interface CategoryChipsRowProps {
  categories: Category[];
  selectedCategoryId: string;
  onSelectCategory: (id: string) => void;
}

export const CategoryChipsRow: React.FC<CategoryChipsRowProps> = ({
  categories,
  selectedCategoryId,
  onSelectCategory,
}) => {
  return (
    <div className="overflow-x-auto no-scrollbar py-2 px-4 flex items-center gap-2">
      <button
        onClick={() => onSelectCategory('all')}
        className={`px-3.5 py-1.5 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer select-none active:scale-95 ${
          selectedCategoryId === 'all'
            ? 'bg-gradient-to-r from-[#FF4D8D] to-[#EC4899] text-white shadow-md shadow-[#FF4D8D]/20'
            : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10'
        }`}
      >
        Todos
      </button>

      {categories.map((cat) => {
        const isSelected = selectedCategoryId === cat.id;

        return (
          <button
            key={cat.id}
            onClick={() => onSelectCategory(cat.id)}
            className={`px-3.5 py-1.5 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer select-none active:scale-95 flex items-center gap-1.5 ${
              isSelected
                ? 'bg-gradient-to-r from-[#FF4D8D] to-[#EC4899] text-white shadow-md shadow-[#FF4D8D]/20'
                : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10'
            }`}
          >
            <span>{cat.name}</span>
            <span className={`text-[10px] ${isSelected ? 'text-white/80' : 'text-slate-500'}`}>
              {cat.itemCount}
            </span>
          </button>
        );
      })}
    </div>
  );
};

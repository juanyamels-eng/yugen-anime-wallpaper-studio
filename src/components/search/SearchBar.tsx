import React from 'react';
import { Search, X, SlidersHorizontal } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
  onOpenFilters?: () => void;
  activeFilterCount?: number;
  placeholder?: string;
  autoFocus?: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  onClear,
  onOpenFilters,
  activeFilterCount = 0,
  placeholder = 'Buscar por personaje, estilo, tags...',
  autoFocus = false,
}) => {
  return (
    <div className="flex items-center gap-2 px-4 py-2">
      <div className="relative flex-1 flex items-center bg-[#121622] rounded-2xl border border-white/10 px-3.5 h-11 focus-within:border-[#FF4D8D]/60 focus-within:ring-2 focus-within:ring-[#FF4D8D]/20 transition-all shadow-inner">
        <Search className="w-4 h-4 text-slate-400 shrink-0 mr-2.5" />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoFocus={autoFocus}
          className="w-full bg-transparent text-sm text-white placeholder:text-slate-500 focus:outline-none"
        />
        {value && (
          <button
            onClick={onClear}
            className="p-1 rounded-full text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {onOpenFilters && (
        <button
          onClick={onOpenFilters}
          className={`h-11 px-3.5 rounded-2xl border flex items-center justify-center gap-1.5 transition-all cursor-pointer select-none active:scale-95 ${
            activeFilterCount > 0
              ? 'bg-[#FF4D8D] border-[#FF4D8D] text-white shadow-md shadow-[#FF4D8D]/20'
              : 'bg-[#121622] border-white/10 text-slate-300 hover:bg-white/10'
          }`}
          aria-label="Abrir filtros"
        >
          <SlidersHorizontal className="w-4 h-4" />
          {activeFilterCount > 0 && (
            <span className="text-[11px] font-bold bg-white text-black px-1.5 py-0.2 rounded-full">
              {activeFilterCount}
            </span>
          )}
        </button>
      )}
    </div>
  );
};

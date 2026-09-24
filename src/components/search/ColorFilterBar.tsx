import React from 'react';
import { Check } from 'lucide-react';

export interface ColorOption {
  id: string;
  name: string;
  hex: string;
  border?: boolean;
}

export const COLOR_PALETTE_OPTIONS: ColorOption[] = [
  { id: 'all', name: 'Todos', hex: 'transparent' },
  { id: '#090b10', name: 'Black', hex: '#090B10', border: true },
  { id: '#ffffff', name: 'White', hex: '#FFFFFF' },
  { id: '#dc2626', name: 'Red', hex: '#EF4444' },
  { id: '#3b82f6', name: 'Blue', hex: '#3B82F6' },
  { id: '#8b5cf6', name: 'Purple', hex: '#8B5CF6' },
  { id: '#ff4d8d', name: 'Pink', hex: '#FF4D8D' },
  { id: '#10b981', name: 'Green', hex: '#10B981' },
  { id: '#f59e0b', name: 'Orange', hex: '#F59E0B' },
  { id: '#00f2fe', name: 'Cyan', hex: '#00F2FE' },
  { id: '#eab308', name: 'Yellow', hex: '#EAB308' },
];

interface ColorFilterBarProps {
  selectedColor: string;
  onSelectColor: (colorHex: string) => void;
}

export const ColorFilterBar: React.FC<ColorFilterBarProps> = ({
  selectedColor,
  onSelectColor,
}) => {
  return (
    <div className="overflow-x-auto no-scrollbar py-2 px-4 flex items-center gap-2.5">
      {COLOR_PALETTE_OPTIONS.map((c) => {
        const isSelected = selectedColor === c.id;

        if (c.id === 'all') {
          return (
            <button
              key={c.id}
              onClick={() => onSelectColor('all')}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer border ${
                isSelected
                  ? 'bg-white text-black border-white shadow-sm'
                  : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
              }`}
            >
              Todos los colores
            </button>
          );
        }

        return (
          <button
            key={c.id}
            onClick={() => onSelectColor(c.id)}
            style={{ backgroundColor: c.hex }}
            title={c.name}
            className={`w-7 h-7 rounded-full transition-all cursor-pointer select-none flex items-center justify-center relative active:scale-90 ${
              c.border ? 'border border-white/30' : ''
            } ${
              isSelected
                ? 'ring-2 ring-white ring-offset-2 ring-offset-[#090B10] scale-110'
                : 'hover:scale-105 opacity-85 hover:opacity-100'
            }`}
          >
            {isSelected && (
              <Check className={`w-3.5 h-3.5 ${c.id === '#ffffff' ? 'text-black' : 'text-white'}`} />
            )}
          </button>
        );
      })}
    </div>
  );
};

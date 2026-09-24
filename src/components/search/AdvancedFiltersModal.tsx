import React from 'react';
import { Sparkles, SlidersHorizontal, Check } from 'lucide-react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { WallpaperResolutionCategory } from '../../types/wallpaper.types';

interface AdvancedFiltersModalProps {
  isOpen: boolean;
  onClose: () => void;
  resolution: WallpaperResolutionCategory | 'all';
  setResolution: (res: WallpaperResolutionCategory | 'all') => void;
  orientation: 'all' | 'portrait' | 'landscape';
  setOrientation: (ori: 'all' | 'portrait' | 'landscape') => void;
  sortBy: 'trending' | 'newest' | 'downloads' | 'rating';
  setSortBy: (sort: 'trending' | 'newest' | 'downloads' | 'rating') => void;
  amoledOnly: boolean;
  setAmoledOnly: (val: boolean) => void;
  premiumOnly: boolean;
  setPremiumOnly: (val: boolean) => void;
  onReset: () => void;
  onApply: () => void;
}

export const AdvancedFiltersModal: React.FC<AdvancedFiltersModalProps> = ({
  isOpen,
  onClose,
  resolution,
  setResolution,
  orientation,
  setOrientation,
  sortBy,
  setSortBy,
  amoledOnly,
  setAmoledOnly,
  premiumOnly,
  setPremiumOnly,
  onReset,
  onApply,
}) => {
  const resolutions: Array<WallpaperResolutionCategory | 'all'> = [
    'all',
    '4K',
    '2K',
    '1440p',
    '1080p',
    'AMOLED',
  ];

  const sortOptions = [
    { id: 'trending', label: 'Tendencias' },
    { id: 'newest', label: 'Más recientes' },
    { id: 'downloads', label: 'Más descargados' },
    { id: 'rating', label: 'Mejor valorados' },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Filtros de Búsqueda" maxWidth="md">
      <div className="space-y-5 text-sm text-slate-200">
        {/* Resolution Options */}
        <div>
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
            Resolución
          </label>
          <div className="flex flex-wrap gap-2">
            {resolutions.map((res) => (
              <button
                key={res}
                type="button"
                onClick={() => setResolution(res)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                  resolution === res
                    ? 'bg-[#FF4D8D] border-[#FF4D8D] text-white shadow-sm'
                    : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                }`}
              >
                {res === 'all' ? 'Todas' : res}
              </button>
            ))}
          </div>
        </div>

        {/* Sort by */}
        <div>
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
            Ordenar por
          </label>
          <div className="grid grid-cols-2 gap-2">
            {sortOptions.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setSortBy(opt.id as any)}
                className={`p-2.5 rounded-xl text-xs font-semibold border text-left flex items-center justify-between transition-all cursor-pointer ${
                  sortBy === opt.id
                    ? 'bg-[#00F2FE]/15 border-[#00F2FE] text-white'
                    : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                }`}
              >
                <span>{opt.label}</span>
                {sortBy === opt.id && <Check className="w-3.5 h-3.5 text-[#00F2FE]" />}
              </button>
            ))}
          </div>
        </div>

        {/* Quick Toggles (AMOLED, Premium) */}
        <div className="space-y-2.5 pt-2 border-t border-white/10">
          <label className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/5 cursor-pointer">
            <div>
              <span className="font-semibold text-white block text-xs">Modo AMOLED Negro Puro</span>
              <span className="text-[11px] text-slate-400">Fondos de pantalla con más del 80% de negros absolutos</span>
            </div>
            <input
              type="checkbox"
              checked={amoledOnly}
              onChange={(e) => setAmoledOnly(e.target.checked)}
              className="w-4 h-4 accent-[#00F2FE] rounded cursor-pointer"
            />
          </label>

          <label className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/5 cursor-pointer">
            <div>
              <span className="font-semibold text-white block text-xs flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Fondos Premium Exclusivos
              </span>
              <span className="text-[11px] text-slate-400">Mostrar únicamente la colección Pro de Yūgen</span>
            </div>
            <input
              type="checkbox"
              checked={premiumOnly}
              onChange={(e) => setPremiumOnly(e.target.checked)}
              className="w-4 h-4 accent-[#FF4D8D] rounded cursor-pointer"
            />
          </label>
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-between gap-3 pt-3 border-t border-white/10">
          <Button variant="ghost" size="md" onClick={onReset}>
            Restablecer
          </Button>
          <Button variant="primary" size="md" onClick={onApply} className="flex-1">
            Aplicar Filtros
          </Button>
        </div>
      </div>
    </Modal>
  );
};

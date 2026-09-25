import React from 'react';
import { Sparkles, Eye, Download, Smartphone } from 'lucide-react';
import { Wallpaper } from '../../types/wallpaper.types';
import { Button } from '../common/Button';

interface FeaturedHeroBannerProps {
  wallpaper: Wallpaper;
  onSelect: (wallpaper: Wallpaper) => void;
  onApply: (wallpaper: Wallpaper) => void;
}

export const FeaturedHeroBanner: React.FC<FeaturedHeroBannerProps> = ({
  wallpaper,
  onSelect,
  onApply,
}) => {
  return (
    <div className="px-4 pt-2 pb-2">
      <div
        onClick={() => onSelect(wallpaper)}
        className="relative rounded-3xl overflow-hidden aspect-[4/5] max-h-[420px] sm:aspect-[21/9] sm:max-h-none w-full bg-[#141926] border border-white/10 shadow-2xl cursor-pointer group"
      >
        {/* Background Image */}
        <img
          src={wallpaper.urls.fhd || wallpaper.urls.preview}
          alt={wallpaper.title}
          loading="eager"
          decoding="async"
          className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-black/20" />

        {/* Top Editorial Kicker (Zero-Pill discipline) */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
          <div className="flex items-center gap-2 text-[11px] font-semibold text-white/90 drop-shadow">
            <span className="text-[#FF4D8D] font-bold tracking-wider uppercase">Destacado</span>
            <span className="text-white/40">·</span>
            <span className="text-slate-300 font-medium">{wallpaper.resolution.label}</span>
          </div>
          {wallpaper.isAmoled && (
            <span className="text-[10px] font-bold text-[#00F2FE] tracking-widest uppercase bg-black/50 backdrop-blur-md px-2 py-0.5 rounded border border-[#00F2FE]/30">
              AMOLED
            </span>
          )}
        </div>

        {/* Bottom Content & Quick Actions */}
        <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3">
          <div className="max-w-[70%]">
            <span className="text-[11px] font-bold text-[#00F2FE] tracking-wider uppercase block">
              {wallpaper.categoryName}
            </span>
            <h3 className="text-lg sm:text-2xl font-black text-white tracking-tight line-clamp-1 drop-shadow-lg mt-0.5">
              {wallpaper.title}
            </h3>
            {wallpaper.titleJp && (
              <p className="text-xs text-slate-300 font-light line-clamp-1 mt-0.5 drop-shadow">{wallpaper.titleJp}</p>
            )}
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onApply(wallpaper);
            }}
            className="min-h-[44px] px-4 py-2.5 rounded-2xl bg-gradient-to-r from-[#FF4D8D] to-[#EC4899] hover:from-[#FF4D8D]/90 hover:to-[#EC4899]/90 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-[#FF4D8D]/30 active:scale-95 transition-all cursor-pointer shrink-0"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Ver fondo</span>
          </button>
        </div>
      </div>
    </div>
  );
};

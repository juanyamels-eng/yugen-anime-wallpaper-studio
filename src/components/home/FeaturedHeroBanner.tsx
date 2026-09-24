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
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent flex flex-col justify-between p-4 sm:p-6" />

        {/* Top Floating Badge */}
        <div className="absolute top-3.5 left-3.5 flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-xl bg-black/60 backdrop-blur-md border border-white/15 text-[11px] font-bold text-[#FF4D8D] flex items-center gap-1">
            <Sparkles className="w-3 h-3" /> FONDOS DESTACADOS
          </span>
          <span className="px-2 py-0.5 rounded-lg bg-black/40 backdrop-blur-md border border-white/10 text-[10px] font-mono text-white">
            {wallpaper.resolution.label}
          </span>
        </div>

        {/* Bottom Content & Quick Actions */}
        <div className="absolute bottom-3.5 left-3.5 right-3.5 flex items-end justify-between gap-3">
          <div className="max-w-[70%]">
            <span className="text-[11px] font-medium text-[#00F2FE] tracking-wide uppercase">
              {wallpaper.categoryName}
            </span>
            <h3 className="text-base sm:text-xl font-extrabold text-white tracking-tight line-clamp-1 drop-shadow-md">
              {wallpaper.title}
            </h3>
            {wallpaper.titleJp && (
              <p className="text-[11px] text-slate-300 font-sans line-clamp-1">{wallpaper.titleJp}</p>
            )}
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onApply(wallpaper);
            }}
            className="min-h-[44px] px-4 py-2 rounded-xl bg-[#FF4D8D] hover:bg-[#FF4D8D]/90 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-[#FF4D8D]/30 active:scale-95 transition-all cursor-pointer shrink-0"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Ver fondo</span>
          </button>
        </div>
      </div>
    </div>
  );
};

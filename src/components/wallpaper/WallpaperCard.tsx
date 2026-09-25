import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Sparkles, Download, Share2, Eye } from 'lucide-react';
import { Wallpaper } from '../../types/wallpaper.types';

interface WallpaperCardProps {
  wallpaper: Wallpaper;
  isFavorite: boolean;
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
  onClick: (wallpaper: Wallpaper) => void;
  onQuickDownload?: (wallpaper: Wallpaper, e: React.MouseEvent) => void;
  onQuickShare?: (wallpaper: Wallpaper, e: React.MouseEvent) => void;
  index?: number;
}

export const WallpaperCard: React.FC<WallpaperCardProps> = ({
  wallpaper,
  isFavorite,
  onToggleFavorite,
  onClick,
  onQuickDownload,
  onQuickShare,
  index = 0,
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [longPressTimer, setLongPressTimer] = useState<any>(null);
  const [showQuickMenu, setShowQuickMenu] = useState(false);

  // Handle mobile long press (cancelado al hacer scroll para no bloquear el feed)
  const handleTouchStart = () => {
    const timer = setTimeout(() => {
      setShowQuickMenu(true);
      if (window.navigator?.vibrate) {
        window.navigator.vibrate(40);
      }
    }, 600);
    setLongPressTimer(timer);
  };

  const handleTouchEnd = () => {
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
    }
  };

  const handleTouchMove = () => {
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
    }
  };

  // Staggered slide-up and fade-in parameters
  const delay = Math.min(index * 0.045, 0.4);

  return (
    <motion.div
      initial={{ opacity: 0, y: 26 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.42,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileTap={{ scale: 0.98 }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchMove={handleTouchMove}
      onClick={() => {
        if (!showQuickMenu) onClick(wallpaper);
      }}
      className="group relative rounded-2xl overflow-hidden aspect-[9/16] bg-[#121622] border border-white/5 cursor-pointer select-none transition-colors duration-300 hover:border-white/20 hover:shadow-xl hover:shadow-[#FF4D8D]/10 cv-auto"
    >
      {/* Background image with lazy loading */}
      <img
        src={wallpaper.urls.thumbnail}
        alt={wallpaper.title}
        loading="lazy"
        decoding="async"
        draggable={false}
        onLoad={() => setImageLoaded(true)}
        className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-105 ${
          imageLoaded ? 'opacity-100' : 'opacity-0 scale-95'
        }`}
      />

      {/* Shimmer loading placeholder while loading */}
      {!imageLoaded && (
        <div className="absolute inset-0 bg-gradient-to-b from-[#161B28] to-[#0D1017] animate-pulse" />
      )}

      {/* Subtle top metadata */}
      <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none z-10">
        <div className="flex items-center gap-1.5 text-[10px] font-semibold">
          {wallpaper.isAmoled && (
            <span className="px-1.5 py-0.5 rounded bg-black/70 text-[#00F2FE] border border-[#00F2FE]/25 backdrop-blur-sm">
              AMOLED
            </span>
          )}
          {wallpaper.isPremium && (
            <span className="px-1.5 py-0.5 rounded bg-amber-500/90 text-black font-bold flex items-center gap-0.5 shadow-sm">
              <Sparkles className="w-2.5 h-2.5" /> PRO
            </span>
          )}
        </div>

        {/* Favorite Heart Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(wallpaper.id, e);
          }}
          className={`pointer-events-auto w-11 h-11 min-w-[44px] min-h-[44px] rounded-full flex items-center justify-center backdrop-blur-md transition-all duration-200 active:scale-75 ${
            isFavorite
              ? 'bg-[#FF4D8D] text-white shadow-lg shadow-[#FF4D8D]/40'
              : 'bg-black/40 text-white/80 hover:bg-black/70 hover:text-white border border-white/10'
          }`}
          aria-label={isFavorite ? 'Quitar de favoritos' : 'Añadir a favoritos'}
        >
          <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* Bottom Gradient and Title Overlay */}
      <div className="absolute inset-x-0 bottom-0 pt-10 pb-2.5 px-3 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end pointer-events-none transition-opacity duration-300">
        <h4 className="text-xs font-semibold text-white tracking-tight line-clamp-1 group-hover:text-[#00F2FE] transition-colors">
          {wallpaper.title}
        </h4>
        <div className="flex items-center justify-between mt-0.5 text-[11px] text-slate-300">
          <span className="truncate max-w-[110px]">{wallpaper.categoryName}</span>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-0.5 text-[10px]">
              <Eye className="w-3 h-3 text-slate-300" />
              {(wallpaper.stats.views / 1000).toFixed(0)}k
            </span>
          </div>
        </div>
      </div>

      {/* Long-press quick actions menu modal */}
      <AnimatePresence>
        {showQuickMenu && (
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.92 }}
            transition={{ duration: 0.16 }}
            onClick={(e) => {
              e.stopPropagation();
              setShowQuickMenu(false);
            }}
            className="absolute inset-0 bg-black/85 backdrop-blur-md z-30 flex flex-col items-center justify-center gap-3 p-4"
          >
            <span className="text-xs font-semibold text-white mb-1 line-clamp-1">{wallpaper.title}</span>

            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowQuickMenu(false);
                onToggleFavorite(wallpaper.id, e);
              }}
              className="w-full py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-xs text-white font-medium flex items-center justify-center gap-2"
            >
              <Heart className={`w-3.5 h-3.5 ${isFavorite ? 'fill-[#FF4D8D] text-[#FF4D8D]' : ''}`} />
              {isFavorite ? 'Quitar favorito' : 'Guardar en Favoritos'}
            </button>

            {onQuickDownload && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowQuickMenu(false);
                  onQuickDownload(wallpaper, e);
                }}
                className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-[#FF4D8D] to-[#EC4899] text-xs text-white font-semibold flex items-center justify-center gap-2"
              >
                <Download className="w-3.5 h-3.5" /> Descargar 4K
              </button>
            )}

            {onQuickShare && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowQuickMenu(false);
                  onQuickShare(wallpaper, e);
                }}
                className="w-full py-2 px-3 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-slate-300 flex items-center justify-center gap-2"
              >
                <Share2 className="w-3.5 h-3.5" /> Compartir
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

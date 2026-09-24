import React from 'react';
import { Layers, Eye, Sparkles } from 'lucide-react';
import { WallpaperCollection } from '../../types/collection.types';

interface CollectionCardProps {
  collection: WallpaperCollection;
  onClick: (col: WallpaperCollection) => void;
}

export const CollectionCard: React.FC<CollectionCardProps> = ({ collection, onClick }) => {
  return (
    <div
      onClick={() => onClick(collection)}
      className="shrink-0 w-64 sm:w-72 rounded-3xl overflow-hidden aspect-[16/10] relative bg-[#121622] border border-white/10 shadow-xl cursor-pointer group select-none transition-all duration-300 hover:border-white/20 hover:scale-[1.02]"
    >
      <img
        src={collection.coverUrl}
        alt={collection.title}
        loading="lazy"
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      />

      {/* Dark gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-3.5 flex flex-col justify-between" />

      {/* Badge */}
      <div className="absolute top-3 left-3 flex items-center gap-1.5">
        {collection.badge && (
          <span className="px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-[10px] font-bold text-[#00F2FE]">
            {collection.badge}
          </span>
        )}
      </div>

      {/* Bottom Information */}
      <div className="absolute bottom-3 left-3 right-3 text-white">
        <div className="flex items-center gap-1 text-[10px] text-slate-300 mb-0.5">
          <Layers className="w-3 h-3 text-[#FF4D8D]" />
          <span>{collection.wallpaperIds.length} Wallpapers</span>
        </div>
        <h4 className="text-sm font-bold text-white tracking-tight line-clamp-1 group-hover:text-[#00F2FE] transition-colors">
          {collection.title}
        </h4>
        <p className="text-[11px] text-slate-300 line-clamp-1 mt-0.5">{collection.subtitle}</p>
      </div>
    </div>
  );
};

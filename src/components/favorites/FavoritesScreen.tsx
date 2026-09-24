import React, { useState, useEffect } from 'react';
import { Heart, Download, Trash2, ArrowUpDown, Sparkles, FolderDown } from 'lucide-react';
import { Wallpaper } from '../../types/wallpaper.types';
import { wallpaperRepository } from '../../repositories';
import { WallpaperGrid } from '../wallpaper/WallpaperGrid';
import { DownloadRecord } from '../../hooks/useDownloads';
import { Button } from '../common/Button';

interface FavoritesScreenProps {
  favorites: string[];
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
  onSelectWallpaper: (wallpaper: Wallpaper) => void;
  onExplore: () => void;
  downloadsHistory: DownloadRecord[];
  onClearDownloads: () => void;
  onQuickDownload?: (wallpaper: Wallpaper, e: React.MouseEvent) => void;
  onQuickShare?: (wallpaper: Wallpaper, e: React.MouseEvent) => void;
}

export const FavoritesScreen: React.FC<FavoritesScreenProps> = ({
  favorites,
  onToggleFavorite,
  onSelectWallpaper,
  onExplore,
  downloadsHistory,
  onClearDownloads,
  onQuickDownload,
  onQuickShare,
}) => {
  const [activeTab, setActiveTab] = useState<'favorites' | 'downloads'>('favorites');
  const [favoriteWallpapers, setFavoriteWallpapers] = useState<Wallpaper[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState<'newest' | 'rating'>('newest');

  // Load wallpaper entities for favorite IDs
  useEffect(() => {
    let cancelled = false;

    const loadFavorites = async () => {
      setIsLoading(true);
      const all = await wallpaperRepository.getAllWallpapers();
      const filtered = all.filter((w) => favorites.includes(w.id));

      if (sortOrder === 'rating') {
        filtered.sort((a, b) => b.stats.rating - a.stats.rating);
      }

      if (!cancelled) {
        setFavoriteWallpapers(filtered);
        setIsLoading(false);
      }
    };

    loadFavorites();
    return () => {
      cancelled = true;
    };
  }, [favorites, sortOrder]);

  return (
    <div className="pb-24 max-w-lg mx-auto min-h-screen">
      {/* Top Segmented Tabs: Favoritos / Descargas */}
      <div className="p-4">
        <div className="p-1 bg-[#121622] rounded-2xl border border-white/10 flex items-center shadow-inner">
          <button
            onClick={() => setActiveTab('favorites')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'favorites'
                ? 'bg-gradient-to-r from-[#FF4D8D] to-[#EC4899] text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${activeTab === 'favorites' ? 'fill-current' : ''}`} />
            <span>Mis Favoritos ({favorites.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('downloads')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'downloads'
                ? 'bg-[#00F2FE] text-black shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <FolderDown className="w-3.5 h-3.5" />
            <span>Descargas ({downloadsHistory.length})</span>
          </button>
        </div>
      </div>

      {/* FAVORITES VIEW */}
      {activeTab === 'favorites' && (
        <div>
          {favoriteWallpapers.length > 0 && (
            <div className="px-4 pb-3 flex items-center justify-between text-xs text-slate-400">
              <span>{favoriteWallpapers.length} fondos guardados</span>
              <button
                onClick={() => setSortOrder((prev) => (prev === 'newest' ? 'rating' : 'newest'))}
                className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer"
              >
                <ArrowUpDown className="w-3 h-3 text-[#FF4D8D]" />
                <span>{sortOrder === 'newest' ? 'Más recientes' : 'Mejor valorados'}</span>
              </button>
            </div>
          )}

          <WallpaperGrid
            wallpapers={favoriteWallpapers}
            isLoading={isLoading}
            favorites={favorites}
            onToggleFavorite={onToggleFavorite}
            onSelectWallpaper={onSelectWallpaper}
            onQuickDownload={onQuickDownload}
            onQuickShare={onQuickShare}
            emptyTitle="Tu colección todavía está vacía"
            emptySubtitle="Explora la galería y toca el corazón en tus fondos favoritos para guardarlos y tenerlos siempre a mano."
            onEmptyAction={onExplore}
          />
        </div>
      )}

      {/* DOWNLOADS HISTORY VIEW */}
      {activeTab === 'downloads' && (
        <div className="px-4">
          {downloadsHistory.length > 0 ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-1 text-xs text-slate-400">
                <span>Historial de archivos descargados</span>
                <button
                  onClick={onClearDownloads}
                  className="flex items-center gap-1 text-rose-400 hover:text-rose-300 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3 h-3" /> Limpiar historial
                </button>
              </div>

              {downloadsHistory.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 p-3 rounded-2xl bg-[#121622] border border-white/5 shadow-sm"
                >
                  {item.thumbnailUrl ? (
                    <img
                      src={item.thumbnailUrl}
                      alt={item.title}
                      className="w-12 h-16 rounded-xl object-cover border border-white/10 shrink-0"
                    />
                  ) : (
                    <div className="w-12 h-16 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-500 shrink-0">
                      <Download className="w-5 h-5" />
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-white truncate">{item.title}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] px-2 py-0.5 rounded-md bg-[#00F2FE]/15 text-[#00F2FE] font-mono font-bold">
                        {item.quality}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {new Date(item.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <span className="text-[10px] text-emerald-400 font-semibold px-2 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                    Completado
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 px-4">
              <div className="w-16 h-16 rounded-3xl bg-[#121622] border border-white/10 flex items-center justify-center text-[#00F2FE] mx-auto mb-4">
                <FolderDown className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-white mb-1">Sin descargas recientes</h3>
              <p className="text-xs text-slate-400 max-w-xs mx-auto mb-6">
                Cuando descargues wallpapers en calidad 4K o FHD, aparecerán aquí para que puedas acceder a ellos fácilmente.
              </p>
              <Button onClick={onExplore} size="md" variant="secondary">
                Explorar catálogo
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

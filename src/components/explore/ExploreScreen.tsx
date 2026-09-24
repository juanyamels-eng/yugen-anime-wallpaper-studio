import React, { useState, useEffect } from 'react';
import { ArrowLeft, Layers, Sparkles, Filter } from 'lucide-react';
import { Category } from '../../types/category.types';
import { WallpaperCollection } from '../../types/collection.types';
import { Wallpaper } from '../../types/wallpaper.types';
import { wallpaperRepository } from '../../repositories';
import { WallpaperGrid } from '../wallpaper/WallpaperGrid';
import { CollectionCard } from '../home/CollectionCard';

interface ExploreScreenProps {
  onSelectWallpaper: (wallpaper: Wallpaper) => void;
  favorites: string[];
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
  onQuickDownload?: (wallpaper: Wallpaper, e: React.MouseEvent) => void;
  onQuickShare?: (wallpaper: Wallpaper, e: React.MouseEvent) => void;
}

export const ExploreScreen: React.FC<ExploreScreenProps> = ({
  onSelectWallpaper,
  favorites,
  onToggleFavorite,
  onQuickDownload,
  onQuickShare,
}) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [collections, setCollections] = useState<WallpaperCollection[]>([]);
  const [activeCategory, setActiveCategory] = useState<Category | null>(null);
  const [activeCollection, setActiveCollection] = useState<WallpaperCollection | null>(null);
  const [categoryWallpapers, setCategoryWallpapers] = useState<Wallpaper[]>([]);
  const [isLoadingWallpapers, setIsLoadingWallpapers] = useState(false);

  useEffect(() => {
    const load = async () => {
      const cats = await wallpaperRepository.getAllCategories();
      const cols = await wallpaperRepository.getAllCollections();
      setCategories(cats);
      setCollections(cols);
    };
    load();
  }, []);

  // When a category is clicked, load its wallpapers
  const handleSelectCategory = async (cat: Category) => {
    setActiveCategory(cat);
    setActiveCollection(null);
    setIsLoadingWallpapers(true);
    const walls = await wallpaperRepository.getWallpapersByCategory(cat.id, 200);
    setCategoryWallpapers(walls);
    setIsLoadingWallpapers(false);
  };

  // When a collection is clicked, load its wallpapers
  const handleSelectCollection = async (col: WallpaperCollection) => {
    setActiveCollection(col);
    setActiveCategory(null);
    setIsLoadingWallpapers(true);
    const all = await wallpaperRepository.getAllWallpapers();
    const filtered = all.filter((w) => col.wallpaperIds.includes(w.id));
    setCategoryWallpapers(filtered);
    setIsLoadingWallpapers(false);
  };

  const handleBackToExplore = () => {
    setActiveCategory(null);
    setActiveCollection(null);
    setCategoryWallpapers([]);
  };

  return (
    <div className="pb-24 max-w-lg mx-auto min-h-screen">
      {/* If viewing a category or collection detail */}
      {(activeCategory || activeCollection) ? (
        <div>
          {/* Header */}
          <div className="sticky top-[68px] z-20 bg-[#090B10]/95 backdrop-blur-xl border-b border-white/5 p-4 flex items-center justify-between">
            <button
              onClick={handleBackToExplore}
              className="min-h-[44px] flex items-center gap-1.5 text-xs font-semibold text-white hover:text-[#00F2FE] cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" /> Volver a Explorar
            </button>
            <span className="text-xs text-slate-400">
              {categoryWallpapers.length} fondos
            </span>
          </div>

          {/* Banner */}
          <div className="p-4">
            <div className="p-5 rounded-3xl bg-[#121622] border border-white/10 relative overflow-hidden shadow-xl">
              <div className="relative z-10">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#FF4D8D]">
                  {activeCategory ? 'Categoría' : 'Colección Curada'}
                </span>
                <h2 className="text-xl font-extrabold text-white mt-1">
                  {activeCategory ? activeCategory.name : activeCollection?.title}
                </h2>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  {activeCategory ? activeCategory.description : activeCollection?.description}
                </p>
              </div>
            </div>
          </div>

          {/* Wallpapers Grid */}
          <WallpaperGrid
            wallpapers={categoryWallpapers}
            isLoading={isLoadingWallpapers}
            favorites={favorites}
            onToggleFavorite={onToggleFavorite}
            onSelectWallpaper={onSelectWallpaper}
            onQuickDownload={onQuickDownload}
            onQuickShare={onQuickShare}
          />
        </div>
      ) : (
        /* Standard Explore View */
        <div className="space-y-6 pt-2">
          {/* Featured Collections Carousel */}
          <div>
            <div className="px-4 pb-2.5 flex items-center justify-between">
              <h2 className="text-sm sm:text-base font-bold text-white flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-[#00F2FE]" /> Colecciones Temáticas
              </h2>
            </div>
            <div className="overflow-x-auto no-scrollbar px-4 flex items-center gap-3">
              {collections.map((col) => (
                <CollectionCard key={col.id} collection={col} onClick={handleSelectCollection} />
              ))}
            </div>
          </div>

          {/* All Categories Grid */}
          <div className="px-4">
            <div className="pb-3">
              <h2 className="text-sm sm:text-base font-bold text-white flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#FF4D8D]" /> Todas las Categorías ({categories.length})
              </h2>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Explora los universos y estilos anime creados para ti
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {categories.map((cat) => (
                <div
                  key={cat.id}
                  onClick={() => handleSelectCategory(cat)}
                  className="group relative rounded-2xl overflow-hidden aspect-[16/10] bg-[#121622] border border-white/5 cursor-pointer select-none transition-all duration-300 hover:border-white/20 hover:scale-[1.02] shadow-md"
                >
                  <img
                    src={cat.coverUrl}
                    alt={cat.name}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-108"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent p-3 flex flex-col justify-end">
                    <h4 className="text-xs sm:text-sm font-bold text-white line-clamp-1 group-hover:text-[#00F2FE] transition-colors">
                      {cat.name}
                    </h4>
                    <span className="text-[10px] text-slate-300 mt-0.5">
                      {cat.itemCount} wallpapers
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

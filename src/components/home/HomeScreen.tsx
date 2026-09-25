import React, { useState, useEffect } from 'react';
import { Flame, Sparkles, Layers, Moon, Star } from 'lucide-react';
import { Wallpaper } from '../../types/wallpaper.types';
import { Category } from '../../types/category.types';
import { WallpaperCollection } from '../../types/collection.types';
import { wallpaperRepository } from '../../repositories';
import { FeaturedHeroBanner } from './FeaturedHeroBanner';
import { CategoryChipsRow } from './CategoryChipsRow';
import { SectionHeader } from './SectionHeader';
import { CollectionCard } from './CollectionCard';
import { WallpaperCard } from '../wallpaper/WallpaperCard';
import { SkeletonGrid } from '../common/LoadingSkeleton';
import { NativeBannerAd } from '../ads/NativeBannerAd';
import { AdFreePassCard } from '../ads/AdFreePassCard';
import { NavTab } from '../navigation/BottomNavigation';

interface HomeScreenProps {
  onSelectWallpaper: (wallpaper: Wallpaper) => void;
  onApplyWallpaper: (wallpaper: Wallpaper) => void;
  favorites: string[];
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
  onNavigateTab: (tab: NavTab) => void;
  onQuickDownload?: (wallpaper: Wallpaper, e: React.MouseEvent) => void;
  onQuickShare?: (wallpaper: Wallpaper, e: React.MouseEvent) => void;
  onRequestAdFreePass?: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onSelectWallpaper,
  onApplyWallpaper,
  favorites,
  onToggleFavorite,
  onNavigateTab,
  onQuickDownload,
  onQuickShare,
  onRequestAdFreePass,
}) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [collections, setCollections] = useState<WallpaperCollection[]>([]);
  const [featuredWallpaper, setFeaturedWallpaper] = useState<Wallpaper | null>(null);
  const [trendingWallpapers, setTrendingWallpapers] = useState<Wallpaper[]>([]);
  const [newWallpapers, setNewWallpapers] = useState<Wallpaper[]>([]);
  const [recommendedWallpapers, setRecommendedWallpapers] = useState<Wallpaper[]>([]);
  const [nightWallpapers, setNightWallpapers] = useState<Wallpaper[]>([]);
  const [topRatedWallpapers, setTopRatedWallpapers] = useState<Wallpaper[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [filteredWallpapers, setFilteredWallpapers] = useState<Wallpaper[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const loadHomeData = async () => {
      setIsLoading(true);
      const [cats, cols, all, trending, newOnes, night, topRated] = await Promise.all([
        wallpaperRepository.getAllCategories(),
        wallpaperRepository.getAllCollections(),
        wallpaperRepository.getAllWallpapers(),
        wallpaperRepository.getTrendingWallpapers(10),
        wallpaperRepository.getNewWallpapers(10),
        wallpaperRepository.getNightSelection(8),
        wallpaperRepository.getTopRated(8),
      ]);

      if (!cancelled) {
        setCategories(cats);
        setCollections(cols);
        setTrendingWallpapers(trending);
        setNewWallpapers(newOnes);
        setNightWallpapers(night);
        setTopRatedWallpapers(topRated);

        // Featured wallpaper (select first featured or trending)
        const feat = all.find((w) => w.isFeatured) || trending[0] || all[0];
        setFeaturedWallpaper(feat);

        setIsLoading(false);
      }
    };

    loadHomeData();

    return () => {
      cancelled = true;
    };
  }, []);

  // Carga recomendados por separado para no recargar todo el home al dar favorito
  useEffect(() => {
    let cancelled = false;
    wallpaperRepository.getRecommendedWallpapers(favorites, 8).then((rec) => {
      if (!cancelled) setRecommendedWallpapers(rec);
    });
    return () => {
      cancelled = true;
    };
  }, [favorites]);

  // Handle category filtering
  useEffect(() => {
    if (selectedCategory === 'all') {
      setFilteredWallpapers([]);
      return;
    }

    const filterByCategory = async () => {
      const results = await wallpaperRepository.getWallpapersByCategory(selectedCategory, 60);
      setFilteredWallpapers(results);
    };

    filterByCategory();
  }, [selectedCategory]);

  if (isLoading) {
    return (
      <div className="pb-24 max-w-lg mx-auto pt-2 space-y-4">
        <div className="mx-4 h-44 rounded-3xl bg-[#121622] animate-pulse" />
        <SkeletonGrid count={6} />
      </div>
    );
  }

  return (
    <div className="pb-24 max-w-lg mx-auto">
      {/* Native Mobile Screen Header */}
      <div className="px-4 pt-3 pb-2 flex items-baseline justify-between">
        <div>
          <h1 className="text-xl font-black text-white tracking-tight flex items-baseline gap-1.5">
            <span>Yūgen</span>
            <span className="text-xs font-normal text-[#FF4D8D]">幽玄</span>
            <span className="text-[10px] font-mono text-slate-500">· 4K</span>
          </h1>
          <p className="text-[11px] text-slate-400 font-medium">Fondos de pantalla anime en ultra resolución</p>
        </div>
        <span className="text-[11px] font-bold text-[#00F2FE]">
          Ultra HD
        </span>
      </div>

      {/* Featured Cinematic Banner */}
      {featuredWallpaper && (
        <FeaturedHeroBanner
          wallpaper={featuredWallpaper}
          onSelect={onSelectWallpaper}
          onApply={onApplyWallpaper}
        />
      )}

      {/* Category Chips Carousel */}
      <CategoryChipsRow
        categories={categories}
        selectedCategoryId={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      {/* IF A CATEGORY IS FILTERED, SHOW CATEGORY WALLPAPERS */}
      {selectedCategory !== 'all' ? (
        <div className="pt-2">
          <div className="px-4 pb-2 flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">
              {categories.find((c) => c.id === selectedCategory)?.name || 'Categoría'}
            </h3>
            <button
              onClick={() => setSelectedCategory('all')}
              className="text-xs text-[#00F2FE] hover:underline cursor-pointer"
            >
              Ver todas
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 px-4">
            {filteredWallpapers.map((wp, idx) => (
              <WallpaperCard
                key={wp.id}
                wallpaper={wp}
                index={idx}
                isFavorite={favorites.includes(wp.id)}
                onToggleFavorite={onToggleFavorite}
                onClick={onSelectWallpaper}
                onQuickDownload={onQuickDownload}
                onQuickShare={onQuickShare}
              />
            ))}
          </div>
        </div>
      ) : (
        /* STANDARD HOME SECTIONS */
        <>
          {/* TENDENCIAS */}
          <section>
            <SectionHeader
              icon={Flame}
              title="Tendencias Globales"
              subtitle="Los más visualizados esta semana"
              onViewAll={() => onNavigateTab('explore')}
            />
            <div className="overflow-x-auto no-scrollbar px-4 flex items-center gap-3">
              {trendingWallpapers.map((wp, idx) => (
                <div key={wp.id} className="shrink-0 w-36 sm:w-44">
                  <WallpaperCard
                    wallpaper={wp}
                    index={idx}
                    isFavorite={favorites.includes(wp.id)}
                    onToggleFavorite={onToggleFavorite}
                    onClick={onSelectWallpaper}
                    onQuickDownload={onQuickDownload}
                    onQuickShare={onQuickShare}
                  />
                </div>
              ))}
            </div>
          </section>

          {/* RECOMENDADOS PARA TI */}
          {recommendedWallpapers.length > 0 && (
            <section>
              <SectionHeader
                icon={Sparkles}
                title="Selección Para Ti"
                subtitle="Inspirados en tu estilo y gustos"
                onViewAll={() => onNavigateTab('explore')}
              />
              <div className="grid grid-cols-2 gap-3 px-4">
                {recommendedWallpapers.slice(0, 4).map((wp, idx) => (
                  <WallpaperCard
                    key={wp.id}
                    wallpaper={wp}
                    index={idx}
                    isFavorite={favorites.includes(wp.id)}
                    onToggleFavorite={onToggleFavorite}
                    onClick={onSelectWallpaper}
                    onQuickDownload={onQuickDownload}
                    onQuickShare={onQuickShare}
                  />
                ))}
              </div>
            </section>
          )}

          {/* COLECCIONES CURADAS */}
          <section>
            <SectionHeader
              icon={Layers}
              title="Colecciones Temáticas"
              subtitle="Sets artísticos con armonía cromática"
              onViewAll={() => onNavigateTab('explore')}
            />
            <div className="overflow-x-auto no-scrollbar px-4 flex items-center gap-3">
              {collections.map((col) => (
                <CollectionCard
                  key={col.id}
                  collection={col}
                  onClick={() => onNavigateTab('explore')}
                />
              ))}
            </div>
          </section>

          {/* SPONSOR BANNER AD & AD-FREE PASS */}
          <div className="px-4 space-y-2">
            <NativeBannerAd variant="feed" />
            {onRequestAdFreePass && (
              <AdFreePassCard onRequestWatchAd={onRequestAdFreePass} />
            )}
          </div>

          {/* NUEVOS WALLPAPERS */}
          <section>
            <SectionHeader
              icon={Sparkles}
              title="Recién Añadidos"
              subtitle="Novedades en resolución 4K y AMOLED"
              onViewAll={() => onNavigateTab('explore')}
            />
            <div className="grid grid-cols-2 gap-3 px-4">
              {newWallpapers.slice(0, 4).map((wp, idx) => (
                <WallpaperCard
                  key={wp.id}
                  wallpaper={wp}
                  index={idx}
                  isFavorite={favorites.includes(wp.id)}
                  onToggleFavorite={onToggleFavorite}
                  onClick={onSelectWallpaper}
                  onQuickDownload={onQuickDownload}
                  onQuickShare={onQuickShare}
                />
              ))}
            </div>
          </section>

          {/* SELECCIÓN NOCTURNA & AMOLED */}
          <section>
            <SectionHeader
              icon={Moon}
              title="Selección Nocturna & AMOLED"
              subtitle="Ahorra batería con fondos negros puros"
              onViewAll={() => onNavigateTab('explore')}
            />
            <div className="overflow-x-auto no-scrollbar px-4 flex items-center gap-3">
              {nightWallpapers.map((wp, idx) => (
                <div key={wp.id} className="shrink-0 w-36 sm:w-44">
                  <WallpaperCard
                    wallpaper={wp}
                    index={idx}
                    isFavorite={favorites.includes(wp.id)}
                    onToggleFavorite={onToggleFavorite}
                    onClick={onSelectWallpaper}
                    onQuickDownload={onQuickDownload}
                    onQuickShare={onQuickShare}
                  />
                </div>
              ))}
            </div>
          </section>

          {/* MEJOR VALORADOS */}
          <section>
            <SectionHeader
              icon={Star}
              title="Mejor Valorados"
              subtitle="Aclamados por la comunidad de Yūgen"
              onViewAll={() => onNavigateTab('explore')}
            />
            <div className="grid grid-cols-2 gap-3 px-4">
              {topRatedWallpapers.slice(0, 6).map((wp, idx) => (
                <WallpaperCard
                  key={wp.id}
                  wallpaper={wp}
                  index={idx}
                  isFavorite={favorites.includes(wp.id)}
                  onToggleFavorite={onToggleFavorite}
                  onClick={onSelectWallpaper}
                  onQuickDownload={onQuickDownload}
                  onQuickShare={onQuickShare}
                />
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
};

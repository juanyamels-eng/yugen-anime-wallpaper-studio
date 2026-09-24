import React, { useState, useEffect, useMemo } from 'react';
import { History, TrendingUp, X, Sparkles } from 'lucide-react';
import { Wallpaper, WallpaperFilterOptions, WallpaperResolutionCategory } from '../../types/wallpaper.types';
import { wallpaperRepository } from '../../repositories';
import { SearchBar } from './SearchBar';
import { ColorFilterBar } from './ColorFilterBar';
import { AdvancedFiltersModal } from './AdvancedFiltersModal';
import { WallpaperGrid } from '../wallpaper/WallpaperGrid';
import { analytics } from '../../services/analyticsService';

const RECENT_SEARCHES_KEY = 'yugen_recent_searches_v1';

const POPULAR_SUGGESTIONS = [
  'Cyberpunk girl',
  'Samurai sunset',
  'Tokyo rain',
  'Dark anime',
  'Sakura',
  'Purple aesthetic',
  'AMOLED 4K',
  'Mecha titan',
  'Retro 90s',
];

interface SearchScreenProps {
  onSelectWallpaper: (wallpaper: Wallpaper) => void;
  favorites: string[];
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
  onQuickDownload?: (wallpaper: Wallpaper, e: React.MouseEvent) => void;
  onQuickShare?: (wallpaper: Wallpaper, e: React.MouseEvent) => void;
}

export const SearchScreen: React.FC<SearchScreenProps> = ({
  onSelectWallpaper,
  favorites,
  onToggleFavorite,
  onQuickDownload,
  onQuickShare,
}) => {
  const [query, setQuery] = useState('');
  const [selectedColor, setSelectedColor] = useState('all');
  const [resolution, setResolution] = useState<WallpaperResolutionCategory | 'all'>('all');
  const [orientation, setOrientation] = useState<'all' | 'portrait' | 'landscape'>('all');
  const [sortBy, setSortBy] = useState<'trending' | 'newest' | 'downloads' | 'rating'>('trending');
  const [amoledOnly, setAmoledOnly] = useState(false);
  const [premiumOnly, setPremiumOnly] = useState(false);
  const [showFiltersModal, setShowFiltersModal] = useState(false);

  const [results, setResults] = useState<Wallpaper[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Recent searches state
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
      return stored ? JSON.parse(stored) : ['Cyberpunk', 'Samurai', 'Tokyo Night'];
    } catch {
      return ['Cyberpunk', 'Samurai', 'Tokyo Night'];
    }
  });

  const saveRecentSearch = (term: string) => {
    if (!term || term.trim() === '') return;
    const clean = term.trim();
    setRecentSearches((prev) => {
      const updated = [clean, ...prev.filter((item) => item.toLowerCase() !== clean.toLowerCase())].slice(0, 8);
      try {
        localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
    analytics.track('search', { query: clean });
  };

  const removeRecentSearch = (term: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setRecentSearches((prev) => {
      const updated = prev.filter((item) => item !== term);
      localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const clearAllRecent = () => {
    setRecentSearches([]);
    localStorage.removeItem(RECENT_SEARCHES_KEY);
  };

  // Perform search query
  useEffect(() => {
    let cancelled = false;

    const performSearch = async () => {
      setIsLoading(true);
      const options: WallpaperFilterOptions = {
        searchQuery: query,
        color: selectedColor,
        resolution,
        orientation,
        sortBy,
        amoledOnly,
        premiumOnly,
      };

      const found = await wallpaperRepository.searchWallpapers(options);
      if (!cancelled) {
        setResults(found);
        setIsLoading(false);
      }
    };

    const debounceTimer = setTimeout(performSearch, 150);
    return () => {
      cancelled = true;
      clearTimeout(debounceTimer);
    };
  }, [query, selectedColor, resolution, orientation, sortBy, amoledOnly, premiumOnly]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (selectedColor !== 'all') count++;
    if (resolution !== 'all') count++;
    if (orientation !== 'all') count++;
    if (sortBy !== 'trending') count++;
    if (amoledOnly) count++;
    if (premiumOnly) count++;
    return count;
  }, [selectedColor, resolution, orientation, sortBy, amoledOnly, premiumOnly]);

  const handleResetFilters = () => {
    setSelectedColor('all');
    setResolution('all');
    setOrientation('all');
    setSortBy('trending');
    setAmoledOnly(false);
    setPremiumOnly(false);
    setShowFiltersModal(false);
  };

  return (
    <div className="pb-24 max-w-lg mx-auto min-h-screen">
      {/* Top Search & Filter Trigger */}
      <SearchBar
        value={query}
        onChange={setQuery}
        onClear={() => setQuery('')}
        onOpenFilters={() => setShowFiltersModal(true)}
        activeFilterCount={activeFilterCount}
      />

      {/* Color Filter Carousel */}
      <ColorFilterBar selectedColor={selectedColor} onSelectColor={setSelectedColor} />

      {/* If no query is typed, show Recent Searches & Popular Suggestions */}
      {!query && selectedColor === 'all' && activeFilterCount === 0 && (
        <div className="px-4 py-3 space-y-5 animate-in fade-in duration-200">
          {/* Recent Searches */}
          {recentSearches.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <History className="w-3.5 h-3.5 text-[#00F2FE]" /> Búsquedas recientes
                </span>
                <button
                  onClick={clearAllRecent}
                  className="text-[11px] text-slate-400 hover:text-white cursor-pointer"
                >
                  Borrar todas
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {recentSearches.map((term, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setQuery(term);
                      saveRecentSearch(term);
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#121622] hover:bg-[#1A2030] text-xs text-slate-300 border border-white/5 transition-all cursor-pointer group"
                  >
                    <span>{term}</span>
                    <span
                      onClick={(e) => removeRecentSearch(term, e)}
                      className="text-slate-500 hover:text-white ml-0.5"
                    >
                      <X className="w-3 h-3" />
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Popular Suggestions */}
          <div>
            <span className="text-xs font-bold text-white flex items-center gap-1.5 mb-2.5">
              <TrendingUp className="w-3.5 h-3.5 text-[#FF4D8D]" /> Sugerencias populares
            </span>
            <div className="flex flex-wrap gap-2">
              {POPULAR_SUGGESTIONS.map((sug, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setQuery(sug);
                    saveRecentSearch(sug);
                  }}
                  className="px-3.5 py-1.5 rounded-2xl bg-white/5 hover:bg-white/10 text-xs font-medium text-slate-300 border border-white/10 transition-all cursor-pointer active:scale-95"
                >
                  {sug}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Results Header */}
      <div className="px-4 pt-3 pb-2 flex items-center justify-between text-xs text-slate-400">
        <span>
          {results.length} {results.length === 1 ? 'fondo encontrado' : 'fondos encontrados'}
        </span>
        {activeFilterCount > 0 && (
          <button
            onClick={handleResetFilters}
            className="text-[11px] text-[#00F2FE] hover:underline cursor-pointer"
          >
            Limpiar filtros ({activeFilterCount})
          </button>
        )}
      </div>

      {/* Results Grid */}
      <WallpaperGrid
        wallpapers={results}
        isLoading={isLoading}
        favorites={favorites}
        onToggleFavorite={onToggleFavorite}
        onSelectWallpaper={onSelectWallpaper}
        onQuickDownload={onQuickDownload}
        onQuickShare={onQuickShare}
        emptyTitle="No encontramos coincidencias"
        emptySubtitle="Intenta buscar con otros términos como 'Samurai', 'Cyberpunk', 'Sakura' o limpia los filtros."
        onEmptyAction={handleResetFilters}
      />

      {/* Advanced Filters Modal */}
      <AdvancedFiltersModal
        isOpen={showFiltersModal}
        onClose={() => setShowFiltersModal(false)}
        resolution={resolution}
        setResolution={setResolution}
        orientation={orientation}
        setOrientation={setOrientation}
        sortBy={sortBy}
        setSortBy={setSortBy}
        amoledOnly={amoledOnly}
        setAmoledOnly={setAmoledOnly}
        premiumOnly={premiumOnly}
        setPremiumOnly={setPremiumOnly}
        onReset={handleResetFilters}
        onApply={() => setShowFiltersModal(false)}
      />
    </div>
  );
};

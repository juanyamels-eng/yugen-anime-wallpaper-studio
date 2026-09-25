import { useState, useEffect, useCallback } from 'react';
import { wallpaperRepository } from '../repositories';
import { analytics } from '../services/analyticsService';

const FAVORITES_STORAGE_KEY = 'yugen_favorites_v2';

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(FAVORITES_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
      // Check legacy v1 key and filter out the old mock 3 items
      const oldStored = localStorage.getItem('yugen_favorites_v1');
      if (oldStored) {
        const parsed = JSON.parse(oldStored);
        const isOldDefault =
          Array.isArray(parsed) &&
          parsed.length === 3 &&
          parsed.includes('wp-cyber-01') &&
          parsed.includes('wp-samurai-01') &&
          parsed.includes('wp-sakura-01');
        if (!isOldDefault && Array.isArray(parsed)) {
          return parsed;
        }
      }
      return [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
    } catch {
      // ignore
    }
  }, [favorites]);

  const toggleFavorite = useCallback(async (wallpaperId: string) => {
    setFavorites((prev) => {
      const isFav = prev.includes(wallpaperId);
      const updated = isFav ? prev.filter((id) => id !== wallpaperId) : [...prev, wallpaperId];
      
      // Update repository stats in background
      wallpaperRepository.toggleFavorite(wallpaperId, !isFav);
      analytics.track('wallpaper_favorite', { wallpaperId, isFav: !isFav });

      return updated;
    });
  }, []);

  const isFavorite = useCallback(
    (wallpaperId: string) => favorites.includes(wallpaperId),
    [favorites]
  );

  return {
    favorites,
    toggleFavorite,
    isFavorite,
    count: favorites.length,
  };
}

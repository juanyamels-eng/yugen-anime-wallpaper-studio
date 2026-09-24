import { useState, useEffect, useCallback } from 'react';
import { wallpaperRepository } from '../repositories';
import { analytics } from '../services/analyticsService';

const FAVORITES_STORAGE_KEY = 'yugen_favorites_v1';

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(FAVORITES_STORAGE_KEY);
      return stored ? JSON.parse(stored) : ['wp-cyber-01', 'wp-samurai-01', 'wp-sakura-01'];
    } catch {
      return ['wp-cyber-01', 'wp-samurai-01', 'wp-sakura-01'];
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

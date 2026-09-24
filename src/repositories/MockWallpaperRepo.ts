import { IWallpaperRepository } from './IWallpaperRepository';
import { Wallpaper, WallpaperFilterOptions } from '../types/wallpaper.types';
import { Category } from '../types/category.types';
import { WallpaperCollection } from '../types/collection.types';
import { WALLPAPERS_CATALOG } from '../data/wallpapers-catalog';
import { CATEGORIES_CATALOG } from '../data/categories-catalog';
import { COLLECTIONS_CATALOG } from '../data/collections-catalog';

const STORAGE_CUSTOM_KEY = 'yugen_custom_wallpapers_v1';
const STORAGE_STATS_KEY = 'yugen_wallpaper_stats_v1';
const STORAGE_CLEAN_LAUNCH_KEY = 'yugen_clean_launch_mode_v1';

export class MockWallpaperRepository implements IWallpaperRepository {
  private wallpapers: Wallpaper[];
  private categories: Category[];
  private collections: WallpaperCollection[];
  private cleanLaunchMode: boolean = true;
  private statsMap: Record<string, { views: number; downloads: number; favorites: number }> = {};

  constructor() {
    // Determine clean launch mode (defaults to TRUE for a brand-new app)
    try {
      const storedClean = localStorage.getItem(STORAGE_CLEAN_LAUNCH_KEY);
      this.cleanLaunchMode = storedClean !== null ? storedClean === 'true' : true;
    } catch {
      this.cleanLaunchMode = true;
    }

    // Load custom persisted stats overrides
    try {
      const storedStats = localStorage.getItem(STORAGE_STATS_KEY);
      if (storedStats) {
        this.statsMap = JSON.parse(storedStats);
      }
    } catch {
      this.statsMap = {};
    }

    // Load base catalog + any custom generated wallpapers from localStorage
    let customWalls: Wallpaper[] = [];
    try {
      const stored = localStorage.getItem(STORAGE_CUSTOM_KEY);
      if (stored) {
        customWalls = JSON.parse(stored);
      }
    } catch {
      // fallback
    }

    const merged = [...customWalls, ...WALLPAPERS_CATALOG];

    // Apply clean launch mode (reset simulated views to 0 or real stats)
    this.wallpapers = merged.map((w) => {
      const customStats = this.statsMap[w.id];
      if (this.cleanLaunchMode) {
        return {
          ...w,
          stats: {
            ...w.stats,
            views: customStats?.views ?? 0,
            downloads: customStats?.downloads ?? 0,
            favorites: customStats?.favorites ?? 0,
          },
        };
      } else if (customStats) {
        return {
          ...w,
          stats: {
            ...w.stats,
            views: customStats.views,
            downloads: customStats.downloads,
            favorites: customStats.favorites,
          },
        };
      }
      return w;
    });

    this.collections = [...COLLECTIONS_CATALOG];
    this.categories = CATEGORIES_CATALOG.map((cat) => {
      const actualCount = this.wallpapers.filter((w) => w.categoryId === cat.id).length;
      return {
        ...cat,
        itemCount: actualCount > 0 ? actualCount : cat.itemCount,
      };
    });
  }

  async getAllWallpapers(): Promise<Wallpaper[]> {
    return [...this.wallpapers];
  }

  async getWallpaperById(id: string): Promise<Wallpaper | null> {
    const found = this.wallpapers.find((w) => w.id === id);
    return found ? { ...found } : null;
  }

  async getTrendingWallpapers(limit = 20): Promise<Wallpaper[]> {
    return this.wallpapers
      .filter((w) => w.isTrending || w.stats.views > 40000)
      .slice(0, limit);
  }

  async getNewWallpapers(limit = 20): Promise<Wallpaper[]> {
    return this.wallpapers
      .filter((w) => w.isNew)
      .slice(0, limit);
  }

  async getRecommendedWallpapers(userFavoriteIds: string[], limit = 20): Promise<Wallpaper[]> {
    if (!userFavoriteIds || userFavoriteIds.length === 0) {
      // Return a balanced mix of top rated and featured
      return this.wallpapers.filter((w) => w.isFeatured || w.isTopRated).slice(0, limit);
    }

    // Extract preferred categories from user favorites
    const favWallpapers = this.wallpapers.filter((w) => userFavoriteIds.includes(w.id));
    const favCatCounts: Record<string, number> = {};
    const favTags = new Set<string>();

    favWallpapers.forEach((w) => {
      favCatCounts[w.categoryId] = (favCatCounts[w.categoryId] || 0) + 1;
      w.tags.forEach((t) => favTags.add(t));
    });

    // Score other wallpapers
    const scored = this.wallpapers
      .filter((w) => !userFavoriteIds.includes(w.id))
      .map((w) => {
        let score = (favCatCounts[w.categoryId] || 0) * 3;
        w.tags.forEach((t) => {
          if (favTags.has(t)) score += 1;
        });
        return { wallpaper: w, score };
      });

    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, limit).map((s) => s.wallpaper);
  }

  async getWallpapersByCategory(categoryId: string, limit = 200): Promise<Wallpaper[]> {
    return this.wallpapers
      .filter((w) => w.categoryId === categoryId)
      .slice(0, limit);
  }

  async getNightSelection(limit = 20): Promise<Wallpaper[]> {
    return this.wallpapers
      .filter((w) => w.isNightSelection || w.isAmoled)
      .slice(0, limit);
  }

  async getTopRated(limit = 20): Promise<Wallpaper[]> {
    return [...this.wallpapers]
      .sort((a, b) => b.stats.rating - a.stats.rating)
      .slice(0, limit);
  }

  async searchWallpapers(options: WallpaperFilterOptions): Promise<Wallpaper[]> {
    return this.wallpapers.filter((w) => {
      // Text query
      if (options.searchQuery && options.searchQuery.trim() !== '') {
        const q = options.searchQuery.toLowerCase().trim();
        const matchesTitle = w.title.toLowerCase().includes(q);
        const matchesDesc = w.description.toLowerCase().includes(q);
        const matchesCategory = w.categoryName.toLowerCase().includes(q);
        const matchesTags = w.tags.some((t) => t.toLowerCase().includes(q));
        if (!matchesTitle && !matchesDesc && !matchesCategory && !matchesTags) {
          return false;
        }
      }

      // Category filter
      if (options.categoryId && options.categoryId !== 'all') {
        if (w.categoryId !== options.categoryId) return false;
      }

      // Resolution filter
      if (options.resolution && options.resolution !== 'all') {
        if (options.resolution === 'AMOLED' && !w.isAmoled) return false;
        if (options.resolution !== 'AMOLED' && w.resolution.label !== options.resolution) return false;
      }

      // Color filter
      if (options.color && options.color !== 'all') {
        const targetColor = options.color.toLowerCase();
        const dominant = w.palette.dominant.toLowerCase();
        const matchesAccents = w.palette.accents.some((a) => a.toLowerCase().includes(targetColor));
        if (!dominant.includes(targetColor) && !matchesAccents && w.themeColor.toLowerCase() !== targetColor) {
          return false;
        }
      }

      // Premium filter
      if (options.premiumOnly && !w.isPremium) return false;

      // Amoled filter
      if (options.amoledOnly && !w.isAmoled) return false;

      return true;
    });
  }

  async getAllCategories(): Promise<Category[]> {
    return [...this.categories];
  }

  async getCategoryById(id: string): Promise<Category | null> {
    const c = this.categories.find((cat) => cat.id === id);
    return c ? { ...c } : null;
  }

  async getAllCollections(): Promise<WallpaperCollection[]> {
    return [...this.collections];
  }

  async getCollectionById(id: string): Promise<WallpaperCollection | null> {
    const col = this.collections.find((c) => c.id === id);
    return col ? { ...col } : null;
  }

  private saveStatsMap(): void {
    try {
      localStorage.setItem(STORAGE_STATS_KEY, JSON.stringify(this.statsMap));
    } catch {
      // silent
    }
  }

  async incrementViews(wallpaperId: string): Promise<void> {
    const wp = this.wallpapers.find((w) => w.id === wallpaperId);
    if (wp) {
      wp.stats.views += 1;
      this.statsMap[wallpaperId] = {
        views: wp.stats.views,
        downloads: wp.stats.downloads,
        favorites: wp.stats.favorites,
      };
      this.saveStatsMap();
    }
  }

  async incrementDownloads(wallpaperId: string): Promise<void> {
    const wp = this.wallpapers.find((w) => w.id === wallpaperId);
    if (wp) {
      wp.stats.downloads += 1;
      this.statsMap[wallpaperId] = {
        views: wp.stats.views,
        downloads: wp.stats.downloads,
        favorites: wp.stats.favorites,
      };
      this.saveStatsMap();
    }
  }

  async toggleFavorite(wallpaperId: string, isFav: boolean): Promise<void> {
    const wp = this.wallpapers.find((w) => w.id === wallpaperId);
    if (wp) {
      wp.stats.favorites += isFav ? 1 : -1;
      if (wp.stats.favorites < 0) wp.stats.favorites = 0;
      this.statsMap[wallpaperId] = {
        views: wp.stats.views,
        downloads: wp.stats.downloads,
        favorites: wp.stats.favorites,
      };
      this.saveStatsMap();
    }
  }

  async resetAllStatsToZero(): Promise<void> {
    this.cleanLaunchMode = true;
    this.statsMap = {};
    try {
      localStorage.removeItem(STORAGE_STATS_KEY);
      localStorage.setItem(STORAGE_CLEAN_LAUNCH_KEY, 'true');
    } catch {
      // silent
    }
    this.wallpapers.forEach((w) => {
      w.stats.views = 0;
      w.stats.downloads = 0;
      w.stats.favorites = 0;
    });
  }

  async restoreDemoStats(): Promise<void> {
    this.cleanLaunchMode = false;
    this.statsMap = {};
    try {
      localStorage.removeItem(STORAGE_STATS_KEY);
      localStorage.setItem(STORAGE_CLEAN_LAUNCH_KEY, 'false');
    } catch {
      // silent
    }
    // Re-read catalog original values
    const mapOriginal = new Map(WALLPAPERS_CATALOG.map((w) => [w.id, w.stats]));
    this.wallpapers.forEach((w) => {
      const orig = mapOriginal.get(w.id);
      if (orig) {
        w.stats = { ...orig };
      }
    });
  }

  isCleanLaunchMode(): boolean {
    return this.cleanLaunchMode;
  }

  async setCleanLaunchMode(clean: boolean): Promise<void> {
    if (clean) {
      await this.resetAllStatsToZero();
    } else {
      await this.restoreDemoStats();
    }
  }

  async addWallpaper(wallpaper: Wallpaper): Promise<Wallpaper> {
    this.wallpapers.unshift(wallpaper);
    try {
      const stored = localStorage.getItem(STORAGE_CUSTOM_KEY);
      const list = stored ? JSON.parse(stored) : [];
      list.unshift(wallpaper);
      localStorage.setItem(STORAGE_CUSTOM_KEY, JSON.stringify(list));
    } catch {
      // silent fallback
    }
    return wallpaper;
  }

  async deleteWallpaper(id: string): Promise<boolean> {
    const index = this.wallpapers.findIndex((w) => w.id === id);
    if (index !== -1) {
      this.wallpapers.splice(index, 1);
      try {
        const stored = localStorage.getItem(STORAGE_CUSTOM_KEY);
        if (stored) {
          const list: Wallpaper[] = JSON.parse(stored);
          const filtered = list.filter((w) => w.id !== id);
          localStorage.setItem(STORAGE_CUSTOM_KEY, JSON.stringify(filtered));
        }
      } catch {
        // silent
      }
      return true;
    }
    return false;
  }
}

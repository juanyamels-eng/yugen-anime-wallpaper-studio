import { Wallpaper, WallpaperFilterOptions } from '../types/wallpaper.types';
import { Category } from '../types/category.types';
import { WallpaperCollection } from '../types/collection.types';

export interface IWallpaperRepository {
  // Wallpapers
  getAllWallpapers(): Promise<Wallpaper[]>;
  getWallpaperById(id: string): Promise<Wallpaper | null>;
  getTrendingWallpapers(limit?: number): Promise<Wallpaper[]>;
  getNewWallpapers(limit?: number): Promise<Wallpaper[]>;
  getRecommendedWallpapers(userFavoriteIds: string[], limit?: number): Promise<Wallpaper[]>;
  getWallpapersByCategory(categoryId: string, limit?: number): Promise<Wallpaper[]>;
  getNightSelection(limit?: number): Promise<Wallpaper[]>;
  getTopRated(limit?: number): Promise<Wallpaper[]>;
  searchWallpapers(options: WallpaperFilterOptions): Promise<Wallpaper[]>;

  // Categories & Collections
  getAllCategories(): Promise<Category[]>;
  getCategoryById(id: string): Promise<Category | null>;
  getAllCollections(): Promise<WallpaperCollection[]>;
  getCollectionById(id: string): Promise<WallpaperCollection | null>;

  // User Actions
  incrementViews(wallpaperId: string): Promise<void>;
  incrementDownloads(wallpaperId: string): Promise<void>;
  toggleFavorite(wallpaperId: string, isFav: boolean): Promise<void>;

  // Content Creation (Admin / AI Studio)
  addWallpaper(wallpaper: Wallpaper): Promise<Wallpaper>;
  deleteWallpaper(id: string): Promise<boolean>;

  // Metrics Management (Clean Launch vs Demo Stats)
  resetAllStatsToZero(): Promise<void>;
  restoreDemoStats(): Promise<void>;
  isCleanLaunchMode(): boolean;
  setCleanLaunchMode(clean: boolean): Promise<void>;
}

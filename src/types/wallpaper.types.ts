/**
 * Domain types for Wallpapers
 */

export type WallpaperRatio = '9:20' | '9:16' | '16:9' | '1:1';
export type WallpaperResolutionCategory = '1080p' | '1440p' | '2K' | '4K' | 'QHD' | 'AMOLED';
export type WallpaperOrientation = 'portrait' | 'landscape' | 'square';

export interface WallpaperResolution {
  width: number;
  height: number;
  label: WallpaperResolutionCategory;
}

export interface WallpaperPalette {
  dominant: string; // e.g. '#1A0B2E'
  accents: string[]; // e.g. ['#FF4D8D', '#00F2FE', '#7928CA']
  textColor: 'light' | 'dark'; // calculated contrast for UI overlay
}

export interface WallpaperStats {
  views: number;
  downloads: number;
  favorites: number;
  rating: number; // 0 - 5.0
}

export interface WallpaperSource {
  type: 'AI_GENERATED' | 'CURATED_STUDIO' | 'COMMUNITY_ORIGINAL';
  creator: string;
  license: string;
  generationPrompt?: string;
  negativePrompt?: string;
  model?: string;
  createdAt: string;
}

export interface Wallpaper {
  id: string;
  title: string;
  titleJp?: string;
  description: string;
  categoryId: string;
  categoryName: string;
  tags: string[];
  themeColor: string; // Hex color tag for quick filtering
  palette: WallpaperPalette;
  resolution: WallpaperResolution;
  ratio: WallpaperRatio;
  orientation: WallpaperOrientation;
  urls: {
    thumbnail: string; // 360x800 for grid lazy loading (<40kb)
    preview: string;   // 720x1600 for viewer/phone mockup
    fhd: string;       // 1080x2400 for standard download
    uhd4k: string;     // 1440x3200 for full 4K ultra download
    original: string;  // Master source
  };
  stats: WallpaperStats;
  source: WallpaperSource;
  isFeatured?: boolean;
  isTrending?: boolean;
  isNew?: boolean;
  isTopRated?: boolean;
  isNightSelection?: boolean;
  isPremium?: boolean;
  isAmoled?: boolean;
  publishedAt: string;
}

export interface WallpaperFilterOptions {
  searchQuery?: string;
  categoryId?: string;
  tags?: string[];
  resolution?: WallpaperResolutionCategory | 'all';
  orientation?: WallpaperOrientation | 'all';
  color?: string | 'all';
  sortBy?: 'trending' | 'newest' | 'downloads' | 'rating' | 'popular_week';
  premiumOnly?: boolean;
  amoledOnly?: boolean;
}

import { IWallpaperRepository } from './IWallpaperRepository';
import { MockWallpaperRepository } from './MockWallpaperRepo';

// Central Repository instance (Singleton)
export const wallpaperRepository: IWallpaperRepository = new MockWallpaperRepository();

export * from './IWallpaperRepository';
export * from './MockWallpaperRepo';

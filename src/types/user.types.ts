export type UserTheme = 'dark' | 'light' | 'system';
export type DownloadQuality = '4k' | '1080p' | 'auto';
export type AppLanguage = 'es' | 'en' | 'ja' | 'ko' | 'pt';

export interface UserPreferences {
  theme: UserTheme;
  downloadQuality: DownloadQuality;
  language: AppLanguage;
  notificationsEnabled: boolean;
  dataSaver: boolean;
  amoledPureBlack: boolean;
}

export interface UserProfile {
  id: string;
  email: string | null;
  displayName: string;
  avatarUrl: string;
  isAnonymous: boolean;
  isPremium: boolean;
  premiumExpiry?: string;
  preferences: UserPreferences;
  favorites: string[]; // wallpaper IDs
  savedCollections: string[]; // collection IDs
  downloadsHistory: Array<{
    wallpaperId: string;
    timestamp: string;
    quality: string;
  }>;
  createdAt: string;
}

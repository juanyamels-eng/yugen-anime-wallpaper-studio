export interface WallpaperCollection {
  id: string;
  title: string;
  titleJp?: string;
  subtitle: string;
  description: string;
  coverUrl: string;
  badge?: string;
  wallpaperIds: string[];
  curator: string;
  createdAt: string;
  views: number;
  featured?: boolean;
}

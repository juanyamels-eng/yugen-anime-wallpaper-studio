import React from 'react';
import { motion } from 'framer-motion';
import { Wallpaper } from '../../types/wallpaper.types';
import { WallpaperCard } from './WallpaperCard';
import { SkeletonGrid } from '../common/LoadingSkeleton';
import { EmptyState } from '../common/EmptyState';

interface WallpaperGridProps {
  wallpapers: Wallpaper[];
  isLoading?: boolean;
  favorites: string[];
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
  onSelectWallpaper: (wallpaper: Wallpaper) => void;
  onQuickDownload?: (wallpaper: Wallpaper, e: React.MouseEvent) => void;
  onQuickShare?: (wallpaper: Wallpaper, e: React.MouseEvent) => void;
  emptyTitle?: string;
  emptySubtitle?: string;
  onEmptyAction?: () => void;
  columns?: 2 | 3 | 4;
}

export const WallpaperGrid: React.FC<WallpaperGridProps> = ({
  wallpapers,
  isLoading = false,
  favorites,
  onToggleFavorite,
  onSelectWallpaper,
  onQuickDownload,
  onQuickShare,
  emptyTitle = 'No hay fondos disponibles',
  emptySubtitle = 'Prueba ajustando los filtros o realizando otra búsqueda.',
  onEmptyAction,
  columns = 2,
}) => {
  if (isLoading) {
    return <SkeletonGrid count={8} />;
  }

  if (!wallpapers || wallpapers.length === 0) {
    return (
      <EmptyState
        title={emptyTitle}
        subtitle={emptySubtitle}
        actionText={onEmptyAction ? 'Restablecer filtros' : undefined}
        onAction={onEmptyAction}
      />
    );
  }

  const colClasses = {
    2: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
    3: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
    4: 'grid-cols-2 md:grid-cols-4 lg:grid-cols-5',
  }[columns];

  return (
    <motion.div
      initial="hidden"
      animate="show"
      className={`grid ${colClasses} gap-3 px-4 pb-28`}
    >
      {wallpapers.map((wp, index) => (
        <WallpaperCard
          key={wp.id}
          wallpaper={wp}
          index={index}
          isFavorite={favorites.includes(wp.id)}
          onToggleFavorite={onToggleFavorite}
          onClick={onSelectWallpaper}
          onQuickDownload={onQuickDownload}
          onQuickShare={onQuickShare}
        />
      ))}
    </motion.div>
  );
};

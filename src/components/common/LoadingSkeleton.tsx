import React from 'react';

interface SkeletonProps {
  className?: string;
  count?: number;
}

export const WallpaperCardSkeleton: React.FC = () => {
  return (
    <div className="relative rounded-2xl overflow-hidden aspect-[9/16] bg-[#121622] border border-white/5 animate-pulse">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/[0.03] to-white/[0.08]" />
      <div className="absolute bottom-3 left-3 right-3 space-y-2">
        <div className="h-3.5 bg-white/10 rounded-md w-3/4" />
        <div className="h-2.5 bg-white/5 rounded-md w-1/2" />
      </div>
    </div>
  );
};

export const SkeletonGrid: React.FC<SkeletonProps> = ({ count = 6 }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 px-4">
      {Array.from({ length: count }).map((_, i) => (
        <WallpaperCardSkeleton key={i} />
      ))}
    </div>
  );
};

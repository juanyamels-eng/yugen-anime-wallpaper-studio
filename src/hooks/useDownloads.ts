import { useState, useCallback, useEffect } from 'react';
import { WallpaperApplierService } from '../services/wallpaperApplier';
import { wallpaperRepository } from '../repositories';
import { analytics } from '../services/analyticsService';

const DOWNLOADS_HISTORY_KEY = 'yugen_downloads_history_v1';

export interface DownloadRecord {
  wallpaperId: string;
  title: string;
  quality: string;
  timestamp: string;
  thumbnailUrl: string;
}

export type DownloadStatus = 'idle' | 'preparing' | 'downloading' | 'completed' | 'error';

export function useDownloads() {
  const [history, setHistory] = useState<DownloadRecord[]>(() => {
    try {
      const stored = localStorage.getItem(DOWNLOADS_HISTORY_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [activeDownloads, setActiveDownloads] = useState<
    Record<string, { status: DownloadStatus; progress: number; error?: string }>
  >({});

  useEffect(() => {
    try {
      localStorage.setItem(DOWNLOADS_HISTORY_KEY, JSON.stringify(history));
    } catch {
      // ignore
    }
  }, [history]);

  const download = useCallback(
    async (
      wallpaperId: string,
      title: string,
      url: string,
      quality: '4K' | '1080p' = '4K',
      thumbnailUrl = ''
    ) => {
      setActiveDownloads((prev) => ({
        ...prev,
        [wallpaperId]: { status: 'preparing', progress: 10 },
      }));

      try {
        const cleanName = `yugen_${title.toLowerCase().replace(/[^a-z0-9]/g, '_')}_${quality}`;
        
        setActiveDownloads((prev) => ({
          ...prev,
          [wallpaperId]: { status: 'downloading', progress: 40 },
        }));

        await WallpaperApplierService.downloadWallpaper(url, cleanName, (prog) => {
          setActiveDownloads((prev) => ({
            ...prev,
            [wallpaperId]: { status: 'downloading', progress: prog },
          }));
        });

        // Record history
        const newRecord: DownloadRecord = {
          wallpaperId,
          title,
          quality,
          timestamp: new Date().toISOString(),
          thumbnailUrl,
        };

        setHistory((prev) => [newRecord, ...prev.filter((item) => item.wallpaperId !== wallpaperId)]);
        wallpaperRepository.incrementDownloads(wallpaperId);
        analytics.track('wallpaper_download', { wallpaperId, quality });

        setActiveDownloads((prev) => ({
          ...prev,
          [wallpaperId]: { status: 'completed', progress: 100 },
        }));

        // Reset status after a few seconds
        setTimeout(() => {
          setActiveDownloads((prev) => {
            const next = { ...prev };
            delete next[wallpaperId];
            return next;
          });
        }, 3500);

        return true;
      } catch (err) {
        setActiveDownloads((prev) => ({
          ...prev,
          [wallpaperId]: {
            status: 'error',
            progress: 0,
            error: (err as Error).message || 'Error en la descarga',
          },
        }));
        return false;
      }
    },
    []
  );

  const clearHistory = useCallback(() => {
    setHistory([]);
  }, []);

  return {
    history,
    activeDownloads,
    download,
    clearHistory,
    count: history.length,
  };
}

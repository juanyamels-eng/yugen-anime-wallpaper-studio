/**
 * Wallpaper Application and Download Service
 * - En app nativa (Capacitor): guarda en Documents/Yugen + intenta WallpaperManager.
 * - En web/PWA: descarga blob + Web Share.
 */
import { isNative, saveToGallery, setSystemWallpaper } from './wallpaperNative';

export interface ApplyWallpaperOptions {
  target: 'home' | 'lock' | 'both';
  quality: 'uhd4k' | 'fhd';
}

export interface ApplyResult {
  success: boolean;
  message: string;
  downloadTriggered?: boolean;
  appliedSystem?: boolean;
}

export class WallpaperApplierService {
  /**
   * Descarga compatible con Android Chrome / WebView / Nativo.
   */
  static async downloadWallpaper(
    imageUrl: string,
    filename: string,
    onProgress?: (progress: number) => void
  ): Promise<Blob> {
    const safeName =
      filename.endsWith('.jpg') || filename.endsWith('.png') ? filename : `${filename}.jpg`;

    // Ruta nativa: Filesystem (aparece en Archivos/Galería)
    if (isNative()) {
      try {
        if (onProgress) onProgress(20);
        await saveToGallery(imageUrl, safeName);
        if (onProgress) onProgress(100);
        // Retornamos un blob vacío como señal de éxito (el archivo ya está guardado)
        const res = await fetch(imageUrl, { mode: 'cors', credentials: 'omit' });
        return await res.blob();
      } catch (error) {
        console.error('Error native download:', error);
        throw error;
      }
    }

    try {
      if (onProgress) onProgress(15);
      const response = await fetch(imageUrl, { mode: 'cors', credentials: 'omit' });
      if (!response.ok) {
        throw new Error(`Failed to fetch image: ${response.statusText}`);
      }

      if (onProgress) onProgress(60);
      const blob = await response.blob();

      if (onProgress) onProgress(90);

      // Create download anchor (funciona en Chrome Android con gesto de usuario)
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = safeName;
      link.rel = 'noopener';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Clean up blob URL after delay
      setTimeout(() => URL.revokeObjectURL(blobUrl), 10000);

      if (onProgress) onProgress(100);
      return blob;
    } catch (error) {
      console.error('Error downloading wallpaper:', error);
      window.open(imageUrl, '_blank', 'noopener');
      throw error;
    }
  }

  /**
   * Aplica el fondo:
   * - Nativo con plugin YugenWallpaper: lo fija directo (home/lock/both).
   * - Sin plugin o en web: descarga + guía Galería.
   */
  static async applyWallpaper(
    wallpaperTitle: string,
    imageUrl: string,
    options: ApplyWallpaperOptions
  ): Promise<ApplyResult> {
    const cleanName = `yugen_${wallpaperTitle.toLowerCase().replace(/[^a-z0-9]/g, '_')}_${options.quality}`;

    // 1. Intento nativo directo
    if (isNative()) {
      try {
        await setSystemWallpaper(imageUrl, options.target);
        return {
          success: true,
          message: 'Fondo aplicado directamente en tu Android.',
          downloadTriggered: false,
          appliedSystem: true,
        };
      } catch (e) {
        // PLUGIN_MISSING o fallo -> cae a descarga nativa
        if ((e as Error).message !== 'PLUGIN_MISSING') {
          console.warn('setSystemWallpaper falló, usando descarga:', e);
        }
      }
      try {
        await saveToGallery(imageUrl, `${cleanName}.jpg`);
        return {
          success: true,
          message: 'Guardado en Documents/Yugen. Ábrelo en Galería > Establecer como fondo.',
          downloadTriggered: true,
        };
      } catch {
        return {
          success: false,
          message: 'No se pudo guardar. Revisa el permiso de almacenamiento.',
        };
      }
    }

    try {
      await this.downloadWallpaper(imageUrl, `${cleanName}.jpg`);

      const targetText =
        options.target === 'home'
          ? 'Pantalla Principal'
          : options.target === 'lock'
          ? 'Pantalla de Bloqueo'
          : 'Pantallas Principal y de Bloqueo';

      return {
        success: true,
        message: `Descargado en alta resolución para ${targetText}. Ábrelo en Galería > Establecer como fondo. (La web no puede aplicarlo directo sin app nativa).`,
        downloadTriggered: true,
      };
    } catch {
      return {
        success: false,
        message: 'Se abrió la imagen en una pestaña nueva: mantenla presionada y elige Guardar / Establecer como fondo.',
      };
    }
  }

  /**
   * Web Share API nivel 2: intenta compartir el archivo de imagen,
   * con fallback a URL y luego a portapapeles. Requiere HTTPS en Android.
   */
  static async shareWallpaper(title: string, url: string, imageUrl?: string): Promise<boolean> {
    // 0. Ruta nativa: comparte el archivo guardado vía Intent Android
    if (isNative() && imageUrl) {
      try {
        const { shareNativeFile } = await import('./wallpaperNative');
        const safeName = `yugen_${title.toLowerCase().replace(/[^a-z0-9]/g, '_')}_share.jpg`;
        const { saveToGallery } = await import('./wallpaperNative');
        const uri = await saveToGallery(imageUrl, safeName);
        await shareNativeFile(uri, title);
        return true;
      } catch {
        // cae a Web Share
      }
    }

    // 1. Intentar compartir el archivo real (Chrome Android)
    if (imageUrl) {
      try {
        const res = await fetch(imageUrl, { mode: 'cors', credentials: 'omit' });
        if (res.ok) {
          const blob = await res.blob();
          const file = new File([blob], `${title}.jpg`, { type: blob.type || 'image/jpeg' });
          const nav = navigator as Navigator & {
            canShare?: (data: { files?: File[] }) => boolean;
            share?: (data: { title?: string; text?: string; url?: string; files?: File[] }) => Promise<void>;
          };
          if (nav.canShare?.({ files: [file] })) {
            await nav.share?.({
              title: `${title} | Yūgen Anime Wallpapers`,
              text: `¡Mira este fondo anime en Yūgen! ${title}`,
              files: [file],
            });
            return true;
          }
        }
      } catch {
        // cae al siguiente método
      }
    }

    if (navigator.share) {
      try {
        await navigator.share({
          title: `${title} | Yūgen Anime Wallpapers`,
          text: `¡Mira este increíble fondo de pantalla anime en Yūgen! ${title}`,
          url,
        });
        return true;
      } catch {
        return false;
      }
    } else {
      // Fallback: copy to clipboard (requiere HTTPS / permiso en Android)
      try {
        await navigator.clipboard.writeText(url);
        return true;
      } catch {
        return false;
      }
    }
  }
}

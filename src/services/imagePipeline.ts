/**
 * Image processing and color extraction pipeline
 */

export interface ExtractedColorInfo {
  dominant: string;
  accents: string[];
  isDark: boolean;
}

export class ImagePipeline {
  /**
   * Extracts dominant and accent colors from an HTMLImageElement using canvas sampling.
   * La imagen DEBE cargarse con crossOrigin="anonymous" o el canvas queda
   * tainted y getImageData lanza SecurityError (típico en Android WebView).
   */
  static extractColors(img: HTMLImageElement): ExtractedColorInfo {
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        return { dominant: '#121620', accents: ['#FF4D8D', '#00F2FE'], isDark: true };
      }

      // Sample a small 50x50 area for fast computation
      canvas.width = 50;
      canvas.height = 50;
      ctx.drawImage(img, 0, 0, 50, 50);

      const imageData = ctx.getImageData(0, 0, 50, 50).data;
      let r = 0, g = 0, b = 0;
      const step = 4 * 4; // Sample every 4th pixel
      let count = 0;

      for (let i = 0; i < imageData.length; i += step) {
        r += imageData[i];
        g += imageData[i + 1];
        b += imageData[i + 2];
        count++;
      }

      const avgR = Math.round(r / count);
      const avgG = Math.round(g / count);
      const avgB = Math.round(b / count);

      const toHex = (n: number) => n.toString(16).padStart(2, '0');
      const dominant = `#${toHex(avgR)}${toHex(avgG)}${toHex(avgB)}`;

      // Calculate brightness (YIQ equation)
      const brightness = (avgR * 299 + avgG * 587 + avgB * 114) / 1000;
      const isDark = brightness < 128;

      return {
        dominant,
        accents: ['#FF4D8D', '#00F2FE'],
        isDark,
      };
    } catch {
      return { dominant: '#090B10', accents: ['#FF4D8D', '#00F2FE'], isDark: true };
    }
  }

  /**
   * Carga una imagen externa lista para análisis canvas sin taint.
   * Úsala antes de extractColors cuando la URL sea cross-origin (Unsplash).
   */
  static loadCORSImage(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.decoding = 'async';
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error('No se pudo cargar la imagen CORS'));
      img.src = src;
    });
  }

  /**
   * Detects image dimensions and assigns standard wallpaper label
   */
  static getImageResolution(width: number, height: number): '1080p' | '1440p' | '2K' | '4K' | 'AMOLED' {
    if (width >= 2160 || height >= 3840) return '4K';
    if (width >= 1440 || height >= 2960) return '1440p';
    if (width >= 1080 || height >= 2340) return '1080p';
    return '1080p';
  }
}

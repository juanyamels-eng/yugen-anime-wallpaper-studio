/**
 * Puente nativo Android (Capacitor).
 * - Guarda en almacenamiento compartido (Documents/Yugen) para que aparezca en Galería/Archivos.
 * - Fija el fondo vía plugin nativo YugenWallpaper (WallpaperManager) si está instalado.
 * - En web hace fallback al flujo web existente.
 */
import { Capacitor } from '@capacitor/core';
import { Directory, Filesystem } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';
import { Haptics, ImpactStyle } from '@capacitor/haptics';

export type WallpaperTarget = 'home' | 'lock' | 'both';

export function isNative(): boolean {
  try {
    return Capacitor.isNativePlatform();
  } catch {
    return false;
  }
}

function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('No se pudo leer la imagen'));
    reader.onload = () => {
      const dataUrl = reader.result as string;
      const base64 = dataUrl.split(',')[1] ?? '';
      resolve(base64);
    };
    reader.readAsDataURL(blob);
  });
}

export async function vibrateTick(): Promise<void> {
  if (!isNative()) return;
  try {
    await Haptics.impact({ style: ImpactStyle.Light });
  } catch {
    // sin haptics en este dispositivo
  }
}

/**
 * Descarga y guarda en Documents/Yugen/<filename>.
 * Retorna el URI nativo del archivo.
 */
export async function saveToGallery(imageUrl: string, filename: string): Promise<string> {
  const safeName = filename.endsWith('.jpg') || filename.endsWith('.png') ? filename : `${filename}.jpg`;
  const res = await fetch(imageUrl, { mode: 'cors', credentials: 'omit' });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const blob = await res.blob();
  const base64 = await blobToBase64(blob);

  const path = `Yugen/${safeName}`;
  await Filesystem.writeFile({
    path,
    data: base64,
    directory: Directory.Documents,
    recursive: true,
  });

  const uri = await Filesystem.getUri({ path, directory: Directory.Documents });
  return uri.uri;
}

/** Comparte el archivo ya guardado. */
export async function shareNativeFile(fileUri: string, title: string): Promise<void> {
  await Share.share({
    title: `${title} | Yūgen`,
    text: `Fondo anime ${title} desde Yūgen`,
    files: [fileUri],
    dialogTitle: 'Compartir fondo',
  });
}

/**
 * Intenta fijar el fondo con el plugin nativo YugenWallpaper.
 * El plugin se registra en android/app/src/main/java/.../YugenWallpaperPlugin.java
 * (ver README-ANDROID.md). Si no existe, lanza para que el caller haga fallback.
 */
export async function setSystemWallpaper(
  imageUrl: string,
  target: WallpaperTarget
): Promise<void> {
  const plugins = (Capacitor as unknown as { Plugins?: Record<string, { setWallpaper?: (o: { url: string; target: string }) => Promise<void> }> }).Plugins;
  const plugin = plugins?.YugenWallpaper;
  if (!plugin?.setWallpaper) {
    throw new Error('PLUGIN_MISSING');
  }
  await plugin.setWallpaper({ url: imageUrl, target });
}

/**
 * Copia de seguridad local: exporta/importa tus datos (perfil, favoritos,
 * descargas, tema y recompensas) en un archivo JSON.
 * Sirve para trasladar tu colección a otro dispositivo sin servidor.
 * Nunca incluye el PIN de admin ni la sesión: esos no se exportan.
 */
import { isNative, shareNativeFile } from './wallpaperNative';
import { Directory, Filesystem } from '@capacitor/filesystem';

const BACKUP_KEYS = [
  'yugen_user_profile_v1',
  'yugen_favorites_v1',
  'yugen_downloads_history_v1',
  'yugen_theme_v1',
  'yugen_amoled_v1',
  'yugen_ad_rewards_v2',
  'yugen_recent_searches_v1',
] as const;

export interface BackupFile {
  app: 'yugen-backup';
  version: 1;
  exportedAt: string;
  data: Record<string, string | null>;
}

export function collectBackup(): BackupFile {
  const data: Record<string, string | null> = {};
  for (const key of BACKUP_KEYS) {
    try {
      data[key] = localStorage.getItem(key);
    } catch {
      data[key] = null;
    }
  }
  return { app: 'yugen-backup', version: 1, exportedAt: new Date().toISOString(), data };
}

export async function exportBackup(): Promise<string> {
  const backup = collectBackup();
  const json = JSON.stringify(backup, null, 2);
  const filename = `yugen-backup-${new Date().toISOString().slice(0, 10)}.json`;

  if (isNative()) {
    const path = `Yugen/${filename}`;
    await Filesystem.writeFile({
      path,
      data: json,
      directory: Directory.Documents,
      recursive: true,
    });
    const uri = await Filesystem.getUri({ path, directory: Directory.Documents });
    await shareNativeFile(uri.uri, 'Copia de seguridad Yūgen');
    return uri.uri;
  }

  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 10000);
  return filename;
}

export function parseBackupFile(json: string): BackupFile {
  const parsed = JSON.parse(json) as BackupFile;
  if (!parsed || parsed.app !== 'yugen-backup' || typeof parsed.data !== 'object') {
    throw new Error('Archivo de copia no válido');
  }
  return parsed;
}

export function restoreBackup(backup: BackupFile): number {
  let restored = 0;
  for (const key of BACKUP_KEYS) {
    const value = backup.data[key];
    if (value !== undefined && value !== null) {
      try {
        localStorage.setItem(key, value);
        restored++;
      } catch {
        // sin almacenamiento
      }
    }
  }
  return restored;
}

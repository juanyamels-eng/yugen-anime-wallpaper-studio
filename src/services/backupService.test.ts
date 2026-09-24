import { describe, it, expect, beforeEach } from 'vitest';
import { collectBackup, parseBackupFile, restoreBackup } from './backupService';

describe('backupService', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('exporta y restaura favoritos y perfil', () => {
    localStorage.setItem('yugen_favorites_v1', JSON.stringify(['wp-cyber-01']));
    localStorage.setItem('yugen_user_profile_v1', JSON.stringify({ displayName: 'Test' }));

    const backup = collectBackup();
    expect(backup.app).toBe('yugen-backup');
    expect(backup.data['yugen_favorites_v1']).toContain('wp-cyber-01');

    localStorage.clear();
    const restored = restoreBackup(parseBackupFile(JSON.stringify(backup)));
    expect(restored).toBeGreaterThan(0);
    expect(localStorage.getItem('yugen_favorites_v1')).toContain('wp-cyber-01');
  });

  it('rechaza archivos que no son copia válida', () => {
    expect(() => parseBackupFile('{"app":"otra-app"}')).toThrow();
    expect(() => parseBackupFile('no-json')).toThrow();
  });

  it('no toca claves fuera de la lista (p. ej. PIN admin)', () => {
    localStorage.setItem('yugen_admin_master_pin_v1', '9999');
    const backup = collectBackup();
    expect('yugen_admin_master_pin_v1' in backup.data).toBe(false);
  });
});

import { describe, it, expect, beforeEach } from 'vitest';
import { adminAuthService } from './adminAuthService';

describe('adminAuthService', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    adminAuthService.lockSession();
  });

  it('reconoce el email del propietario sin importar mayúsculas', () => {
    expect(adminAuthService.isOwnerEmail('JuanYamels@Gmail.com')).toBe(true);
    expect(adminAuthService.isOwnerEmail('otro@mail.com')).toBe(false);
    expect(adminAuthService.isOwnerEmail(null)).toBe(false);
  });

  it('desbloquea la sesión con el PIN maestro y la bloquea después', () => {
    const pin = adminAuthService.getMasterPin();
    expect(adminAuthService.verifyPin(pin)).toBe(true);
    expect(adminAuthService.isAdminUnlocked(null)).toBe(true);
    adminAuthService.lockSession();
    expect(adminAuthService.isAdminUnlocked(null)).toBe(false);
  });

  it('rechaza un PIN incorrecto', () => {
    expect(adminAuthService.verifyPin('0000')).toBe(false);
  });

  it('actualiza el PIN solo con el PIN actual correcto', () => {
    const current = adminAuthService.getMasterPin();
    const ok = adminAuthService.updateMasterPin(current, '4321');
    expect(ok.success).toBe(true);
    expect(adminAuthService.getMasterPin()).toBe('4321');
    const bad = adminAuthService.updateMasterPin('0000', '9999');
    expect(bad.success).toBe(false);
  });
});

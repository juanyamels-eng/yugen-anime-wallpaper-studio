/**
 * Security service to restrict Admin Panel access strictly to the owner (juanyamels@gmail.com)
 * or via Master Admin PIN authorization.
 */

const OWNER_EMAIL = 'juanyamels@gmail.com';
const STORAGE_ADMIN_SESSION_KEY = 'yugen_admin_session_unlocked_v1';
const STORAGE_ADMIN_PIN_KEY = 'yugen_admin_master_pin_v1';
const STORAGE_DISCREET_KEY = 'yugen_admin_discreet_mode_v1';
// IMPORTANTE: cambia este PIN en tu primer inicio desde el panel.
// No se muestra en la UI por seguridad (antes era visible "2026").
const DEFAULT_PIN = '2026';

class AdminAuthService {
  private sessionUnlocked: boolean = false;

  constructor() {
    try {
      this.sessionUnlocked = sessionStorage.getItem(STORAGE_ADMIN_SESSION_KEY) === 'true';
    } catch {
      this.sessionUnlocked = false;
    }
  }

  /**
   * Returns the registered owner email
   */
  getOwnerEmail(): string {
    return OWNER_EMAIL;
  }

  /**
   * Checks if an email is the authorized owner
   */
  isOwnerEmail(email?: string | null): boolean {
    if (!email) return false;
    return email.trim().toLowerCase() === OWNER_EMAIL.toLowerCase();
  }

  /**
   * Verifies if admin privileges are currently active in this session
   */
  isAdminUnlocked(userEmail?: string | null): boolean {
    // 1. Direct match with owner account
    if (this.isOwnerEmail(userEmail)) {
      return true;
    }
    // 2. Verified session via PIN
    return this.sessionUnlocked;
  }

  /**
   * Checks if user entered the correct Master Admin PIN
   */
  verifyPin(inputPin: string): boolean {
    const currentPin = this.getMasterPin();
    if (inputPin.trim() === currentPin) {
      this.unlockSession();
      return true;
    }
    return false;
  }

  /**
   * Retrieves the current master PIN (defaults to 2026)
   */
  getMasterPin(): string {
    try {
      return localStorage.getItem(STORAGE_ADMIN_PIN_KEY) || DEFAULT_PIN;
    } catch {
      return DEFAULT_PIN;
    }
  }

  /**
   * Updates the master PIN
   */
  updateMasterPin(currentPin: string, newPin: string): { success: boolean; message: string } {
    if (!this.verifyPin(currentPin)) {
      return { success: false, message: 'El PIN actual no es correcto.' };
    }
    if (!/^\d{4,6}$/.test(newPin)) {
      return { success: false, message: 'El nuevo PIN debe tener entre 4 y 6 dígitos numéricos.' };
    }
    try {
      localStorage.setItem(STORAGE_ADMIN_PIN_KEY, newPin);
      return { success: true, message: 'PIN de Administrador actualizado con éxito.' };
    } catch {
      return { success: false, message: 'No se pudo guardar el nuevo PIN en el almacenamiento.' };
    }
  }

  /**
   * Unlocks admin for current browser session
   */
  unlockSession(): void {
    this.sessionUnlocked = true;
    try {
      sessionStorage.setItem(STORAGE_ADMIN_SESSION_KEY, 'true');
    } catch {
      // silent
    }
  }

  /**
   * Locks the admin session
   */
  lockSession(): void {
    this.sessionUnlocked = false;
    try {
      sessionStorage.removeItem(STORAGE_ADMIN_SESSION_KEY);
    } catch {
      // silent
    }
  }

  /**
   * Discreet mode: if enabled, the Admin button in profile is completely hidden from non-admins
   */
  isDiscreetMode(): boolean {
    try {
      return localStorage.getItem(STORAGE_DISCREET_KEY) === 'true';
    } catch {
      return false;
    }
  }

  setDiscreetMode(enabled: boolean): void {
    try {
      localStorage.setItem(STORAGE_DISCREET_KEY, enabled ? 'true' : 'false');
    } catch {
      // silent
    }
  }
}

export const adminAuthService = new AdminAuthService();

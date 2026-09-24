import { describe, it, expect, beforeEach } from 'vitest';
import { adService } from './adService';

describe('adService interstitial policy', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('exige frecuencia y respeta el cooldown entre intersticiales', () => {
    const freq = adService.getConfig().interstitialFrequency;
    // Antes de la frecuencia: nunca muestra
    for (let i = 1; i < freq; i++) {
      expect(adService.incrementDownloadAndCheckInterstitial()).toBe(false);
    }
    // Al alcanzar la frecuencia con cooldown cumplido: muestra
    expect(adService.incrementDownloadAndCheckInterstitial()).toBe(true);
    // La UI registra la impresión al mostrar el anuncio (arranca el cooldown)
    adService.recordImpression('interstitial');
    // Inmediatamente después el cooldown bloquea aunque se alcance la frecuencia
    for (let i = 1; i < freq; i++) {
      adService.incrementDownloadAndCheckInterstitial();
    }
    expect(adService.incrementDownloadAndCheckInterstitial()).toBe(false);
    expect(adService.getCooldownSecondsRemaining()).toBeGreaterThan(0);
  });

  it('desbloquea wallpapers y pase sin anuncios', () => {
    adService.unlockWallpaper('wp-test-1');
    expect(adService.isWallpaperUnlocked('wp-test-1')).toBe(true);
    expect(adService.isWallpaperUnlocked('wp-otro')).toBe(false);
    adService.grantAdFreeHours(2);
    expect(adService.isAdFreeActive()).toBe(true);
    expect(adService.getAdFreeRemainingMinutes()).toBeGreaterThan(0);
  });
});

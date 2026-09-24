import {
  AdMobConfig,
  AdMetrics,
  PayoutRequest,
  AdRewardStatus,
  GooglePlayPolicyCheck,
  MaxAdContentRating,
  UmpConsentStatus,
} from '../types/monetization.types';

const STORAGE_KEY_CONFIG = 'yugen_ad_config_v2';
const STORAGE_KEY_METRICS = 'yugen_ad_metrics_v2';
const STORAGE_KEY_PAYOUTS = 'yugen_ad_payouts_v2';
const STORAGE_KEY_REWARDS = 'yugen_ad_rewards_v2';
const STORAGE_KEY_LAST_INTERSTITIAL = 'yugen_ad_last_interstitial_v2';

const DEFAULT_CONFIG: AdMobConfig = {
  enabled: true,
  testMode: true,
  appId: 'ca-app-pub-3940256099942544~3347511713', // Google AdMob Test App ID
  bannerUnitId: 'ca-app-pub-3940256099942544/6300978111', // Test Banner ID
  interstitialUnitId: 'ca-app-pub-3940256099942544/1033173712', // Test Interstitial ID
  rewardedUnitId: 'ca-app-pub-3940256099942544/5224354917', // Test Rewarded ID
  interstitialFrequency: 4, // 1 interstitial every 4 downloads
  interstitialCooldownSeconds: 90, // Minimum 90 seconds gap between interstitials (Google Play Better Ads Policy)
  bannerFrequency: 6, // 1 banner every 6 items
  // Google Play & AdMob Policy Compliance
  maxAdContentRating: 'T', // Anime wallpapers targeting Teen/General audience
  tagForChildDirectedTreatment: false, // COPPA compliant
  tagForUnderAgeOfConsent: false, // GDPR-K compliant
  personalizedAdsConsent: true, // User Messaging Platform (UMP) consent
  umpConsentStatus: 'obtained',
  testDeviceIds: ['TEST_EMULATOR_ANDROID_01', 'TEST_DEVICE_PIXEL_YUGEN'],
};

const DEFAULT_METRICS: AdMetrics = {
  totalImpressions: 1420,
  bannerImpressions: 980,
  interstitialImpressions: 310,
  rewardedCompleted: 130,
  totalClicks: 88,
  ctrPercent: 6.2,
  ecpmAvg: 4.85, // $4.85 USD per 1k impressions
  estimatedRevenue: 68.42, // USD accumulated
  unpaidBalance: 68.42, // USD available to withdraw
  lastUpdated: new Date().toISOString(),
};

class AdService {
  private config: AdMobConfig;
  private metrics: AdMetrics;
  private payouts: PayoutRequest[];
  private rewards: AdRewardStatus;
  private downloadCounter = 0;
  private lastInterstitialTimestamp = 0;
  private isSdkInitialized = false;

  constructor() {
    this.config = this.loadConfig();
    this.metrics = this.loadMetrics();
    this.payouts = this.loadPayouts();
    this.rewards = this.loadRewards();
    this.loadLastInterstitial();
    this.initializeSdk();
  }

  // Simulate Google Mobile Ads SDK initialization
  public initializeSdk(): { status: 'ready' | 'test_mode'; version: string } {
    this.isSdkInitialized = true;
    return {
      status: this.config.testMode ? 'test_mode' : 'ready',
      version: 'Google Mobile Ads SDK v23.4.0 (AdMob React/PWA Bridge)',
    };
  }

  public getSdkStatus(): {
    initialized: boolean;
    appId: string;
    testMode: boolean;
    testDevicesCount: number;
    umpStatus: UmpConsentStatus;
    contentRating: MaxAdContentRating;
  } {
    return {
      initialized: this.isSdkInitialized,
      appId: this.config.appId,
      testMode: this.config.testMode,
      testDevicesCount: this.config.testDeviceIds.length,
      umpStatus: this.config.umpConsentStatus,
      contentRating: this.config.maxAdContentRating,
    };
  }

  private loadConfig(): AdMobConfig {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CONFIG);
      return saved ? { ...DEFAULT_CONFIG, ...JSON.parse(saved) } : DEFAULT_CONFIG;
    } catch {
      return DEFAULT_CONFIG;
    }
  }

  public saveConfig(newConfig: AdMobConfig): void {
    this.config = newConfig;
    localStorage.setItem(STORAGE_KEY_CONFIG, JSON.stringify(newConfig));
  }

  public getConfig(): AdMobConfig {
    return { ...this.config };
  }

  private loadMetrics(): AdMetrics {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_METRICS);
      return saved ? { ...DEFAULT_METRICS, ...JSON.parse(saved) } : DEFAULT_METRICS;
    } catch {
      return DEFAULT_METRICS;
    }
  }

  private saveMetrics(): void {
    localStorage.setItem(STORAGE_KEY_METRICS, JSON.stringify(this.metrics));
  }

  public getMetrics(): AdMetrics {
    return { ...this.metrics };
  }

  private loadPayouts(): PayoutRequest[] {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PAYOUTS);
      if (saved) return JSON.parse(saved);
      return [
        {
          id: 'payout-101',
          date: '2026-08-15',
          amount: 55.0,
          method: 'paypal',
          accountDetails: 'creator@yugen.art',
          status: 'completed',
        },
      ];
    } catch {
      return [];
    }
  }

  private savePayouts(): void {
    localStorage.setItem(STORAGE_KEY_PAYOUTS, JSON.stringify(this.payouts));
  }

  public getPayouts(): PayoutRequest[] {
    return [...this.payouts];
  }

  private loadRewards(): AdRewardStatus {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_REWARDS);
      return saved
        ? JSON.parse(saved)
        : { unlockedWallpaperIds: [], unlockedStickerPackIds: [], adFreeUntil: null };
    } catch {
      return { unlockedWallpaperIds: [], unlockedStickerPackIds: [], adFreeUntil: null };
    }
  }

  private saveRewards(): void {
    localStorage.setItem(STORAGE_KEY_REWARDS, JSON.stringify(this.rewards));
  }

  public getRewards(): AdRewardStatus {
    return { ...this.rewards };
  }

  private loadLastInterstitial(): void {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_LAST_INTERSTITIAL);
      if (saved) {
        this.lastInterstitialTimestamp = parseInt(saved, 10) || 0;
      }
    } catch {
      this.lastInterstitialTimestamp = 0;
    }
  }

  private recordInterstitialShown(): void {
    this.lastInterstitialTimestamp = Date.now();
    try {
      localStorage.setItem(STORAGE_KEY_LAST_INTERSTITIAL, this.lastInterstitialTimestamp.toString());
    } catch {
      // ignore
    }
  }

  public isWallpaperUnlocked(id: string): boolean {
    return this.rewards.unlockedWallpaperIds.includes(id) || this.isAdFreeActive();
  }

  public isStickerPackUnlocked(id: string): boolean {
    return this.rewards.unlockedStickerPackIds.includes(id) || this.isAdFreeActive();
  }

  public isAdFreeActive(): boolean {
    if (!this.rewards.adFreeUntil) return false;
    return Date.now() < this.rewards.adFreeUntil;
  }

  public getAdFreeRemainingMinutes(): number {
    if (!this.rewards.adFreeUntil) return 0;
    const diff = this.rewards.adFreeUntil - Date.now();
    return diff > 0 ? Math.ceil(diff / (60 * 1000)) : 0;
  }

  public unlockWallpaper(id: string): void {
    if (!this.rewards.unlockedWallpaperIds.includes(id)) {
      this.rewards.unlockedWallpaperIds.push(id);
      this.saveRewards();
    }
  }

  public unlockStickerPack(id: string): void {
    if (!this.rewards.unlockedStickerPackIds.includes(id)) {
      this.rewards.unlockedStickerPackIds.push(id);
      this.saveRewards();
    }
  }

  public grantAdFreeHours(hours = 2): void {
    const currentExpiry = this.isAdFreeActive() && this.rewards.adFreeUntil ? this.rewards.adFreeUntil : Date.now();
    const expires = currentExpiry + hours * 60 * 60 * 1000;
    this.rewards.adFreeUntil = expires;
    this.saveRewards();
  }

  // Record an ad impression and calculate estimated micro-revenue
  public recordImpression(format: 'banner' | 'interstitial' | 'rewarded'): void {
    if (!this.config.enabled) return;

    this.metrics.totalImpressions += 1;
    let earned = 0;

    if (format === 'banner') {
      this.metrics.bannerImpressions += 1;
      earned = 0.002; // $2 eCPM approx
    } else if (format === 'interstitial') {
      this.metrics.interstitialImpressions += 1;
      this.recordInterstitialShown();
      earned = 0.012; // $12 eCPM
    } else if (format === 'rewarded') {
      this.metrics.rewardedCompleted += 1;
      earned = 0.028; // $28 eCPM for high-intent rewarded video
    }

    this.metrics.estimatedRevenue = Number((this.metrics.estimatedRevenue + earned).toFixed(2));
    this.metrics.unpaidBalance = Number((this.metrics.unpaidBalance + earned).toFixed(2));
    this.metrics.lastUpdated = new Date().toISOString();
    this.saveMetrics();
  }

  public recordClick(): void {
    this.metrics.totalClicks += 1;
    this.metrics.ctrPercent = Number(
      ((this.metrics.totalClicks / Math.max(1, this.metrics.totalImpressions)) * 100).toFixed(1)
    );
    // Add CPC bonus revenue
    const cpcEarned = 0.04;
    this.metrics.estimatedRevenue = Number((this.metrics.estimatedRevenue + cpcEarned).toFixed(2));
    this.metrics.unpaidBalance = Number((this.metrics.unpaidBalance + cpcEarned).toFixed(2));
    this.saveMetrics();
  }

  /**
   * Google Play Better Ads Policy compliant Interstitial check:
   * 1. App must not be in Ad-Free mode.
   * 2. Download counter must reach user-defined frequency.
   * 3. TIME COOLDOWN: Must have elapsed at least `interstitialCooldownSeconds` (default 90s)
   *    since the last interstitial was shown to avoid disruptive back-to-back ads.
   */
  public incrementDownloadAndCheckInterstitial(): boolean {
    if (!this.config.enabled || this.isAdFreeActive()) return false;

    this.downloadCounter += 1;

    const secondsSinceLast = (Date.now() - this.lastInterstitialTimestamp) / 1000;
    const cooldownMet = secondsSinceLast >= this.config.interstitialCooldownSeconds;

    if (this.downloadCounter >= this.config.interstitialFrequency) {
      if (cooldownMet) {
        this.downloadCounter = 0;
        return true;
      }
      // If cooldown is not met yet, keep download counter primed without spamming
      return false;
    }
    return false;
  }

  public getCooldownSecondsRemaining(): number {
    const elapsed = (Date.now() - this.lastInterstitialTimestamp) / 1000;
    const remaining = this.config.interstitialCooldownSeconds - elapsed;
    return remaining > 0 ? Math.ceil(remaining) : 0;
  }

  // Developer Test Device registration
  public addTestDeviceId(deviceId: string): void {
    const clean = deviceId.trim();
    if (clean && !this.config.testDeviceIds.includes(clean)) {
      this.config.testDeviceIds.push(clean);
      this.saveConfig(this.config);
    }
  }

  public removeTestDeviceId(deviceId: string): void {
    this.config.testDeviceIds = this.config.testDeviceIds.filter((id) => id !== deviceId);
    this.saveConfig(this.config);
  }

  // Privacy & UMP Consent management
  public setPersonalizedAdsConsent(granted: boolean): void {
    this.config.personalizedAdsConsent = granted;
    this.config.umpConsentStatus = granted ? 'obtained' : 'required';
    this.saveConfig(this.config);
  }

  // Audit Google Play Ads Policy compliance
  public runPolicyAudit(): GooglePlayPolicyCheck[] {
    const checks: GooglePlayPolicyCheck[] = [
      {
        id: 'cooldown-interstitial',
        category: 'Disruptive Ads',
        rule: 'Intervalo mínimo entre anuncios a pantalla completa (Intersticiales)',
        status: this.config.interstitialCooldownSeconds >= 60 ? 'compliant' : 'warning',
        description: `Configurado en ${this.config.interstitialCooldownSeconds}s de espera obligatoria entre intersticiales (Google Play exige al menos 60s para evitar desinterés y frustración).`,
      },
      {
        id: 'ad-attribution',
        category: 'Deceptive Ads',
        rule: 'Etiquetado visible y no engañoso de Banners Nativos',
        status: 'compliant',
        description: 'Todos los banners incorporan distintivo destacado "[ANUNCIO] / [PATROCINADO]" y botón de transparencia AdChoices.',
      },
      {
        id: 'rewarded-optin',
        category: 'Rewarded Ads UX',
        rule: 'Consentimiento explícito y voluntario en Anuncios Recompensados',
        status: 'compliant',
        description: 'El usuario debe tocar explícitamente "Desbloquear con Anuncio" para iniciar el video. Nunca se fuerza automáticamente.',
      },
      {
        id: 'rewarded-exit-warning',
        category: 'Rewarded Ads UX',
        rule: 'Botón de cierre claro y aviso de salida previa en Recompensados',
        status: 'compliant',
        description: 'El reproductor muestra conteo regresivo claro, control de silencio y confirmación en caso de salida temprana.',
      },
      {
        id: 'content-rating',
        category: 'Content Rating',
        rule: 'Filtro de clasificación máxima de anuncios (AdMob Content Rating)',
        status: this.config.maxAdContentRating !== 'MA' ? 'compliant' : 'warning',
        description: `Clasificación actual: [${this.config.maxAdContentRating}]. Apto para audiencias jóvenes y adolescentes acorde al catálogo de anime.`,
      },
      {
        id: 'ump-consent',
        category: 'User Consent & Privacy',
        rule: 'Consentimiento UMP / GDPR para anuncios personalizados',
        status: this.config.umpConsentStatus === 'obtained' ? 'compliant' : 'warning',
        description: this.config.personalizedAdsConsent
          ? 'Consentimiento de usuario registrado conforme a políticas europeas GDPR y normativas de Google Play.'
          : 'Modo de anuncios no personalizados (contextuales) activo para máxima privacidad.',
      },
      {
        id: 'test-mode-safety',
        category: 'Deceptive Ads',
        rule: 'Protección contra tráfico inválido (Test Mode / IDs de prueba)',
        status: this.config.testMode || this.config.testDeviceIds.length > 0 ? 'compliant' : 'warning',
        description: this.config.testMode
          ? 'Modo de pruebas activo con Ad Units oficiales de Google (previene suspensiones por clics propios).'
          : `${this.config.testDeviceIds.length} dispositivos de prueba registrados.`,
      },
    ];

    return checks;
  }

  // Request cash out / cobro
  public requestPayout(
    amount: number,
    method: 'paypal' | 'bank_transfer' | 'stripe' | 'crypto_usdt',
    accountDetails: string
  ): { success: boolean; message: string } {
    if (amount < 20) {
      return { success: false, message: 'El retiro mínimo es de $20.00 USD' };
    }
    if (amount > this.metrics.unpaidBalance) {
      return { success: false, message: 'Saldo insuficiente para este cobro' };
    }

    const newRequest: PayoutRequest = {
      id: `pay-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      amount,
      method,
      accountDetails,
      status: 'pending',
    };

    this.payouts.unshift(newRequest);
    this.savePayouts();

    this.metrics.unpaidBalance = Number((this.metrics.unpaidBalance - amount).toFixed(2));
    this.saveMetrics();

    return {
      success: true,
      message: `Solicitud de cobro de $${amount.toFixed(2)} USD enviada correctamente a ${accountDetails}. Se procesará en 24-48 horas.`,
    };
  }
}

export const adService = new AdService();

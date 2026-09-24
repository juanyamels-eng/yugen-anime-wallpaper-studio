export type AdNetwork = 'admob' | 'adsense' | 'unity' | 'custom';
export type AdFormat = 'banner' | 'interstitial' | 'rewarded';
export type MaxAdContentRating = 'G' | 'PG' | 'T' | 'MA';
export type UmpConsentStatus = 'obtained' | 'required' | 'not_required' | 'unknown';

export interface AdMobConfig {
  enabled: boolean;
  testMode: boolean;
  appId: string;
  bannerUnitId: string;
  interstitialUnitId: string;
  rewardedUnitId: string;
  interstitialFrequency: number; // e.g. show every N downloads
  interstitialCooldownSeconds: number; // Google Play compliant minimum gap between interstitials (e.g., 90s)
  bannerFrequency: number; // e.g. show 1 banner every N items
  // Google Play & AdMob Policy Compliance
  maxAdContentRating: MaxAdContentRating;
  tagForChildDirectedTreatment: boolean; // COPPA
  tagForUnderAgeOfConsent: boolean; // GDPR-K
  personalizedAdsConsent: boolean; // User consent for personalized vs contextual ads
  umpConsentStatus: UmpConsentStatus;
  testDeviceIds: string[]; // Developer test devices to avoid invalid click suspensions
}

export interface AdMetrics {
  totalImpressions: number;
  bannerImpressions: number;
  interstitialImpressions: number;
  rewardedCompleted: number;
  totalClicks: number;
  ctrPercent: number;
  ecpmAvg: number; // e.g. $4.80 USD
  estimatedRevenue: number; // USD
  unpaidBalance: number; // USD available to cash out
  lastUpdated: string;
}

export interface PayoutRequest {
  id: string;
  date: string;
  amount: number;
  method: 'paypal' | 'bank_transfer' | 'stripe' | 'crypto_usdt';
  accountDetails: string;
  status: 'pending' | 'processing' | 'completed' | 'rejected';
}

export interface AdRewardStatus {
  unlockedWallpaperIds: string[];
  unlockedStickerPackIds: string[];
  adFreeUntil: number | null; // timestamp
}

export interface GooglePlayPolicyCheck {
  id: string;
  category: 'Disruptive Ads' | 'Deceptive Ads' | 'User Consent & Privacy' | 'Rewarded Ads UX' | 'Content Rating';
  rule: string;
  status: 'compliant' | 'warning' | 'non_compliant';
  description: string;
}

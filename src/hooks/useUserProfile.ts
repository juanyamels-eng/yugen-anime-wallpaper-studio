import { useState, useEffect, useCallback } from 'react';
import { UserProfile, AppLanguage, DownloadQuality } from '../types/user.types';

const USER_PROFILE_KEY = 'yugen_user_profile_v1';

const DEFAULT_PROFILE: UserProfile = {
  id: 'guest_' + Math.random().toString(36).substring(2, 9),
  email: null,
  displayName: 'Viajero Astral',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  isAnonymous: true,
  isPremium: false,
  preferences: {
    theme: 'dark',
    downloadQuality: '4k',
    language: 'es',
    notificationsEnabled: true,
    dataSaver: false,
    amoledPureBlack: true,
  },
  favorites: [],
  savedCollections: [],
  downloadsHistory: [],
  createdAt: new Date().toISOString(),
};

export function useUserProfile() {
  const [profile, setProfile] = useState<UserProfile>(() => {
    try {
      const stored = localStorage.getItem(USER_PROFILE_KEY);
      return stored ? { ...DEFAULT_PROFILE, ...JSON.parse(stored) } : DEFAULT_PROFILE;
    } catch {
      return DEFAULT_PROFILE;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(profile));
    } catch {
      // ignore
    }
  }, [profile]);

  const updatePreferences = useCallback(
    (key: keyof UserProfile['preferences'], value: any) => {
      setProfile((prev) => ({
        ...prev,
        preferences: {
          ...prev.preferences,
          [key]: value,
        },
      }));
    },
    []
  );

  const loginWithGoogle = useCallback(async () => {
    // Simulated smooth authentication
    setProfile((prev) => ({
      ...prev,
      email: 'alex.tanaka@yugen.art',
      displayName: 'Kenji Takahashi',
      isAnonymous: false,
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
    }));
  }, []);

  const loginWithEmail = useCallback(async (email: string, name: string) => {
    setProfile((prev) => ({
      ...prev,
      email,
      displayName: name || email.split('@')[0],
      isAnonymous: false,
    }));
  }, []);

  const logout = useCallback(async () => {
    setProfile({
      ...DEFAULT_PROFILE,
      id: 'guest_' + Math.random().toString(36).substring(2, 9),
    });
  }, []);

  const togglePremium = useCallback(() => {
    setProfile((prev) => ({
      ...prev,
      isPremium: !prev.isPremium,
    }));
  }, []);

  const clearCache = useCallback(() => {
    const keysToRemove = [
      'yugen_wallpaper_stats_v1',
      'yugen_analytics_history',
    ];
    keysToRemove.forEach((k) => localStorage.removeItem(k));
    return true;
  }, []);

  return {
    profile,
    updatePreferences,
    loginWithGoogle,
    loginWithEmail,
    logout,
    togglePremium,
    clearCache,
  };
}

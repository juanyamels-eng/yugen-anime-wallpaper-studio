import { useState, useEffect } from 'react';
import { UserTheme } from '../types/user.types';

const THEME_STORAGE_KEY = 'yugen_theme_v1';
const AMOLED_STORAGE_KEY = 'yugen_amoled_v1';

export function useTheme() {
  const [theme, setThemeState] = useState<UserTheme>(() => {
    try {
      const stored = localStorage.getItem(THEME_STORAGE_KEY);
      return (stored as UserTheme) || 'dark';
    } catch {
      return 'dark';
    }
  });

  const [amoledMode, setAmoledModeState] = useState<boolean>(() => {
    try {
      return localStorage.getItem(AMOLED_STORAGE_KEY) === 'true';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    const root = document.documentElement;
    const isDark =
      theme === 'dark' ||
      (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

    if (isDark) {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }

    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
      // ignore
    }
  }, [theme]);

  useEffect(() => {
    try {
      localStorage.setItem(AMOLED_STORAGE_KEY, String(amoledMode));
    } catch {
      // ignore
    }
  }, [amoledMode]);

  const setTheme = (newTheme: UserTheme) => {
    setThemeState(newTheme);
  };

  const setAmoledMode = (enabled: boolean) => {
    setAmoledModeState(enabled);
  };

  return {
    theme,
    setTheme,
    amoledMode,
    setAmoledMode,
    isDark:
      theme === 'dark' ||
      (theme === 'system' && typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches),
  };
}

/**
 * @license
 * YŪGEN (幽玄) — Anime Wallpaper Studio
 * Central Brand Configuration
 */

export interface BrandConfig {
  name: string;
  kanji: string;
  tagline: string;
  description: string;
  version: string;
  buildNumber: string;
  supportEmail: string;
  author: string;
  defaultTheme: 'dark' | 'light' | 'system';
  colors: {
    primary: string;
    secondary: string;
    accentViolet: string;
    bgDark: string;
    bgCardDark: string;
    textDark: string;
  };
  socials: {
    discord?: string;
    twitter?: string;
    github?: string;
  };
  defaults: {
    wallpaperResolution: string;
    ratio: string;
  };
}

export const BRAND: BrandConfig = {
  name: 'YŪGEN',
  kanji: '幽玄',
  tagline: 'Mundos infinitos en la palma de tu mano',
  description: 'Galería cinematográfica de fondos de pantalla anime originales en 4K y AMOLED.',
  version: '1.4.1',
  buildNumber: '20260924.1',
  supportEmail: 'contact@yugen-walls.art',
  author: 'Yūgen Art Collective & Studio',
  defaultTheme: 'dark',
  colors: {
    primary: '#FF4D8D', // Sakura Neon
    secondary: '#00F2FE', // Cyber Cyan
    accentViolet: '#7928CA', // Tokyo Violet
    bgDark: '#090B10', // OLED Void Black
    bgCardDark: '#121620', // Dark Slate
    textDark: '#F8FAFC',
  },
  socials: {
    discord: 'https://discord.gg/yugenwalls',
    twitter: 'https://x.com/yugenwalls',
    github: 'https://github.com/yugenwalls/studio',
  },
  defaults: {
    wallpaperResolution: '1440 × 3200',
    ratio: '9:20',
  },
};

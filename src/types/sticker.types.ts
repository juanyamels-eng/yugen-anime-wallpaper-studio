export interface Sticker {
  id: string;
  packId: string;
  title: string;
  emoji: string;
  imageUrl: string;
  tags: string[];
  isAnimated?: boolean;
  isPremium?: boolean;
  downloads: number;
  favorites: number;
}

export interface StickerPack {
  id: string;
  title: string;
  titleJp?: string;
  description: string;
  author: string;
  authorAvatar?: string;
  coverUrl: string;
  category: 'chibi' | 'cyberpunk' | 'waifu' | 'shonen' | 'pixel' | 'emotes';
  stickersCount: number;
  isNew?: boolean;
  isPopular?: boolean;
  isPremium?: boolean;
  stickers: Sticker[];
  whatsappCompatible?: boolean;
  telegramLink?: string;
}

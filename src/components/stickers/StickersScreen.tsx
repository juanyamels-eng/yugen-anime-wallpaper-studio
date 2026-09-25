import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  Search,
  Layers,
  MessageCircle,
  Share2,
  Lock,
  Download,
  Copy,
  Check,
  Smartphone,
  Flame,
  Palette,
} from 'lucide-react';
import { INITIAL_STICKER_PACKS } from '../../data/stickers.data';
import { StickerPack, Sticker } from '../../types/sticker.types';
import { Wallpaper } from '../../types/wallpaper.types';
import { StickerPackModal } from './StickerPackModal';
import { StickerCanvasModal } from './StickerCanvasModal';
import { NativeBannerAd } from '../ads/NativeBannerAd';
import { adService } from '../../services/adService';

interface StickersScreenProps {
  wallpapers: Wallpaper[];
  onShowToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

type CategoryFilter = 'all' | 'chibi' | 'cyberpunk' | 'waifu' | 'shonen' | 'pixel';

export const StickersScreen: React.FC<StickersScreenProps> = ({ wallpapers, onShowToast }) => {
  const [packs, setPacks] = useState<StickerPack[]>(INITIAL_STICKER_PACKS);
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activePack, setActivePack] = useState<StickerPack | null>(null);
  const [studioSticker, setStudioSticker] = useState<Sticker | null>(null);
  const [copiedStickerId, setCopiedStickerId] = useState<string | null>(null);

  const categories = [
    { id: 'all' as CategoryFilter, label: 'Todos', icon: Layers },
    { id: 'chibi' as CategoryFilter, label: 'Chibi Kawaii', icon: Sparkles },
    { id: 'cyberpunk' as CategoryFilter, label: 'Cyberpunk', icon: Flame },
    { id: 'waifu' as CategoryFilter, label: 'Waifus & Reacciones', icon: MessageCircle },
    { id: 'shonen' as CategoryFilter, label: 'Shonen & Llamas', icon: Flame },
    { id: 'pixel' as CategoryFilter, label: 'Pixel Retro', icon: Palette },
  ];

  const filteredPacks = useMemo(() => {
    return packs.filter((pack) => {
      const matchesCat = selectedCategory === 'all' || pack.category === selectedCategory;
      const matchesSearch =
        !searchQuery.trim() ||
        pack.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pack.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pack.stickers.some((s) =>
          s.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))
        );
      return matchesCat && matchesSearch;
    });
  }, [packs, selectedCategory, searchQuery]);

  // Quick copy individual sticker
  const handleQuickCopy = async (sticker: Sticker, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      if (navigator.clipboard && window.ClipboardItem) {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.src = sticker.imageUrl;
        await new Promise((resolve) => (img.onload = resolve));

        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth || 320;
        canvas.height = img.naturalHeight || 320;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          canvas.toBlob(async (pngBlob) => {
            if (pngBlob) {
              await navigator.clipboard.write([
                new ClipboardItem({ 'image/png': pngBlob }),
              ]);
              setCopiedStickerId(sticker.id);
              onShowToast(`Sticker "${sticker.title}" copiado. ¡Listo para pegar en WhatsApp!`, 'success');
              setTimeout(() => setCopiedStickerId(null), 3000);
            }
          }, 'image/png');
          return;
        }
      }
      await navigator.clipboard.writeText(sticker.imageUrl);
      setCopiedStickerId(sticker.id);
      onShowToast('Enlace de sticker copiado al portapapeles', 'info');
      setTimeout(() => setCopiedStickerId(null), 3000);
    } catch {
      onShowToast('Sticker listo para compartir', 'info');
    }
  };

  return (
    <div className="pb-24 pt-3 px-3 sm:px-4 max-w-lg mx-auto space-y-4 animate-in fade-in duration-300">
      {/* Hero Header */}
      <div className="relative p-5 rounded-3xl bg-gradient-to-br from-[#1A0B2E] via-[#121622] to-[#0A1128] border border-white/10 shadow-2xl overflow-hidden">
        <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-[#FF4D8D]/15 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -left-6 -top-6 w-32 h-32 bg-[#00F2FE]/15 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-1.5 text-xs">
            <span className="font-bold text-[#FF4D8D] uppercase tracking-wider">
              Sticker Studio
            </span>
            <span className="text-white/30">·</span>
            <span className="text-slate-400 font-medium">WhatsApp & Telegram</span>
          </div>

          <h1 className="text-2xl font-black text-white tracking-tight leading-tight">
            Stickers Anime & Emojis <span className="text-[#00F2FE]">HD</span>
          </h1>
          <p className="text-xs text-slate-300 mt-1 leading-relaxed">
            Packs con fondos transparentes listos para enviar a tus chats o combinarlos en tus fondos con Sticker Studio.
          </p>

          {/* Search bar */}
          <div className="relative mt-4">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar stickers (chibi, oni, tsundere, cat...)"
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white/10 border border-white/10 text-white placeholder-slate-400 text-xs focus:outline-none focus:border-[#00F2FE] backdrop-blur-md"
            />
          </div>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isActive = selectedCategory === cat.id;

          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer select-none ${
                isActive
                  ? 'bg-gradient-to-r from-[#FF4D8D] to-[#7928CA] text-white shadow-lg shadow-[#FF4D8D]/25 scale-105'
                  : 'bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Quick Feature: Sticker Studio trigger */}
      <div className="p-3.5 rounded-3xl bg-gradient-to-r from-[#121622] via-[#1A1F2C] to-[#121622] border border-white/10 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#00F2FE] to-[#7928CA] flex items-center justify-center text-white shadow-md">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white">Sticker Studio & Overlay</h4>
            <p className="text-[11px] text-slate-400">Pega stickers sobre cualquier wallpaper</p>
          </div>
        </div>

        <button
          onClick={() => {
            const firstSticker = packs[0]?.stickers[0];
            if (firstSticker) setStudioSticker(firstSticker);
          }}
          className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-colors cursor-pointer"
        >
          Abrir Studio
        </button>
      </div>

      {/* Sticker Packs List */}
      <div className="space-y-4">
        {filteredPacks.length === 0 ? (
          <div className="text-center py-12 space-y-2">
            <div className="w-12 h-12 rounded-full bg-white/5 mx-auto flex items-center justify-center text-slate-500">
              <Search className="w-6 h-6" />
            </div>
            <p className="text-sm font-semibold text-slate-400">
              No se encontraron packs con "{searchQuery}"
            </p>
          </div>
        ) : (
          filteredPacks.map((pack, index) => {
            const isUnlocked = !pack.isPremium || adService.isStickerPackUnlocked(pack.id);

            return (
              <React.Fragment key={pack.id}>
                <div
                  onClick={() => setActivePack(pack)}
                  className="p-4 rounded-3xl bg-[#121622] border border-white/10 hover:border-white/20 transition-all shadow-xl cursor-pointer group"
                >
                  {/* Pack Top Info */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={pack.coverUrl}
                        alt={pack.title}
                        className="w-12 h-12 rounded-2xl object-cover border border-white/15 shadow-md group-hover:scale-105 transition-transform"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-black text-white group-hover:text-[#00F2FE] transition-colors">
                            {pack.title}
                          </h3>
                          {pack.isPremium && (
                            <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-amber-400 text-black flex items-center gap-1">
                              <Lock className="w-2.5 h-2.5" />
                              <span>VIP</span>
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-400 line-clamp-1">{pack.description}</p>
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActivePack(pack);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold shrink-0 transition-colors"
                    >
                      Ver ({pack.stickers.length})
                    </button>
                  </div>

                  {/* Horizontal Preview of Stickers */}
                  <div className="grid grid-cols-6 gap-2 bg-[#090C12] p-2.5 rounded-2xl border border-white/5">
                    {pack.stickers.slice(0, 6).map((sticker) => {
                      const isCopied = copiedStickerId === sticker.id;

                      return (
                        <div
                          key={sticker.id}
                          onClick={(e) => handleQuickCopy(sticker, e)}
                          className="relative aspect-square rounded-xl bg-white/5 hover:bg-white/15 border border-white/5 hover:border-white/20 flex items-center justify-center p-1 transition-all group/item"
                          title="Clic para copiar para WhatsApp"
                        >
                          <img
                            src={sticker.imageUrl}
                            alt={sticker.title}
                            className="max-w-full max-h-full object-contain drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] group-hover/item:scale-110 transition-transform"
                          />

                          {isCopied && (
                            <div className="absolute inset-0 bg-emerald-500/90 rounded-xl flex items-center justify-center text-black">
                              <Check className="w-4 h-4" />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Pack Footer stats */}
                  <div className="flex items-center justify-between mt-3 text-[11px] text-slate-400">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
                      <span>Compatible con WhatsApp & Telegram</span>
                    </span>

                    <span className="font-semibold text-slate-300">
                      {pack.stickersCount} stickers en alta resolución
                    </span>
                  </div>
                </div>

                {/* Insert Native Sponsor Ad after 2nd pack */}
                {index === 1 && <NativeBannerAd variant="feed" />}
              </React.Fragment>
            );
          })
        )}
      </div>

      {/* STICKER PACK MODAL */}
      {activePack && (
        <StickerPackModal
          pack={activePack}
          isOpen={Boolean(activePack)}
          onClose={() => setActivePack(null)}
          onShowToast={onShowToast}
          onOpenStickerStudio={(stk) => {
            setActivePack(null);
            setStudioSticker(stk);
          }}
        />
      )}

      {/* STICKER STUDIO MODAL */}
      {studioSticker && (
        <StickerCanvasModal
          sticker={studioSticker}
          wallpapers={wallpapers}
          isOpen={Boolean(studioSticker)}
          onClose={() => setStudioSticker(null)}
          onShowToast={onShowToast}
        />
      )}
    </div>
  );
};

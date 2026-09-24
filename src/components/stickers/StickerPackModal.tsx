import React, { useState } from 'react';
import {
  X,
  Share2,
  Download,
  Copy,
  Check,
  Sparkles,
  ExternalLink,
  MessageCircle,
  Eye,
  Layers,
  Heart,
  Smartphone,
  Lock,
} from 'lucide-react';
import { StickerPack, Sticker } from '../../types/sticker.types';
import { adService } from '../../services/adService';
import { RewardedAdModal } from '../ads/RewardedAdModal';

interface StickerPackModalProps {
  pack: StickerPack;
  isOpen: boolean;
  onClose: () => void;
  onShowToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
  onOpenStickerStudio?: (sticker: Sticker) => void;
}

export const StickerPackModal: React.FC<StickerPackModalProps> = ({
  pack,
  isOpen,
  onClose,
  onShowToast,
  onOpenStickerStudio,
}) => {
  const [selectedSticker, setSelectedSticker] = useState<Sticker>(pack.stickers[0] || null);
  const [activeTab, setActiveTab] = useState<'grid' | 'chat_preview'>('grid');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showRewardedAd, setShowRewardedAd] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(
    !pack.isPremium || adService.isStickerPackUnlocked(pack.id)
  );

  if (!isOpen) return null;

  // Copy sticker image to clipboard
  const handleCopySticker = async (sticker: Sticker) => {
    try {
      // Fetch image and write to clipboard
      const response = await fetch(sticker.imageUrl);
      const blob = await response.blob();
      
      // Try writing as PNG clipboard item
      if (navigator.clipboard && window.ClipboardItem) {
        // Convert blob to PNG if necessary via canvas
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
              setCopiedId(sticker.id);
              onShowToast(`¡Sticker "${sticker.title}" copiado! Pégalo en WhatsApp o Telegram.`, 'success');
              setTimeout(() => setCopiedId(null), 3000);
            }
          }, 'image/png');
          return;
        }
      }

      // Fallback: copy link
      await navigator.clipboard.writeText(sticker.imageUrl);
      setCopiedId(sticker.id);
      onShowToast('Enlace de sticker copiado al portapapeles', 'info');
      setTimeout(() => setCopiedId(null), 3000);
    } catch {
      onShowToast('Sticker listo para compartir', 'info');
    }
  };

  // Download individual sticker
  const handleDownloadSticker = (sticker: Sticker) => {
    const link = document.createElement('a');
    link.href = sticker.imageUrl;
    link.download = `yugen-sticker-${sticker.title.toLowerCase().replace(/\s+/g, '-')}.png`;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    onShowToast(`Descargando sticker "${sticker.title}"`, 'success');
  };

  // WhatsApp share
  const handleShareWhatsApp = (sticker: Sticker) => {
    const text = encodeURIComponent(
      `¡Mira este sticker anime de Yūgen Wallpapers! ✨ ${sticker.imageUrl}`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  // Telegram share
  const handleShareTelegram = (sticker: Sticker) => {
    const text = encodeURIComponent(`Sticker Anime: ${sticker.title}`);
    const url = encodeURIComponent(sticker.imageUrl);
    window.open(`https://t.me/share/url?url=${url}&text=${text}`, '_blank');
  };

  const handleUnlockWithAd = () => {
    setShowRewardedAd(true);
  };

  const handleAdRewardGranted = () => {
    adService.unlockStickerPack(pack.id);
    setIsUnlocked(true);
    onShowToast(`¡Pack "${pack.title}" desbloqueado gratis con éxito!`, 'success');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-[#0C1017] border border-white/15 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        {/* Pack Header */}
        <div className="relative p-5 pb-4 bg-gradient-to-b from-[#141926] to-[#0C1017] border-b border-white/10">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <img
                src={pack.coverUrl}
                alt={pack.title}
                className="w-14 h-14 rounded-2xl object-cover border border-white/20 shadow-lg"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-black text-white leading-tight">
                    {pack.title}
                  </h3>
                  {pack.titleJp && (
                    <span className="text-[11px] font-mono px-1.5 py-0.5 rounded bg-white/10 text-[#00F2FE]">
                      {pack.titleJp}
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">
                  {pack.description}
                </p>
                <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-400">
                  <span className="font-semibold text-slate-300">Por {pack.author}</span>
                  <span>•</span>
                  <span>{pack.stickers.length} Stickers HD</span>
                </div>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Tab Selector: Grid view vs WhatsApp chat mockup */}
          <div className="flex items-center gap-2 mt-4">
            <button
              onClick={() => setActiveTab('grid')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'grid'
                  ? 'bg-white/20 text-white border border-white/25 shadow-sm'
                  : 'bg-white/5 text-slate-400 hover:text-white border border-transparent'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Colección ({pack.stickers.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('chat_preview')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'chat_preview'
                  ? 'bg-[#00F2FE]/20 text-[#00F2FE] border border-[#00F2FE]/40 shadow-sm'
                  : 'bg-white/5 text-slate-400 hover:text-white border border-transparent'
              }`}
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Vista previa en Chat</span>
            </button>
          </div>
        </div>

        {/* Lock Overlay if VIP pack not unlocked */}
        {!isUnlocked && (
          <div className="p-4 bg-gradient-to-r from-amber-950/60 via-[#141926] to-purple-950/60 border-b border-amber-500/30 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                <Lock className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">Pack VIP Exclusivo</h4>
                <p className="text-[11px] text-slate-300">Desbloquea viendo un anuncio corto de 10s</p>
              </div>
            </div>

            <button
              onClick={handleUnlockWithAd}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 text-black font-bold text-xs shadow-lg shadow-amber-500/20 active:scale-95 transition-transform flex items-center gap-1.5 shrink-0 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Ver Anuncio</span>
            </button>
          </div>
        )}

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {activeTab === 'grid' ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {pack.stickers.map((sticker) => {
                const isSelected = selectedSticker?.id === sticker.id;
                const isCopied = copiedId === sticker.id;

                return (
                  <div
                    key={sticker.id}
                    onClick={() => setSelectedSticker(sticker)}
                    className={`relative p-3 rounded-2xl border transition-all cursor-pointer flex flex-col items-center justify-between group ${
                      isSelected
                        ? 'bg-white/15 border-[#00F2FE] shadow-lg shadow-[#00F2FE]/10'
                        : 'bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/10'
                    }`}
                  >
                    {/* Sticker Image */}
                    <div className="w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center p-1">
                      <img
                        src={sticker.imageUrl}
                        alt={sticker.title}
                        className="max-w-full max-h-full object-contain drop-shadow-[0_4px_12px_rgba(0,0,0,0.6)] group-hover:scale-110 transition-transform duration-300"
                        loading="lazy"
                      />
                    </div>

                    <div className="w-full mt-2 text-center">
                      <span className="text-xs font-bold text-white block truncate">
                        {sticker.emoji} {sticker.title}
                      </span>
                    </div>

                    {/* Quick copy overlay on hover/focus */}
                    <div className="flex items-center gap-1.5 mt-2 w-full pt-2 border-t border-white/10 justify-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCopySticker(sticker);
                        }}
                        className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                          isCopied
                            ? 'bg-emerald-500 text-black font-bold'
                            : 'bg-white/10 hover:bg-white/20 text-slate-200'
                        }`}
                        title="Copiar para WhatsApp/Telegram"
                      >
                        {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDownloadSticker(sticker);
                        }}
                        className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 text-xs transition-colors"
                        title="Descargar PNG transparente"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>

                      {onOpenStickerStudio && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onOpenStickerStudio(sticker);
                          }}
                          className="p-1.5 rounded-lg bg-[#00F2FE]/15 hover:bg-[#00F2FE]/25 text-[#00F2FE] text-xs transition-colors"
                          title="Usar en Sticker Studio"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* WhatsApp / Telegram Dark Chat Bubble Mockup */
            <div className="p-4 rounded-3xl bg-[#0B141A] border border-white/10 space-y-4">
              <div className="text-center text-[11px] text-slate-400 border-b border-white/10 pb-2">
                Simulador de burbuja de chat en WhatsApp / Telegram
              </div>

              {/* Chat incoming bubble */}
              <div className="flex items-end gap-2 max-w-[80%]">
                <div className="w-7 h-7 rounded-full bg-slate-700 overflow-hidden shrink-0">
                  <img src={pack.authorAvatar} alt={pack.author} className="w-full h-full object-cover" />
                </div>
                <div className="p-2.5 rounded-2xl rounded-bl-sm bg-[#202C33] text-xs text-white shadow">
                  <p>¿Viste este sticker nuevo de Yūgen? Está épico 🔥</p>
                  <span className="text-[9px] text-slate-400 block text-right mt-0.5">18:42</span>
                </div>
              </div>

              {/* Chat sticker response bubble */}
              <div className="flex flex-col items-end gap-1">
                <div className="p-2 rounded-2xl bg-transparent max-w-[200px] flex flex-col items-end">
                  <img
                    src={selectedSticker ? selectedSticker.imageUrl : pack.stickers[0].imageUrl}
                    alt="Sticker"
                    className="w-36 h-36 object-contain drop-shadow-[0_8px_16px_rgba(0,0,0,0.8)] hover:scale-105 transition-transform"
                  />
                  <div className="flex items-center gap-1 text-[10px] text-slate-400 mt-1 pr-1">
                    <span>18:43</span>
                    <span className="text-[#53BDEB]">✓✓</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Selected Sticker Action Bar */}
        {selectedSticker && (
          <div className="p-4 bg-[#121622] border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs text-slate-300">
              <span className="text-lg">{selectedSticker.emoji}</span>
              <span className="font-bold text-white">{selectedSticker.title}</span>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              {/* WhatsApp Button */}
              <button
                onClick={() => handleShareWhatsApp(selectedSticker)}
                className="flex-1 sm:flex-none px-3.5 py-2 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-black font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md cursor-pointer"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </button>

              {/* Telegram Button */}
              <button
                onClick={() => handleShareTelegram(selectedSticker)}
                className="flex-1 sm:flex-none px-3.5 py-2 rounded-xl bg-[#0088cc] hover:bg-[#0077b3] text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Telegram</span>
              </button>

              {/* Copy Button */}
              <button
                onClick={() => handleCopySticker(selectedSticker)}
                className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                {copiedId === selectedSticker.id ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Copiado</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copiar</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Rewarded Ad to unlock VIP pack */}
      {showRewardedAd && (
        <RewardedAdModal
          isOpen={showRewardedAd}
          rewardTitle={`Pack ${pack.title}`}
          onRewardGranted={handleAdRewardGranted}
          onClose={() => setShowRewardedAd(false)}
        />
      )}
    </div>
  );
};

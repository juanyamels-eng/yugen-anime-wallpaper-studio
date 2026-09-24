import React, { useState, useRef, useEffect } from 'react';
import {
  ArrowLeft,
  Heart,
  Download,
  Share2,
  Smartphone,
  Eye,
  Info,
  Maximize2,
  Minimize2,
  Sparkles,
  ChevronDown,
  Layers,
  Palette,
  Tag,
  Check,
  Sliders,
} from 'lucide-react';
import { Wallpaper } from '../../types/wallpaper.types';
import { WallpaperApplierService } from '../../services/wallpaperApplier';
import { ApplyWallpaperModal } from './ApplyWallpaperModal';
import { WallpaperEditorModal } from './WallpaperEditorModal';
import { LiveWallpaperCanvas, LiveEffectType } from './LiveWallpaperCanvas';
import { PhonePreviewMockup } from '../preview/PhonePreviewMockup';
import { Button } from '../common/Button';

interface FullscreenViewerProps {
  wallpaper: Wallpaper | null;
  onClose: () => void;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onDownload: (wallpaper: Wallpaper, quality: '4K' | '1080p') => void;
  onShowToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

export const FullscreenViewer: React.FC<FullscreenViewerProps> = ({
  wallpaper,
  onClose,
  isFavorite,
  onToggleFavorite,
  onDownload,
  onShowToast,
}) => {
  const [showUI, setShowUI] = useState(true);
  const [showInfoDrawer, setShowInfoDrawer] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [showPhonePreview, setShowPhonePreview] = useState(false);
  const [showEditorModal, setShowEditorModal] = useState(false);
  const [liveEffect, setLiveEffect] = useState<LiveEffectType>('none');
  const [showLiveEffectsMenu, setShowLiveEffectsMenu] = useState(false);
  const [scale, setScale] = useState(1);
  const [copiedColor, setCopiedColor] = useState<string | null>(null);

  // Reset states when wallpaper changes
  useEffect(() => {
    setShowUI(true);
    setShowInfoDrawer(false);
    setShowPhonePreview(false);
    setScale(1);
  }, [wallpaper]);

  if (!wallpaper) return null;

  const handleToggleUI = (e: React.MouseEvent) => {
    // Only toggle if not clicking on interactive buttons
    if ((e.target as HTMLElement).closest('button') || (e.target as HTMLElement).closest('.interactive-control')) {
      return;
    }
    setShowUI((prev) => !prev);
  };

  const handleDoubleTap = () => {
    setScale((prev) => (prev === 1 ? 1.8 : 1));
  };

  const handleShare = async () => {
    const success = await WallpaperApplierService.shareWallpaper(
      wallpaper.title,
      window.location.href,
      wallpaper.urls.fhd || wallpaper.urls.preview
    );
    if (success) {
      onShowToast('¡Fondo compartido!', 'success');
    }
  };

  const copyHex = async (hex: string) => {
    try {
      await navigator.clipboard.writeText(hex);
    } catch {
      // Fallback Android WebView sin permiso de clipboard: input temporal + execCommand
      try {
        const ta = document.createElement('textarea');
        ta.value = hex;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
      } catch {
        onShowToast(`Color ${hex}`, 'info');
        return;
      }
    }
    setCopiedColor(hex);
    onShowToast(`Color ${hex} copiado`, 'info');
    setTimeout(() => setCopiedColor(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center select-none overflow-hidden animate-in fade-in duration-300 min-h-dvh">
      {/* Background Image with Zoom & Pan */}
      <div
        onClick={handleToggleUI}
        onDoubleClick={handleDoubleTap}
        className="relative w-full h-full flex items-center justify-center cursor-zoom-in overflow-hidden"
      >
        <img
          src={wallpaper.urls.uhd4k || wallpaper.urls.preview}
          alt={wallpaper.title}
          crossOrigin="anonymous"
          draggable={false}
          className="w-full h-full max-w-lg object-cover transition-transform duration-300 ease-out"
          style={{ transform: `scale(${scale})` }}
        />

        {/* Live Wallpaper Animation Layer (Sakura, Cyber Rain, Embers, Stars) */}
        <LiveWallpaperCanvas effect={liveEffect} />

        {/* Double tap hint */}
        {showUI && (
          <div className="absolute top-20 left-1/2 -translate-x-1/2 pointer-events-none px-3 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-[10px] text-white/70 z-20">
            Doble toque para zoom · Toca para ocultar interfaz
          </div>
        )}
      </div>

      {/* TOP BAR OVERLAY */}
      <div
        className={`absolute top-0 inset-x-0 pt-3 pb-8 px-4 bg-gradient-to-b from-black/85 via-black/40 to-transparent flex items-center justify-between transition-all duration-300 pointer-events-none z-30 ${
          showUI ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'
        }`}
      >
        <button
          onClick={onClose}
          className="pointer-events-auto w-11 h-11 rounded-2xl bg-black/40 backdrop-blur-md border border-white/15 flex items-center justify-center text-white hover:bg-black/60 active:scale-90 transition-all cursor-pointer"
          aria-label="Regresar"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="text-center drop-shadow-md">
          <h3 className="text-sm font-bold text-white line-clamp-1 max-w-[200px]">{wallpaper.title}</h3>
          <p className="text-[11px] text-slate-300">{wallpaper.categoryName}</p>
        </div>

        <div className="flex items-center gap-2 pointer-events-auto relative">
          {/* Live Effect Particle Button */}
          <button
            onClick={() => setShowLiveEffectsMenu((prev) => !prev)}
            className={`w-11 h-11 rounded-2xl backdrop-blur-md border flex items-center justify-center transition-all cursor-pointer ${
              liveEffect !== 'none'
                ? 'bg-[#FF4D8D]/30 border-[#FF4D8D] text-[#FF4D8D] shadow-lg shadow-[#FF4D8D]/20'
                : 'bg-black/40 border-white/15 text-white hover:bg-black/60'
            }`}
            title="Efectos en vivo interactivos"
          >
            <Sparkles className="w-5 h-5" />
          </button>

          {/* Live Effects Menu Popup */}
          {showLiveEffectsMenu && (
            <div className="absolute top-14 right-0 w-44 bg-[#0D111A]/95 border border-white/15 rounded-2xl shadow-2xl p-2 z-50 backdrop-blur-xl animate-in fade-in zoom-in-95 duration-150">
              <span className="text-[10px] font-bold text-slate-400 px-2 py-1 block uppercase tracking-wider">
                Efectos en Vivo
              </span>
              {[
                { id: 'none' as LiveEffectType, label: 'Desactivado', icon: '⛔' },
                { id: 'sakura' as LiveEffectType, label: 'Pétalos Sakura', icon: '🌸' },
                { id: 'cyber_rain' as LiveEffectType, label: 'Lluvia Cyberpunk', icon: '🌧️' },
                { id: 'embers' as LiveEffectType, label: 'Brasas de Fuego', icon: '🔥' },
                { id: 'stars' as LiveEffectType, label: 'Estrellas Bokeh', icon: '✨' },
              ].map((ef) => (
                <button
                  key={ef.id}
                  onClick={() => {
                    setLiveEffect(ef.id);
                    setShowLiveEffectsMenu(false);
                    onShowToast(
                      ef.id === 'none'
                        ? 'Efectos en vivo desactivados'
                        : `Efecto "${ef.label}" activado en tiempo real`,
                      'info'
                    );
                  }}
                  className={`w-full px-2.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer ${
                    liveEffect === ef.id
                      ? 'bg-[#00F2FE]/20 text-[#00F2FE]'
                      : 'text-slate-300 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <span>{ef.icon}</span>
                  <span>{ef.label}</span>
                </button>
              ))}
            </div>
          )}

          {/* Phone Mockup Toggle */}
          <button
            onClick={() => setShowPhonePreview(true)}
            className="w-11 h-11 rounded-2xl bg-black/40 backdrop-blur-md border border-white/15 flex items-center justify-center text-white hover:bg-black/60 active:scale-90 transition-all cursor-pointer"
            title="Vista previa en smartphone"
          >
            <Smartphone className="w-5 h-5 text-[#00F2FE]" />
          </button>

          {/* Info Details Toggle */}
          <button
            onClick={() => setShowInfoDrawer((prev) => !prev)}
            className="w-11 h-11 rounded-2xl bg-black/40 backdrop-blur-md border border-white/15 flex items-center justify-center text-white hover:bg-black/60 active:scale-90 transition-all cursor-pointer"
            title="Detalles y paleta de color"
          >
            <Info className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* BOTTOM ACTION BAR OVERLAY */}
      <div
        className={`absolute bottom-0 inset-x-0 pt-10 px-4 bg-gradient-to-t from-black/95 via-black/60 to-transparent flex flex-col gap-3.5 transition-all duration-300 pointer-events-none z-30 max-w-lg mx-auto ${
          showUI ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6 pointer-events-none'
        }`}
        style={{ paddingBottom: 'calc(1.5rem + env(safe-area-inset-bottom, 0px))' }}
      >
        {/* Quick Actions Row */}
        <div className="flex items-center justify-between px-2 pointer-events-auto">
          <div className="flex items-center gap-3">
            {/* Favorite Button */}
            <button
              onClick={() => onToggleFavorite(wallpaper.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl backdrop-blur-md border transition-all cursor-pointer ${
                isFavorite
                  ? 'bg-[#FF4D8D] border-[#FF4D8D] text-white shadow-lg shadow-[#FF4D8D]/30'
                  : 'bg-black/40 border-white/15 text-white hover:bg-black/60'
              }`}
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
              <span className="text-xs font-semibold">{wallpaper.stats.favorites}</span>
            </button>

            {/* Share Button */}
            <button
              onClick={handleShare}
              className="p-2.5 rounded-2xl bg-black/40 backdrop-blur-md border border-white/15 text-white hover:bg-black/60 transition-all cursor-pointer"
              title="Compartir"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            {/* Customizer / Crop / Blur Tool */}
            <button
              onClick={() => setShowEditorModal(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white transition-all cursor-pointer active:scale-95"
              title="Personalizar, recortar o desenfocar"
            >
              <Sliders className="w-4 h-4 text-[#00F2FE]" />
              <span className="text-xs font-semibold">Ajustar</span>
            </button>

            {/* Quick Download 4K */}
            <button
              onClick={() => onDownload(wallpaper, '4K')}
              className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white transition-all cursor-pointer active:scale-95"
            >
              <Download className="w-4 h-4 text-[#FF4D8D]" />
              <span className="text-xs font-semibold">4K UHD</span>
            </button>
          </div>
        </div>

        {/* PRIMARY ACTION BUTTON: APLICAR FONDO */}
        <div className="pointer-events-auto">
          <Button
            onClick={() => setShowApplyModal(true)}
            size="lg"
            variant="primary"
            leftIcon={<Sparkles className="w-5 h-5" />}
            className="w-full tracking-wider text-sm sm:text-base font-bold uppercase shadow-2xl shadow-[#FF4D8D]/35 cursor-pointer"
          >
            APLICAR FONDO
          </Button>
        </div>
      </div>

      {/* INFO DRAWER MODAL / SHEET */}
      {showInfoDrawer && (
        <div className="fixed inset-0 z-40 bg-black/70 backdrop-blur-md flex items-end sm:items-center justify-center animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-[#121622] border border-white/10 rounded-t-[32px] sm:rounded-3xl p-6 shadow-2xl max-h-[85vh] overflow-y-auto animate-in slide-in-from-bottom-6 duration-200 text-white">
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
              <div>
                <h4 className="text-base font-bold text-white">{wallpaper.title}</h4>
                {wallpaper.titleJp && (
                  <p className="text-xs text-slate-400 font-sans">{wallpaper.titleJp}</p>
                )}
              </div>
              <button
                onClick={() => setShowInfoDrawer(false)}
                className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed mb-4">{wallpaper.description}</p>

            {/* Specifications Grid */}
            <div className="grid grid-cols-2 gap-2.5 mb-5 text-xs">
              <div className="p-3 rounded-2xl bg-white/5 border border-white/5">
                <span className="text-slate-400 block text-[10px]">Resolución</span>
                <span className="font-semibold text-white">{wallpaper.resolution.width} × {wallpaper.resolution.height}</span>
              </div>
              <div className="p-3 rounded-2xl bg-white/5 border border-white/5">
                <span className="text-slate-400 block text-[10px]">Aspect Ratio</span>
                <span className="font-semibold text-white">{wallpaper.ratio} (Vertical)</span>
              </div>
              <div className="p-3 rounded-2xl bg-white/5 border border-white/5">
                <span className="text-slate-400 block text-[10px]">Descargas</span>
                <span className="font-semibold text-[#00F2FE]">{(wallpaper.stats.downloads).toLocaleString()}</span>
              </div>
              <div className="p-3 rounded-2xl bg-white/5 border border-white/5">
                <span className="text-slate-400 block text-[10px]">Calificación</span>
                <span className="font-semibold text-amber-400">★ {wallpaper.stats.rating} / 5.0</span>
              </div>
            </div>

            {/* Color Palette */}
            <div className="mb-5">
              <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5 mb-2">
                <Palette className="w-3.5 h-3.5 text-[#FF4D8D]" /> Paleta de Colores
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => copyHex(wallpaper.palette.dominant)}
                  style={{ backgroundColor: wallpaper.palette.dominant }}
                  className="h-9 flex-1 rounded-xl border border-white/20 flex items-center justify-center text-[10px] font-mono font-bold shadow transition-transform active:scale-95 cursor-pointer"
                >
                  {copiedColor === wallpaper.palette.dominant ? <Check className="w-3.5 h-3.5 text-white" /> : wallpaper.palette.dominant}
                </button>
                {wallpaper.palette.accents.map((c, i) => (
                  <button
                    key={i}
                    onClick={() => copyHex(c)}
                    style={{ backgroundColor: c }}
                    className="h-9 flex-1 rounded-xl border border-white/20 flex items-center justify-center text-[10px] font-mono font-bold shadow transition-transform active:scale-95 cursor-pointer"
                  >
                    {copiedColor === c ? <Check className="w-3.5 h-3.5 text-white" /> : c}
                  </button>
                ))}
              </div>
            </div>

            {/* Tags */}
            <div className="mb-5">
              <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5 mb-2">
                <Tag className="w-3.5 h-3.5 text-cyan-400" /> Etiquetas
              </span>
              <div className="flex flex-wrap gap-1.5">
                {wallpaper.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="text-[11px] px-2.5 py-1 rounded-xl bg-white/5 text-slate-300 border border-white/5"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* License and Creation Prompt */}
            <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5 text-[11px] space-y-1.5">
              <div className="flex items-center justify-between text-slate-400">
                <span>Autor / Fuente:</span>
                <span className="text-white font-medium">{wallpaper.source.creator}</span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span>Licencia:</span>
                <span className="text-emerald-400 font-medium">{wallpaper.source.license}</span>
              </div>
              {wallpaper.source.generationPrompt && (
                <div className="pt-2 border-t border-white/10 text-slate-400">
                  <span className="block font-semibold text-white/80 mb-0.5">Prompt original:</span>
                  <p className="italic text-[10px] line-clamp-3 text-slate-300">
                    "{wallpaper.source.generationPrompt}"
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* PHONE PREVIEW MODAL OVERLAY */}
      {showPhonePreview && (
        <div className="fixed inset-0 z-40 bg-black/85 backdrop-blur-md flex flex-col items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-sm flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-white">Simulador de Pantalla</span>
            <button
              onClick={() => setShowPhonePreview(false)}
              className="p-1.5 rounded-full bg-white/10 text-slate-300 hover:text-white"
            >
              ✕
            </button>
          </div>
          <PhonePreviewMockup wallpaper={wallpaper} onClose={() => setShowPhonePreview(false)} />
        </div>
      )}

      {/* APPLY WALLPAPER MODAL */}
      <ApplyWallpaperModal
        wallpaper={wallpaper}
        isOpen={showApplyModal}
        onClose={() => setShowApplyModal(false)}
        onSuccess={(msg) => onShowToast(msg, 'success')}
      />

      {/* WALLPAPER CUSTOMIZER & EDITOR MODAL */}
      {showEditorModal && (
        <WallpaperEditorModal
          wallpaper={wallpaper}
          onClose={() => setShowEditorModal(false)}
          onShowToast={onShowToast}
          onCustomDownload={(blobUrl, filename) => {
            setShowEditorModal(false);
            onShowToast('Imagen personalizada procesada', 'success');
          }}
        />
      )}
    </div>
  );
};

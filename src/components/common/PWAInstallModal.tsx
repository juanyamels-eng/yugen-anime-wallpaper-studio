import React, { useState } from 'react';
import { Smartphone, Download, Share, PlusSquare, X, CheckCircle2, ArrowRight } from 'lucide-react';
import { usePWAInstall } from '../../hooks/usePWAInstall';

interface PWAInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PWAInstallModal: React.FC<PWAInstallModalProps> = ({ isOpen, onClose }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleInstallClick = async () => {
    if (isInstallable) {
      const ok = await install();
      if (ok) onClose();
    }
  };

  const handleShareOrCopy = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Yūgen (幽玄) — Anime Wallpaper Studio',
          text: 'Descarga e instala fondos anime en 4K Ultra HD y AMOLED para tu smartphone.',
          url,
        });
      } catch (e) {
        // Ignored if user dismissed share dialog
      }
    } else {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-sm rounded-3xl bg-gradient-to-b from-[#161B28] to-[#0D1017] border border-white/15 p-6 shadow-2xl relative text-slate-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
          title="Cerrar"
        >
          <X className="w-4 h-4" />
        </button>

        {/* App Icon */}
        <div className="flex items-center gap-3.5 mb-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#FF4D8D] via-[#7928CA] to-[#00F2FE] p-0.5 shadow-lg shadow-[#FF4D8D]/30 shrink-0">
            <img src="/pwa-192x192.png" alt="Yūgen" className="w-full h-full rounded-[14px] object-cover" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-[#FF4D8D] tracking-wider uppercase">App Oficial</span>
            <h3 className="text-base font-extrabold text-white leading-tight">Instalar Yūgen en tu Celular</h3>
            <p className="text-[11px] text-slate-400">Sin tienda de apps · Rápida y sin ocupar espacio</p>
          </div>
        </div>

        {/* Benefits */}
        <div className="p-3 rounded-2xl bg-white/5 border border-white/10 mb-4 space-y-1.5 text-xs">
          <div className="flex items-center gap-2 text-slate-300">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#00F2FE] shrink-0" />
            <span>Acceso directo desde tu pantalla de inicio</span>
          </div>
          <div className="flex items-center gap-2 text-slate-300">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#00F2FE] shrink-0" />
            <span>Descargas ultra rápidas en 4K y modo offline</span>
          </div>
          <div className="flex items-center gap-2 text-slate-300">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#00F2FE] shrink-0" />
            <span>Pantalla completa inmersiva a 60 FPS sin barras</span>
          </div>
        </div>

        {/* Steps based on platform */}
        {isIOS ? (
          <div className="space-y-2.5 text-xs text-slate-300 mb-5">
            <div className="flex items-start gap-2.5 p-2 rounded-xl bg-white/[0.03]">
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[#FF4D8D]/20 text-[#FF4D8D] text-[11px] font-bold shrink-0">1</span>
              <span>Toca el botón <strong>Compartir</strong> <Share className="inline w-3.5 h-3.5 mx-0.5 text-[#00F2FE]" /> en la barra inferior de Safari.</span>
            </div>
            <div className="flex items-start gap-2.5 p-2 rounded-xl bg-white/[0.03]">
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[#FF4D8D]/20 text-[#FF4D8D] text-[11px] font-bold shrink-0">2</span>
              <span>Desliza hacia abajo y presiona <strong>"Agregar a pantalla de inicio"</strong> <PlusSquare className="inline w-3.5 h-3.5 mx-0.5 text-[#FF4D8D]" />.</span>
            </div>
            <div className="flex items-start gap-2.5 p-2 rounded-xl bg-white/[0.03]">
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 text-[11px] font-bold shrink-0">3</span>
              <span>Presiona <strong>"Agregar"</strong> arriba a la derecha. ¡Listo!</span>
            </div>
          </div>
        ) : isInstallable ? (
          <div className="space-y-3 mb-5">
            <p className="text-xs text-slate-300">
              Pulsa el botón de abajo para añadir la app directamente a tu cajón de aplicaciones:
            </p>
            <button
              onClick={handleInstallClick}
              className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-[#FF4D8D] to-[#EC4899] text-white font-extrabold text-sm flex items-center justify-center gap-2 hover:brightness-110 active:scale-95 shadow-lg shadow-[#FF4D8D]/30 transition-all cursor-pointer"
            >
              <Smartphone className="w-4 h-4" />
              <span>Instalar Yūgen Ahora</span>
            </button>
          </div>
        ) : (
          <div className="space-y-2.5 text-xs text-slate-300 mb-5">
            <div className="flex items-start gap-2.5 p-2 rounded-xl bg-white/[0.03]">
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[#FF4D8D]/20 text-[#FF4D8D] text-[11px] font-bold shrink-0">1</span>
              <span>En tu navegador (Chrome/Edge/Samsung), toca los <strong>3 puntos (⋮)</strong> del menú.</span>
            </div>
            <div className="flex items-start gap-2.5 p-2 rounded-xl bg-white/[0.03]">
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[#FF4D8D]/20 text-[#FF4D8D] text-[11px] font-bold shrink-0">2</span>
              <span>Selecciona <strong>"Instalar aplicación"</strong> o <strong>"Añadir a pantalla de inicio"</strong>.</span>
            </div>
          </div>
        )}

        {/* Share Link Button */}
        <div className="pt-2 border-t border-white/10 flex gap-2">
          <button
            onClick={handleShareOrCopy}
            className="flex-1 py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-semibold text-white flex items-center justify-center gap-1.5 transition-colors"
          >
            <Share className="w-3.5 h-3.5 text-[#00F2FE]" />
            <span>{copied ? '¡Enlace copiado!' : 'Compartir con un amigo'}</span>
          </button>
          <button
            onClick={onClose}
            className="py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-medium text-slate-400 hover:text-white transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

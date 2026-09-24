import React, { useState } from 'react';
import { Smartphone, Download, Sparkles, X, Check } from 'lucide-react';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import { PWAInstallModal } from './PWAInstallModal';

export const InstallBannerCallout: React.FC = () => {
  const { isInstalled, isInstallable, install } = usePWAInstall();
  const [dismissed, setDismissed] = useState(() => {
    try {
      return localStorage.getItem('yugen_install_banner_dismissed') === 'true';
    } catch {
      return false;
    }
  });
  const [showModal, setShowModal] = useState(false);

  // If app is already installed in standalone mode or user closed it
  if (isInstalled || dismissed) {
    return null;
  }

  const handleDismiss = () => {
    setDismissed(true);
    try {
      localStorage.setItem('yugen_install_banner_dismissed', 'true');
    } catch {}
  };

  const handleAction = async () => {
    if (isInstallable) {
      const ok = await install();
      if (ok) handleDismiss();
    } else {
      setShowModal(true);
    }
  };

  return (
    <>
      <div className="mx-4 my-3 p-3.5 rounded-2xl bg-gradient-to-r from-[#171B2A] via-[#1F2335] to-[#171B2A] border border-[#FF4D8D]/30 shadow-lg relative overflow-hidden animate-in fade-in">
        {/* Glow ambient */}
        <div className="absolute -right-8 -top-8 w-28 h-28 bg-[#FF4D8D]/15 rounded-full blur-2xl pointer-events-none" />

        <button
          onClick={handleDismiss}
          className="absolute top-2.5 right-2.5 p-1 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          title="Ocultar aviso"
        >
          <X className="w-3.5 h-3.5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-[#FF4D8D] to-[#00F2FE] p-0.5 shrink-0 shadow-md">
            <img src="/pwa-192x192.png" alt="Yūgen" className="w-full h-full rounded-[10px] object-cover" />
          </div>

          <div className="flex-1 min-w-0 pr-4">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#FF4D8D] flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5" /> Versión Oficial
              </span>
            </div>
            <h4 className="text-xs font-bold text-white truncate">Instala Yūgen en tu Celular</h4>
            <p className="text-[11px] text-slate-300 line-clamp-1">
              Úsala a pantalla completa con descargas directas 4K
            </p>
          </div>

          <button
            onClick={handleAction}
            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#FF4D8D] to-[#EC4899] text-white text-xs font-bold shrink-0 hover:brightness-110 active:scale-95 transition-all shadow-md shadow-[#FF4D8D]/20 cursor-pointer flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Instalar</span>
          </button>
        </div>
      </div>

      <PWAInstallModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </>
  );
};

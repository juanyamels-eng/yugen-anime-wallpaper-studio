import React, { useState } from 'react';
import { Smartphone } from 'lucide-react';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import { PWAInstallModal } from './PWAInstallModal';

export const PWAInstallButton: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showModal, setShowModal] = useState(false);

  // If already running in standalone/installed mode, don't show the install button
  if (isInstalled) {
    return null;
  }

  // Native Android/Chrome prompt
  if (isInstallable) {
    return (
      <>
        <button
          onClick={install}
          className={`flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#FF4D8D] to-[#EC4899] text-white font-bold cursor-pointer transition-all hover:brightness-110 active:scale-95 shadow-md shadow-[#FF4D8D]/25 ${
            compact ? 'px-2.5 py-1.5 text-[11px]' : 'px-4 py-2 text-xs'
          }`}
          title="Instalar Yūgen en tu dispositivo"
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span>{compact ? 'Instalar' : 'Descargar App'}</span>
        </button>
      </>
    );
  }

  // Universal button (iOS or general mobile/desktop browser)
  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className={`flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#FF4D8D] to-[#EC4899] text-white font-bold cursor-pointer transition-all hover:brightness-110 active:scale-95 shadow-md shadow-[#FF4D8D]/25 ${
          compact ? 'px-2.5 py-1.5 text-[11px]' : 'px-4 py-2 text-xs'
        }`}
        title="Instalar Yūgen en tu pantalla de inicio"
      >
        <Smartphone className="w-3.5 h-3.5" />
        <span>{compact ? 'Instalar' : 'Descargar App'}</span>
      </button>

      <PWAInstallModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </>
  );
};

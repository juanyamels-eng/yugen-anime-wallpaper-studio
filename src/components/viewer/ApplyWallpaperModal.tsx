import React, { useState } from 'react';
import { Smartphone, Lock, CheckCircle2, ShieldCheck, Download, Loader2 } from 'lucide-react';
import { Wallpaper } from '../../types/wallpaper.types';
import { WallpaperApplierService } from '../../services/wallpaperApplier';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';

interface ApplyWallpaperModalProps {
  wallpaper: Wallpaper;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (message: string) => void;
}

export const ApplyWallpaperModal: React.FC<ApplyWallpaperModalProps> = ({
  wallpaper,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [target, setTarget] = useState<'home' | 'lock' | 'both'>('both');
  const [quality, setQuality] = useState<'uhd4k' | 'fhd'>('uhd4k');
  const [isApplying, setIsApplying] = useState(false);

  const handleApply = async () => {
    setIsApplying(true);
    const targetUrl = quality === 'uhd4k' ? wallpaper.urls.uhd4k : wallpaper.urls.fhd;

    try {
      const result = await WallpaperApplierService.applyWallpaper(wallpaper.title, targetUrl, {
        target,
        quality,
      });

      setIsApplying(false);
      onClose();
      onSuccess(result.message);
    } catch {
      setIsApplying(false);
      onClose();
      onSuccess('Fondo descargado. Ábrelo desde la galería de tu teléfono para aplicarlo.');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Establecer Fondo de Pantalla" maxWidth="md">
      <div className="space-y-5 text-slate-200">
        <p className="text-xs sm:text-sm text-slate-400">
          Selecciona en qué pantalla de tu dispositivo deseas aplicar <strong className="text-white">{wallpaper.title}</strong>:
        </p>

        {/* Target Options */}
        <div className="grid grid-cols-3 gap-2.5">
          <button
            type="button"
            onClick={() => setTarget('home')}
            className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-center transition-all cursor-pointer ${
              target === 'home'
                ? 'bg-[#FF4D8D]/15 border-[#FF4D8D] text-white shadow-lg shadow-[#FF4D8D]/20'
                : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
            }`}
          >
            <Smartphone className={`w-6 h-6 mb-1.5 ${target === 'home' ? 'text-[#FF4D8D]' : 'text-slate-400'}`} />
            <span className="text-xs font-semibold">Inicio</span>
            <span className="text-[10px] text-slate-400">Home Screen</span>
          </button>

          <button
            type="button"
            onClick={() => setTarget('lock')}
            className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-center transition-all cursor-pointer ${
              target === 'lock'
                ? 'bg-[#00F2FE]/15 border-[#00F2FE] text-white shadow-lg shadow-[#00F2FE]/20'
                : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
            }`}
          >
            <Lock className={`w-6 h-6 mb-1.5 ${target === 'lock' ? 'text-[#00F2FE]' : 'text-slate-400'}`} />
            <span className="text-xs font-semibold">Bloqueo</span>
            <span className="text-[10px] text-slate-400">Lock Screen</span>
          </button>

          <button
            type="button"
            onClick={() => setTarget('both')}
            className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-center transition-all cursor-pointer ${
              target === 'both'
                ? 'bg-gradient-to-tr from-[#FF4D8D]/20 to-[#7928CA]/20 border-[#FF4D8D] text-white shadow-lg'
                : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
            }`}
          >
            <div className="flex items-center gap-1 mb-1.5">
              <Lock className={`w-4 h-4 ${target === 'both' ? 'text-[#FF4D8D]' : 'text-slate-400'}`} />
              <Smartphone className={`w-4 h-4 ${target === 'both' ? 'text-[#FF4D8D]' : 'text-slate-400'}`} />
            </div>
            <span className="text-xs font-semibold">Ambas</span>
            <span className="text-[10px] text-slate-400">Pantallas</span>
          </button>
        </div>

        {/* Quality Selector */}
        <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-white">
            <span>Resolución de descarga:</span>
            <span className="text-[#00F2FE]">{quality === 'uhd4k' ? '1440 × 3200 (4K UHD)' : '1080 × 2400 (FHD)'}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setQuality('uhd4k')}
              className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                quality === 'uhd4k'
                  ? 'bg-[#FF4D8D] border-[#FF4D8D] text-white'
                  : 'bg-transparent border-white/10 text-slate-400 hover:text-white'
              }`}
            >
              4K Ultra HD (Máx. Calidad)
            </button>
            <button
              type="button"
              onClick={() => setQuality('fhd')}
              className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                quality === 'fhd'
                  ? 'bg-[#00F2FE] border-[#00F2FE] text-black'
                  : 'bg-transparent border-white/10 text-slate-400 hover:text-white'
              }`}
            >
              FHD (Ahorro de datos)
            </button>
          </div>
        </div>

        {/* Native Android / System Instructions */}
        <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-black/40 border border-white/5 text-[11px] text-slate-300">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <p>
            Al pulsar el botón, el archivo se optimiza y descarga directamente en tu smartphone. En Android, la app te asistirá o podrás abrir la imagen en Galería y presionar <strong className="text-white">"Establecer como fondo"</strong>.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 pt-2">
          <Button variant="ghost" size="md" onClick={onClose} className="flex-1">
            Cancelar
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={handleApply}
            isLoading={isApplying}
            leftIcon={<Download className="w-4 h-4" />}
            className="flex-2"
          >
            {isApplying ? 'Preparando fondo...' : 'APLICAR FONDO AHORA'}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

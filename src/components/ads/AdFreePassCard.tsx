import React, { useState, useEffect } from 'react';
import { Sparkles, ShieldCheck, PlayCircle, Clock } from 'lucide-react';
import { adService } from '../../services/adService';

interface AdFreePassCardProps {
  onRequestWatchAd: () => void;
  className?: string;
}

export const AdFreePassCard: React.FC<AdFreePassCardProps> = ({ onRequestWatchAd, className = '' }) => {
  const [isAdFree, setIsAdFree] = useState(() => adService.isAdFreeActive());
  const [minutesRemaining, setMinutesRemaining] = useState(() => adService.getAdFreeRemainingMinutes());

  useEffect(() => {
    const update = () => {
      setIsAdFree(adService.isAdFreeActive());
      setMinutesRemaining(adService.getAdFreeRemainingMinutes());
    };

    update();
    const interval = setInterval(update, 30000);
    return () => clearInterval(interval);
  }, []);

  if (isAdFree) {
    return (
      <div
        className={`p-4 rounded-3xl bg-gradient-to-r from-emerald-950/40 via-[#121622] to-teal-950/40 border border-emerald-500/30 flex items-center justify-between gap-3 shadow-lg ${className}`}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-white">Pase Sin Anuncios Activo</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold">
                VIP
              </span>
            </div>
            <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
              <Clock className="w-3 h-3 text-emerald-400" />
              <span>Te quedan {minutesRemaining} minutos de navegación 100% limpia.</span>
            </p>
          </div>
        </div>

        <button
          onClick={onRequestWatchAd}
          className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-[11px] font-semibold text-slate-300 hover:text-white transition-colors cursor-pointer shrink-0"
        >
          +2 Horas
        </button>
      </div>
    );
  }

  return (
    <div
      className={`p-4 rounded-3xl bg-gradient-to-r from-[#1A0B2E] via-[#121622] to-[#0A1628] border border-white/10 flex items-center justify-between gap-3 shadow-xl ${className}`}
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#00F2FE]/20 to-[#7928CA]/20 border border-[#00F2FE]/30 flex items-center justify-center text-[#00F2FE] shrink-0">
          <Sparkles className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
            <span>¿Prefieres navegar sin anuncios?</span>
          </h4>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Mira 1 video corto recompensado y obtén <strong className="text-white">2 horas continuas</strong> libres de banners.
          </p>
        </div>
      </div>

      <button
        onClick={onRequestWatchAd}
        className="px-3.5 py-2 rounded-2xl bg-gradient-to-r from-[#00F2FE] to-[#7928CA] hover:from-[#00F2FE]/90 hover:to-[#7928CA]/90 text-white font-bold text-xs shadow-md shadow-[#00F2FE]/15 flex items-center gap-1.5 shrink-0 active:scale-95 transition-all cursor-pointer"
      >
        <PlayCircle className="w-3.5 h-3.5" />
        <span>Activar Pase</span>
      </button>
    </div>
  );
};

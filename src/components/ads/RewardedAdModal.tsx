import React, { useState, useEffect } from 'react';
import {
  X,
  Volume2,
  VolumeX,
  Sparkles,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  AlertTriangle,
  Info,
} from 'lucide-react';
import { adService } from '../../services/adService';
import { AdChoicesModal } from './AdChoicesModal';

interface RewardedAdModalProps {
  isOpen: boolean;
  rewardTitle: string;
  onRewardGranted: () => void;
  onClose: () => void;
}

const SAMPLE_CAMPAIGNS = [
  {
    sponsor: 'Honkai: Star Rail',
    tagline: 'Súbete al Expreso Astral • Descarga Gratis',
    mediaUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=1000&q=80',
    videoType: 'image_banner',
    cta: 'Jugar Ahora',
    ctaUrl: 'https://genshin.hoyoverse.com',
    rating: '4.9 ★ (1.2M)',
    badge: 'Juego del Año',
  },
  {
    sponsor: 'Cyberpunk Edgerunners Hub',
    tagline: 'Únete a la red neural de Night City • Evento Anime 2026',
    mediaUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=1000&q=80',
    videoType: 'image_banner',
    cta: 'Explorar Lore',
    ctaUrl: 'https://www.cyberpunk.net',
    rating: '4.8 ★ (850K)',
    badge: 'Tendencia Anime',
  },
  {
    sponsor: 'Crunchyroll Mega Fan',
    tagline: 'Miles de episodios sin anuncios en simulcast japonés',
    mediaUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1000&q=80',
    videoType: 'image_banner',
    cta: '14 Días Gratis',
    ctaUrl: 'https://www.crunchyroll.com',
    rating: '4.7 ★ (3.4M)',
    badge: 'Simulcast Oficial',
  },
];

export const RewardedAdModal: React.FC<RewardedAdModalProps> = ({
  isOpen,
  rewardTitle,
  onRewardGranted,
  onClose,
}) => {
  const [secondsRemaining, setSecondsRemaining] = useState(8);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showExitWarning, setShowExitWarning] = useState(false);
  const [showChoicesModal, setShowChoicesModal] = useState(false);
  const [campaign] = useState(() => SAMPLE_CAMPAIGNS[Math.floor(Math.random() * SAMPLE_CAMPAIGNS.length)]);

  useEffect(() => {
    if (!isOpen) {
      setSecondsRemaining(8);
      setIsCompleted(false);
      setShowExitWarning(false);
      return;
    }

    adService.recordImpression('rewarded');

    const timer = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsCompleted(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleClaim = () => {
    onRewardGranted();
    onClose();
  };

  const handleAttemptClose = () => {
    if (isCompleted) {
      handleClaim();
    } else {
      setShowExitWarning(true);
    }
  };

  const handleClickAd = () => {
    adService.recordClick();
    window.open(campaign.ctaUrl, '_blank', 'noopener,noreferrer');
  };

  const progressPercent = ((8 - secondsRemaining) / 8) * 100;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-[#0D1017] border border-white/15 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        {/* Ad Header Bar */}
        <div className="px-4 py-3 bg-[#121622]/90 border-b border-white/10 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="px-1.5 py-0.5 rounded text-[10px] font-black bg-amber-400 text-black uppercase tracking-wider">
              Anuncio Recompensado
            </span>
            <span className="text-slate-400 text-[11px] truncate max-w-[130px]" title={rewardTitle}>
              {rewardTitle}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowChoicesModal(true)}
              className="p-1 rounded-full text-slate-400 hover:text-white transition-colors"
              title="Opciones de Anuncio"
            >
              <Info className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => setIsMuted(!isMuted)}
              className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 transition-colors"
              title={isMuted ? 'Activar sonido' : 'Silenciar'}
            >
              {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
            </button>

            {isCompleted ? (
              <button
                onClick={handleClaim}
                className="p-1 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors cursor-pointer"
                title="Cerrar y canjear"
              >
                <X className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleAttemptClose}
                className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/60 hover:bg-white/10 border border-white/15 text-[11px] font-mono text-slate-300 transition-colors"
              >
                <span>{secondsRemaining}s</span>
                <X className="w-3.5 h-3.5 text-slate-400" />
              </button>
            )}
          </div>
        </div>

        {/* Countdown Progress Bar */}
        <div className="w-full bg-white/10 h-1">
          <div
            className="h-full bg-gradient-to-r from-[#00F2FE] via-[#7928CA] to-[#FF4D8D] transition-all duration-1000 ease-linear"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Video / Creative Viewport */}
        <div className="relative flex-1 min-h-[260px] bg-slate-950 overflow-hidden flex items-center justify-center group cursor-pointer" onClick={handleClickAd}>
          <img
            src={campaign.mediaUrl}
            alt={campaign.sponsor}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0D1017] via-transparent to-black/30" />

          {/* Floating badge */}
          <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/10 text-[11px] font-semibold text-white flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>{campaign.badge}</span>
          </div>

          {/* Live AdMob simulation watermark */}
          <div className="absolute top-3 right-3 px-2 py-0.5 rounded bg-black/60 backdrop-blur-md text-[9px] text-slate-400 font-mono flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-emerald-400" />
            <span>Google AdMob SDK</span>
          </div>

          {/* Bottom Card Overlay */}
          <div className="absolute bottom-3 inset-x-3 p-3 rounded-2xl bg-[#121622]/85 backdrop-blur-md border border-white/15 flex items-center justify-between">
            <div className="pr-2 min-w-0">
              <h4 className="text-sm font-bold text-white leading-tight flex items-center gap-1.5 truncate">
                {campaign.sponsor}
              </h4>
              <p className="text-[11px] text-slate-300 line-clamp-1 mt-0.5">{campaign.tagline}</p>
              <span className="text-[10px] text-amber-400 font-semibold">{campaign.rating}</span>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                handleClickAd();
              }}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#00F2FE] to-[#0080FF] text-black font-bold text-xs shadow-lg flex items-center gap-1 shrink-0 active:scale-95 transition-transform cursor-pointer"
            >
              <span>{campaign.cta}</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Footer & Reward Action */}
        <div className="p-4 bg-[#121622] border-t border-white/10 flex flex-col gap-3">
          {isCompleted ? (
            <div className="flex flex-col gap-2 animate-in slide-in-from-bottom-2 duration-300">
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold">
                <CheckCircle2 className="w-4 h-4" />
                <span>¡Anuncio completado! Recompensa lista para desbloquear.</span>
              </div>
              <button
                onClick={handleClaim}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#FF4D8D] to-[#7928CA] text-white font-bold text-sm shadow-xl shadow-[#FF4D8D]/25 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Desbloquear {rewardTitle}</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Mira el video completo para desbloquear gratis</span>
              <span className="font-mono text-white font-bold">{secondsRemaining}s</span>
            </div>
          )}
        </div>

        {/* Google Play Early Exit Safeguard Modal */}
        {showExitWarning && (
          <div className="absolute inset-0 z-20 bg-black/85 backdrop-blur-sm p-6 flex flex-col items-center justify-center text-center animate-in fade-in duration-150">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-3">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-white mb-1.5">¿Salir sin recompensa?</h4>
            <p className="text-xs text-slate-300 mb-5 max-w-xs leading-relaxed">
              Faltan solo <span className="font-bold text-[#00F2FE]">{secondsRemaining} segundos</span>. Si sales ahora no se desbloqueará tu beneficio.
            </p>
            <div className="flex flex-col w-full gap-2.5">
              <button
                onClick={() => setShowExitWarning(false)}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#00F2FE] to-[#7928CA] text-white font-bold text-xs shadow-lg active:scale-95 transition-transform cursor-pointer"
              >
                Continuar Viendo ({secondsRemaining}s)
              </button>
              <button
                onClick={() => {
                  setShowExitWarning(false);
                  onClose();
                }}
                className="w-full py-2 rounded-xl bg-white/10 hover:bg-white/15 text-slate-300 text-xs font-semibold transition-colors cursor-pointer"
              >
                Salir de Todos Modos
              </button>
            </div>
          </div>
        )}
      </div>

      {showChoicesModal && (
        <AdChoicesModal
          isOpen={showChoicesModal}
          adTitle={campaign.sponsor}
          onClose={() => setShowChoicesModal(false)}
        />
      )}
    </div>
  );
};

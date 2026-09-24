import React, { useState, useEffect } from 'react';
import { X, ExternalLink, ShieldCheck, Info } from 'lucide-react';
import { adService } from '../../services/adService';
import { AdChoicesModal } from './AdChoicesModal';

interface InterstitialAdModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const INTERSTITIAL_CAMPAIGNS = [
  {
    title: 'Manga & Anime Reader Plus',
    tagline: 'Capítulos simultáneos con Japón, descargas offline y calidad Ultra HD para móviles.',
    cta: 'Instalar Gratis',
    url: 'https://play.google.com',
    imageUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&q=80',
    developer: 'Anime Studio Apps Inc.',
  },
  {
    title: 'Mecha Arena: Origins 2026',
    tagline: 'Batallas tácticas PvP 5v5 con robots gigantes y animación en tiempo real cel-shaded.',
    cta: 'Jugar Ahora',
    url: 'https://play.google.com',
    imageUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800&q=80',
    developer: 'Tokyo Cyber Games',
  },
];

export const InterstitialAdModal: React.FC<InterstitialAdModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [secondsRemaining, setSecondsRemaining] = useState(4);
  const [canSkip, setCanSkip] = useState(false);
  const [showChoicesModal, setShowChoicesModal] = useState(false);
  const [campaign] = useState(() => INTERSTITIAL_CAMPAIGNS[Math.floor(Math.random() * INTERSTITIAL_CAMPAIGNS.length)]);

  useEffect(() => {
    if (!isOpen) {
      setSecondsRemaining(4);
      setCanSkip(false);
      return;
    }

    adService.recordImpression('interstitial');

    const timer = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setCanSkip(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleClickAd = () => {
    adService.recordClick();
    window.open(campaign.url, '_blank', 'noopener,noreferrer');
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-2xl p-4 animate-in fade-in duration-200">
        <div className="relative w-full max-w-sm bg-[#0E121B] border border-white/15 rounded-3xl overflow-hidden shadow-2xl flex flex-col">
          {/* Top Controls with Google Play Compliance */}
          <div className="px-4 py-2.5 bg-[#141926] border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Google AdMob Interstitial</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowChoicesModal(true);
                }}
                className="p-0.5 text-slate-400 hover:text-white transition-colors"
                title="Opciones de Anuncio"
              >
                <Info className="w-3 h-3" />
              </button>
            </div>

            {canSkip ? (
              <button
                onClick={onClose}
                className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 hover:bg-white/30 text-white text-xs font-bold transition-all cursor-pointer shadow-sm active:scale-95"
              >
                <span>Saltar Anuncio</span>
                <X className="w-3.5 h-3.5" />
              </button>
            ) : (
              <div className="flex items-center gap-1 text-xs text-slate-400 font-mono">
                <span>Saltar en</span>
                <span className="text-[#00F2FE] font-bold">{secondsRemaining}s</span>
              </div>
            )}
          </div>

          {/* Ad Body */}
          <div className="p-4 flex flex-col gap-3 cursor-pointer group" onClick={handleClickAd}>
            <div className="relative rounded-2xl overflow-hidden aspect-[4/3] bg-black">
              <img
                src={campaign.imageUrl}
                alt={campaign.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-2 left-2 flex items-center gap-1 px-1.5 py-0.5 rounded bg-black/80 text-[9px] text-amber-300 font-black uppercase tracking-wider border border-white/10">
                <span>ANUNCIO</span>
              </div>
              <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/60 backdrop-blur-md text-[9px] text-slate-300">
                {campaign.developer}
              </div>
            </div>

            <div>
              <h3 className="text-base font-bold text-white leading-snug group-hover:text-[#00F2FE] transition-colors">
                {campaign.title}
              </h3>
              <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                {campaign.tagline}
              </p>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                handleClickAd();
              }}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#00F2FE] to-[#7928CA] text-white font-bold text-xs shadow-lg flex items-center justify-center gap-1.5 transition-transform active:scale-95 cursor-pointer"
            >
              <span>{campaign.cta}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {showChoicesModal && (
        <AdChoicesModal
          isOpen={showChoicesModal}
          adTitle={campaign.title}
          onClose={() => setShowChoicesModal(false)}
        />
      )}
    </>
  );
};

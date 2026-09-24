import React, { useEffect, useState } from 'react';
import { ExternalLink, Sparkles, Info, ShieldCheck } from 'lucide-react';
import { adService } from '../../services/adService';
import { AdChoicesModal } from './AdChoicesModal';

interface NativeBannerAdProps {
  variant?: 'feed' | 'compact' | 'sticker';
  className?: string;
}

const SPONSORS = [
  {
    id: 'genshin-5',
    title: 'Genshin Impact 5.0 - Natlan',
    description: 'Explora la nación de los dragones y Pyro. ¡Descárgalo gratis en Google Play!',
    cta: 'Jugar Gratis',
    url: 'https://genshin.hoyoverse.com',
    imageUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&q=80',
    advertiser: 'HoYoverse Verified Partner',
  },
  {
    id: 'vpn-anime',
    title: 'CyberShield VPN Anime 2026',
    description: 'Baja latencia a servidores de Tokio para streaming anime y gaming sin restricciones.',
    cta: 'Explorar VPN',
    url: 'https://nordvpn.com',
    imageUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=600&q=80',
    advertiser: 'CyberShield Network Inc.',
  },
  {
    id: 'gear-rgb',
    title: 'MechaKeyboards RGB Ed. Limitada',
    description: 'Switches mecánicos lubricados y keycaps con estética anime cyberpunk.',
    cta: 'Ver Catálogo',
    url: 'https://razer.com',
    imageUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&q=80',
    advertiser: 'MechaTech Global',
  },
];

export const NativeBannerAd: React.FC<NativeBannerAdProps> = ({ variant = 'feed', className = '' }) => {
  const adConfig = adService.getConfig();
  const isAdFree = adService.isAdFreeActive();
  const [isDismissed, setIsDismissed] = useState(false);
  const [showChoicesModal, setShowChoicesModal] = useState(false);
  const [sponsorIndex] = useState(() => Math.floor(Math.random() * SPONSORS.length));

  useEffect(() => {
    if (adConfig.enabled && !isAdFree && !isDismissed) {
      adService.recordImpression('banner');
    }
  }, [adConfig.enabled, isAdFree, isDismissed]);

  if (!adConfig.enabled || isAdFree || isDismissed) return null;

  const sponsor = SPONSORS[sponsorIndex];

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    adService.recordClick();
    window.open(sponsor.url, '_blank', 'noopener,noreferrer');
  };

  const handleOpenChoices = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowChoicesModal(true);
  };

  if (variant === 'compact') {
    return (
      <>
        <div
          onClick={handleClick}
          className={`w-full my-3 p-3 rounded-2xl bg-gradient-to-r from-[#121622] via-[#161B28] to-[#121622] border border-white/10 flex items-center justify-between gap-3 cursor-pointer hover:border-[#00F2FE]/40 transition-all shadow-md group ${className}`}
        >
          <div className="flex items-center gap-3 min-w-0">
            <img
              src={sponsor.imageUrl}
              alt={sponsor.title}
              className="w-11 h-11 rounded-xl object-cover border border-white/10 shrink-0"
            />
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-amber-400 text-black uppercase tracking-wider">
                  ANUNCIO
                </span>
                <span className="text-[10px] text-slate-400 truncate">{sponsor.advertiser}</span>
              </div>
              <h4 className="text-xs font-bold text-white group-hover:text-[#00F2FE] transition-colors truncate">
                {sponsor.title}
              </h4>
              <p className="text-[10px] text-slate-400 line-clamp-1">{sponsor.description}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleOpenChoices}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              title="Información de AdChoices"
            >
              <Info className="w-3.5 h-3.5" />
            </button>
            <button className="px-2.5 py-1.5 rounded-lg bg-[#00F2FE]/10 hover:bg-[#00F2FE]/20 text-[11px] font-semibold text-[#00F2FE] flex items-center gap-1">
              <span>{sponsor.cta}</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        </div>

        {showChoicesModal && (
          <AdChoicesModal
            isOpen={showChoicesModal}
            adTitle={sponsor.title}
            onClose={() => setShowChoicesModal(false)}
            onReported={() => {
              setIsDismissed(true);
              setShowChoicesModal(false);
            }}
          />
        )}
      </>
    );
  }

  return (
    <>
      <div
        onClick={handleClick}
        className={`w-full my-4 rounded-3xl bg-[#121622] border border-white/10 overflow-hidden shadow-xl cursor-pointer hover:border-white/25 transition-all group ${className}`}
      >
        {/* Ad Attribution Header */}
        <div className="px-3.5 py-1.5 bg-[#0D1017] border-b border-white/5 flex items-center justify-between text-[10px]">
          <div className="flex items-center gap-1.5">
            <span className="px-1.5 py-0.5 rounded bg-amber-400 text-black font-black uppercase tracking-wider text-[9px]">
              ANUNCIO
            </span>
            <span className="text-slate-400 font-mono text-[10px] truncate">{sponsor.advertiser}</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 text-[9px] text-slate-400 font-mono">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              <span>Google AdMob</span>
            </div>
            <button
              onClick={handleOpenChoices}
              className="p-0.5 text-slate-400 hover:text-white transition-colors"
              title="Opciones de Anuncio (AdChoices)"
            >
              <Info className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Ad Image / Media */}
        <div className="relative h-28 w-full overflow-hidden bg-slate-900">
          <img
            src={sponsor.imageUrl}
            alt={sponsor.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#121622] via-black/20 to-transparent" />
          <div className="absolute top-2.5 left-3 flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-black/70 backdrop-blur-md border border-white/15 text-[9px] font-bold text-amber-300">
            <Sparkles className="w-3 h-3" />
            <span>PATROCINADO</span>
          </div>
        </div>

        {/* Details & CTA */}
        <div className="p-3.5 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <h4 className="text-sm font-bold text-white group-hover:text-[#00F2FE] transition-colors truncate">
              {sponsor.title}
            </h4>
            <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">{sponsor.description}</p>
          </div>

          <button className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#00F2FE] to-[#7928CA] text-white font-bold text-xs shadow-md shrink-0 flex items-center gap-1 active:scale-95 transition-transform">
            <span>{sponsor.cta}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {showChoicesModal && (
        <AdChoicesModal
          isOpen={showChoicesModal}
          adTitle={sponsor.title}
          onClose={() => setShowChoicesModal(false)}
          onReported={() => {
            setIsDismissed(true);
            setShowChoicesModal(false);
          }}
        />
      )}
    </>
  );
};

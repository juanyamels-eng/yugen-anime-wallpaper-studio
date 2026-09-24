import React, { useState } from 'react';
import { X, ShieldCheck, Info, Flag, Check, EyeOff, ExternalLink } from 'lucide-react';
import { adService } from '../../services/adService';

interface AdChoicesModalProps {
  isOpen: boolean;
  onClose: () => void;
  adTitle?: string;
  onReported?: (reason: string) => void;
}

export const AdChoicesModal: React.FC<AdChoicesModalProps> = ({
  isOpen,
  onClose,
  adTitle = 'Anuncio Patrocinado',
  onReported,
}) => {
  const [config, setConfig] = useState(() => adService.getConfig());
  const [reportReason, setReportReason] = useState<string | null>(null);
  const [isReportSubmitted, setIsReportSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleTogglePersonalization = (granted: boolean) => {
    adService.setPersonalizedAdsConsent(granted);
    setConfig(adService.getConfig());
  };

  const handleSendReport = (reason: string) => {
    setReportReason(reason);
    setIsReportSubmitted(true);
    if (onReported) {
      onReported(reason);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-[#0F131D] border border-white/15 rounded-3xl overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="px-5 py-4 bg-[#141926] border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#00F2FE]/10 border border-[#00F2FE]/30 flex items-center justify-center text-[#00F2FE]">
              <Info className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Transparencia y Opciones de Anuncio</h3>
              <p className="text-[11px] text-slate-400">Google AdMob & AdChoices Compliance</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Ad Info Card */}
          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-semibold text-slate-300">Anuncio actual:</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                Verificado Google AdMob
              </span>
            </div>
            <p className="text-sm font-bold text-white truncate">{adTitle}</p>
            <p className="text-[11px] text-slate-400 mt-1">
              Este espacio publicitario sostiene el acceso gratuito y libre a wallpapers en alta resolución. Cumple con los estándares de Better Ads de Google Play.
            </p>
          </div>

          {/* Why am I seeing this? */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#00F2FE]" />
              <span>¿Por qué veo este anuncio?</span>
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Los anuncios se seleccionan por categoría de contenido anime/tecnología y, si diste tu consentimiento, de acuerdo a tus preferencias generales de navegación.
            </p>
          </div>

          {/* Privacy & Personalization Toggle */}
          <div className="p-4 rounded-2xl bg-[#121622] border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-white block">Anuncios Personalizados</span>
                <span className="text-[11px] text-slate-400">
                  {config.personalizedAdsConsent
                    ? 'Relevantes según tus intereses (Consentimiento UMP activo)'
                    : 'Solo anuncios genéricos y contextuales (Sin seguimiento)'}
                </span>
              </div>
              <button
                onClick={() => handleTogglePersonalization(!config.personalizedAdsConsent)}
                className={`w-11 h-6 rounded-full p-1 transition-colors ${
                  config.personalizedAdsConsent ? 'bg-[#00F2FE]' : 'bg-white/20'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-black transition-transform ${
                    config.personalizedAdsConsent ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Report Ad Section */}
          <div className="space-y-2 pt-2 border-t border-white/10">
            <h4 className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
              <Flag className="w-3.5 h-3.5 text-amber-400" />
              <span>Reportar o bloquear este anuncio</span>
            </h4>

            {isReportSubmitted ? (
              <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-2.5 text-xs text-emerald-400">
                <Check className="w-4 h-4 shrink-0" />
                <span>Gracias por tu reporte. Hemos bloqueado este anuncio para tu sesión.</span>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                {[
                  'Contenido inapropiado',
                  'Anuncio repetitivo',
                  'Enlace roto o engañoso',
                  'Tapa la pantalla',
                ].map((reason) => (
                  <button
                    key={reason}
                    onClick={() => handleSendReport(reason)}
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 text-[11px] text-slate-300 text-left transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <EyeOff className="w-3 h-3 text-slate-400 shrink-0" />
                    <span className="truncate">{reason}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#141926] border-t border-white/10 flex items-center justify-between text-xs">
          <a
            href="https://adssettings.google.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-400 hover:text-[#00F2FE] flex items-center gap-1 text-[11px] transition-colors"
          >
            <span>Configuración de Google Ads</span>
            <ExternalLink className="w-3 h-3" />
          </a>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs transition-colors cursor-pointer"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};

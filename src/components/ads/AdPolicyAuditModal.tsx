import React, { useState } from 'react';
import { X, CheckCircle2, AlertTriangle, ShieldCheck, RefreshCw, Smartphone, Plus, Trash2 } from 'lucide-react';
import { adService } from '../../services/adService';
import { GooglePlayPolicyCheck, AdMobConfig } from '../../types/monetization.types';

interface AdPolicyAuditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onToast: (msg: string, type: 'success' | 'info' | 'error') => void;
}

export const AdPolicyAuditModal: React.FC<AdPolicyAuditModalProps> = ({
  isOpen,
  onClose,
  onToast,
}) => {
  const [checks, setChecks] = useState<GooglePlayPolicyCheck[]>(() => adService.runPolicyAudit());
  const [config, setConfig] = useState<AdMobConfig>(() => adService.getConfig());
  const [newDeviceId, setNewDeviceId] = useState('');
  const sdkStatus = adService.getSdkStatus();

  if (!isOpen) return null;

  const handleRefreshAudit = () => {
    setChecks(adService.runPolicyAudit());
    setConfig(adService.getConfig());
    onToast('Auditoría de políticas de Google Play actualizada', 'info');
  };

  const handleAddDeviceId = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDeviceId.trim()) return;
    adService.addTestDeviceId(newDeviceId.trim());
    setConfig(adService.getConfig());
    setChecks(adService.runPolicyAudit());
    setNewDeviceId('');
    onToast('Dispositivo de prueba registrado en AdMob', 'success');
  };

  const handleRemoveDeviceId = (id: string) => {
    adService.removeTestDeviceId(id);
    setConfig(adService.getConfig());
    setChecks(adService.runPolicyAudit());
    onToast('Dispositivo eliminado', 'info');
  };

  const compliantCount = checks.filter((c) => c.status === 'compliant').length;
  const isAllCompliant = compliantCount === checks.length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-xl p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#0D1017] border border-white/15 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-[#141926] border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Google Play Ads Policy Inspector</h3>
              <p className="text-xs text-slate-400">
                Auditoría de cumplimiento de Better Ads Standards y SDK Google AdMob
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleRefreshAudit}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
              title="Volver a auditar"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6 overflow-y-auto">
          {/* Status Summary Banner */}
          <div
            className={`p-4 rounded-2xl border flex items-center justify-between ${
              isAllCompliant
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                : 'bg-amber-500/10 border-amber-500/30 text-amber-300'
            }`}
          >
            <div className="flex items-center gap-3">
              {isAllCompliant ? (
                <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
              ) : (
                <AlertTriangle className="w-6 h-6 text-amber-400 shrink-0" />
              )}
              <div>
                <h4 className="text-sm font-bold text-white">
                  {isAllCompliant
                    ? '100% Cumplimiento con Políticas de Google Play'
                    : 'Atención recomendada en configuración de anuncios'}
                </h4>
                <p className="text-xs opacity-80 mt-0.5">
                  {compliantCount} de {checks.length} estándares aprobados sin riesgo de penalización de cuenta.
                </p>
              </div>
            </div>

            <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-white/10 text-white">
              {compliantCount}/{checks.length} PASS
            </span>
          </div>

          {/* SDK Bridge Info Card */}
          <div className="p-4 rounded-2xl bg-[#121622] border border-white/10 space-y-3">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Estado de Inicialización del SDK
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-2.5 rounded-xl bg-white/5">
                <span className="text-[10px] text-slate-400 block mb-0.5">SDK Status</span>
                <span className="font-bold text-emerald-400">
                  {sdkStatus.initialized ? 'INICIALIZADO (v23.4)' : 'INACTIVO'}
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-white/5">
                <span className="text-[10px] text-slate-400 block mb-0.5">Entorno</span>
                <span className="font-bold text-[#00F2FE]">
                  {sdkStatus.testMode ? 'Google Test Units' : 'Producción (Live)'}
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-white/5">
                <span className="text-[10px] text-slate-400 block mb-0.5">Content Rating</span>
                <span className="font-bold text-purple-400">Max: [{sdkStatus.contentRating}]</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white/5">
                <span className="text-[10px] text-slate-400 block mb-0.5">Consentimiento UMP</span>
                <span className="font-bold text-amber-400 uppercase">{sdkStatus.umpStatus}</span>
              </div>
            </div>
          </div>

          {/* Checklist of Policy Rules */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Reglas de Google Play & Better Ads
            </h4>

            <div className="space-y-2.5">
              {checks.map((check) => (
                <div
                  key={check.id}
                  className="p-3.5 rounded-2xl bg-[#121622] border border-white/5 flex items-start gap-3"
                >
                  <div className="mt-0.5">
                    {check.status === 'compliant' ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-amber-400" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h5 className="text-xs font-bold text-white truncate">{check.rule}</h5>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-slate-400 shrink-0">
                        {check.category}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                      {check.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Test Devices Manager */}
          <div className="p-4 rounded-2xl bg-[#121622] border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Smartphone className="w-4 h-4 text-[#00F2FE]" />
                  <span>Dispositivos de Prueba Registrados (Test Devices)</span>
                </h4>
                <p className="text-[11px] text-slate-400">
                  Los dispositivos registrados reciben anuncios de prueba sin generar tráfico inválido.
                </p>
              </div>
            </div>

            <form onSubmit={handleAddDeviceId} className="flex gap-2">
              <input
                type="text"
                placeholder="ID de dispositivo (ej: 33BE2250B43A5702D224D)"
                value={newDeviceId}
                onChange={(e) => setNewDeviceId(e.target.value)}
                className="flex-1 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-slate-500 font-mono focus:outline-none focus:border-[#00F2FE]"
              />
              <button
                type="submit"
                className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Agregar</span>
              </button>
            </form>

            <div className="space-y-1.5 pt-1">
              {config.testDeviceIds.map((devId) => (
                <div
                  key={devId}
                  className="flex items-center justify-between p-2 rounded-xl bg-black/40 border border-white/5 text-xs"
                >
                  <span className="font-mono text-slate-300 text-[11px]">{devId}</span>
                  <button
                    onClick={() => handleRemoveDeviceId(devId)}
                    className="p-1 text-slate-400 hover:text-red-400 transition-colors cursor-pointer"
                    title="Eliminar dispositivo"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-[#141926] border-t border-white/10 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#00F2FE] to-[#7928CA] text-white font-bold text-xs shadow-lg active:scale-95 transition-transform cursor-pointer"
          >
            Listo
          </button>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { ShieldAlert, Lock, ArrowRight, X, KeyRound, CheckCircle2, UserCheck } from 'lucide-react';
import { adminAuthService } from '../../services/adminAuthService';

interface AdminAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  currentUserEmail?: string | null;
  onShowToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
  onLoginOwner?: () => void;
}

export const AdminAuthModal: React.FC<AdminAuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  currentUserEmail,
  onShowToast,
  onLoginOwner,
}) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  if (!isOpen) return null;

  const ownerEmail = adminAuthService.getOwnerEmail();
  const isOwnerLoggedIn = adminAuthService.isOwnerEmail(currentUserEmail);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pin) {
      setError('Por favor ingresa el PIN de Administrador');
      return;
    }

    setIsVerifying(true);
    setTimeout(() => {
      const isValid = adminAuthService.verifyPin(pin);
      if (isValid) {
        setError(null);
        setIsVerifying(false);
        onShowToast('¡Acceso concedido! Bienvenido al Panel de Administrador.', 'success');
        onSuccess();
      } else {
        setError('PIN incorrecto. Acceso exclusivo para el creador.');
        setIsVerifying(false);
      }
    }, 400);
  };

  const handleOwnerDirectAccess = () => {
    if (isOwnerLoggedIn) {
      adminAuthService.unlockSession();
      onShowToast('¡Sesión de Propietario verificada!', 'success');
      onSuccess();
    } else if (onLoginOwner) {
      // Solo PIN: no auto-login como owner desde la UI pública.
      setError('Inicia sesión con tu cuenta y luego ingresa el PIN maestro.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-sm bg-[#0E121B] border border-white/15 rounded-3xl overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="px-5 py-4 bg-[#141926] border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Acceso Restringido</h3>
              <p className="text-[10px] text-slate-400">Solo Propietario / Admin</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-center">
            <div className="w-12 h-12 mx-auto mb-2 rounded-2xl bg-[#FF4D8D]/10 border border-[#FF4D8D]/20 flex items-center justify-center text-[#FF4D8D]">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-white">Panel de Control Yūgen</h4>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Este panel es exclusivo para el creador de la aplicación.
            </p>
            <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/40 border border-white/10 text-[11px] font-mono text-purple-300">
              <span>Propietario:</span>
              <strong className="text-white">{ownerEmail}</strong>
            </div>
          </div>

          {/* If current user matches owner */}
          {isOwnerLoggedIn ? (
            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-2.5 text-xs text-emerald-300">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Has iniciado sesión con el correo del propietario ({ownerEmail}).</span>
              </div>
              <button
                onClick={handleOwnerDirectAccess}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#00F2FE] to-[#7928CA] text-white font-bold text-xs shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-transform cursor-pointer"
              >
                <span>Entrar como Administrador</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
                  <span>Ingresa el PIN Maestro de Admin</span>
                  <span className="text-[10px] text-slate-500 font-mono">4-6 dígitos</span>
                </label>
                <div className="relative">
                  <input
                    type="password"
                    inputMode="numeric"
                    maxLength={6}
                    autoFocus
                    placeholder="••••"
                    value={pin}
                    onChange={(e) => {
                      setPin(e.target.value);
                      if (error) setError(null);
                    }}
                    className="w-full py-3 px-4 rounded-xl bg-white/5 border border-white/10 text-center tracking-[0.4em] font-mono text-xl text-white focus:outline-none focus:border-[#FF4D8D] placeholder-slate-600"
                  />
                  <KeyRound className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                </div>
                {error && (
                  <p className="text-[11px] text-red-400 mt-1.5 text-center font-medium animate-in fade-in">
                    {error}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isVerifying}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#FF4D8D] to-[#7928CA] hover:from-[#FF4D8D]/90 hover:to-[#7928CA]/90 text-white font-bold text-xs shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
              >
                <span>{isVerifying ? 'Verificando...' : 'Desbloquear Panel'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* Quick 1-tap owner login if not logged in */}
          {!isOwnerLoggedIn && (
            <div className="pt-2 border-t border-white/10 text-center">
              <p className="text-[11px] text-slate-500">
                El acceso rápido por botón está desactivado por seguridad. Usa tu sesión + PIN.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

import React, { useRef, useState } from 'react';
import {
  Moon,
  Sun,
  Monitor,
  Globe,
  Download,
  Upload,
  Bell,
  Trash2,
  Shield,
  FileText,
  Info,
  LogOut,
  Sparkles,
  Check,
  ShieldAlert,
  Sliders,
  ExternalLink,
  Smartphone,
  Lock,
} from 'lucide-react';
import { BRAND } from '../../config/brand.config';
import { UserProfile, UserTheme, AppLanguage, DownloadQuality } from '../../types/user.types';
import { MONETIZATION_CONFIG } from '../../config/monetization.config';
import { Button } from '../common/Button';
import { Modal } from '../common/Modal';
import { PrivacyPolicyModal, TermsModal } from '../legal/LegalModals';
import { AdFreePassCard } from '../ads/AdFreePassCard';
import { exportBackup, parseBackupFile, restoreBackup } from '../../services/backupService';
import { adService } from '../../services/adService';
import { adminAuthService } from '../../services/adminAuthService';
import { Capacitor } from '@capacitor/core';

interface ProfileScreenProps {
  userProfile: UserProfile;
  onUpdatePreference: (key: keyof UserProfile['preferences'], value: any) => void;
  onLoginGoogle: () => void;
  onLoginEmail: (email: string, name: string) => void;
  onLogout: () => void;
  onTogglePremium: () => void;
  onClearCache: () => void;
  onShowToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
  onOpenAdmin: () => void;
  onRequestAdFreePass?: () => void;
  favoritesCount: number;
  downloadsCount: number;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  userProfile,
  onUpdatePreference,
  onLoginGoogle,
  onLoginEmail,
  onLogout,
  onTogglePremium,
  onClearCache,
  onShowToast,
  onOpenAdmin,
  onRequestAdFreePass,
  favoritesCount,
  downloadsCount,
}) => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [personalizedAds, setPersonalizedAds] = useState(() => adService.getConfig().personalizedAdsConsent);

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim()) return;
    onLoginEmail(emailInput, nameInput);
    setShowAuthModal(false);
    onShowToast(`¡Sesión iniciada como ${nameInput || emailInput}!`, 'success');
  };

  const handleClearCache = () => {
    onClearCache();
    onShowToast('Caché local y datos temporales liberados correctamente.', 'info');
  };

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleExportBackup = async () => {
    try {
      await exportBackup();
      onShowToast('Copia exportada. Guárdala para restaurar en otro dispositivo.', 'success');
    } catch {
      onShowToast('No se pudo exportar la copia.', 'error');
    }
  };

  const handleImportFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    try {
      const text = await file.text();
      const restored = restoreBackup(parseBackupFile(text));
      onShowToast(`Copia restaurada (${restored} datos). Reiniciando…`, 'success');
      setTimeout(() => window.location.reload(), 900);
    } catch {
      onShowToast('Archivo de copia no válido.', 'error');
    }
  };

  return (
    <div className="pb-28 max-w-lg mx-auto px-4 pt-3 text-slate-200">
      {/* Screen Title */}
      <div className="mb-3">
        <h1 className="text-xl font-black text-white tracking-tight">Perfil</h1>
        <p className="text-xs text-slate-400 mt-0.5">Ajustes de cuenta, descargas y preferencias</p>
      </div>

      {/* USER HEADER CARD */}
      <div className="p-5 rounded-3xl bg-gradient-to-b from-[#161B28] to-[#10141F] border border-white/10 shadow-xl mb-5 relative overflow-hidden">
        <div className="flex items-center gap-4">
          <div className="relative">
            <img
              src={userProfile.avatarUrl}
              alt={userProfile.displayName}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-white/15 shadow-md"
            />
            {userProfile.isPremium && (
              <span className="absolute -bottom-1 -right-1 px-1.5 py-0.5 rounded-md bg-amber-500 text-[9px] font-extrabold text-black flex items-center gap-0.5 shadow">
                <Sparkles className="w-2.5 h-2.5" /> PRO
              </span>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="text-base font-bold text-white truncate">{userProfile.displayName}</h3>
            <p className="text-xs text-slate-400 truncate">
              {userProfile.email || 'Modo Invitado (Sin cuenta)'}
            </p>

            <div className="flex items-center gap-2 mt-2">
              {userProfile.isAnonymous ? (
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="px-3 py-1 rounded-xl bg-gradient-to-r from-[#FF4D8D] to-[#EC4899] text-white text-xs font-bold shadow cursor-pointer active:scale-95"
                >
                  Sincronizar cuenta
                </button>
              ) : (
                <button
                  onClick={onLogout}
                  className="px-2.5 py-1 rounded-xl bg-white/10 hover:bg-white/15 text-slate-300 text-xs font-medium flex items-center gap-1 cursor-pointer"
                >
                  <LogOut className="w-3 h-3" /> Salir
                </button>
              )}
            </div>
          </div>
        </div>

        {/* User Stats Row */}
        <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-white/10 text-center">
          <div className="p-2.5 rounded-2xl bg-white/5 border border-white/5">
            <span className="text-xs text-slate-400 block">Favoritos</span>
            <span className="text-sm font-bold text-[#FF4D8D]">{favoritesCount} fondos</span>
          </div>
          <div className="p-2.5 rounded-2xl bg-white/5 border border-white/5">
            <span className="text-xs text-slate-400 block">Descargas</span>
            <span className="text-sm font-bold text-[#00F2FE]">{downloadsCount} archivos</span>
          </div>
        </div>
      </div>

      {/* PREMIUM PASS BANNER */}
      <div
        onClick={() => setShowPremiumModal(true)}
        className="p-4 rounded-3xl bg-gradient-to-r from-[#FF4D8D]/20 via-[#7928CA]/20 to-[#00F2FE]/20 border border-[#FF4D8D]/40 mb-6 shadow-xl cursor-pointer select-none hover:border-[#FF4D8D] transition-all group"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#FF4D8D] to-[#7928CA] flex items-center justify-center text-white shadow-lg">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                <span>YŪGEN PASS PREMIUM</span>
                {userProfile.isPremium && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500 text-black font-bold">
                    ACTIVO
                  </span>
                )}
              </h4>
              <p className="text-[11px] text-slate-300">
                {userProfile.isPremium
                  ? 'Disfrutando de descargas 4K ilimitadas sin anuncios'
                  : 'Descargas 4K sin límites, cero publicidad y soporte prioritario'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* SETTINGS SECTIONS */}
      <div className="space-y-4">
        {/* APPEARANCE */}
        <div className="p-4 rounded-3xl bg-[#121622] border border-white/5 space-y-3">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            Apariencia Visual
          </span>

          {/* Theme buttons */}
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'dark' as UserTheme, label: 'Oscuro', icon: Moon },
              { id: 'light' as UserTheme, label: 'Claro', icon: Sun },
              { id: 'system' as UserTheme, label: 'Sistema', icon: Monitor },
            ].map((t) => {
              const Icon = t.icon;
              const isSelected = userProfile.preferences.theme === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => onUpdatePreference('theme', t.id)}
                  className={`p-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#FF4D8D] border-[#FF4D8D] text-white shadow-sm'
                      : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{t.label}</span>
                </button>
              );
            })}
          </div>

          {/* AMOLED Switch */}
          <label className="flex items-center justify-between pt-2 border-t border-white/10 cursor-pointer">
            <div>
              <span className="text-xs font-semibold text-white block">Negros Puros AMOLED</span>
              <span className="text-[11px] text-slate-400">Reduce el consumo de batería en pantallas OLED</span>
            </div>
            <input
              type="checkbox"
              checked={userProfile.preferences.amoledPureBlack}
              onChange={(e) => onUpdatePreference('amoledPureBlack', e.target.checked)}
              className="w-4 h-4 accent-[#00F2FE] rounded cursor-pointer"
            />
          </label>
        </div>

        {/* PREFERENCES */}
        <div className="p-4 rounded-3xl bg-[#121622] border border-white/5 space-y-3 text-xs">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            Preferencias de Descarga
          </span>

          {/* Download Quality */}
          <div className="flex items-center justify-between">
            <span className="font-semibold text-white">Calidad de descarga predeterminada</span>
            <select
              value={userProfile.preferences.downloadQuality}
              onChange={(e) => onUpdatePreference('downloadQuality', e.target.value as DownloadQuality)}
              className="bg-white/10 text-white rounded-xl px-2.5 py-1 text-xs border border-white/10 focus:outline-none cursor-pointer"
            >
              <option value="4k" className="bg-[#121622]">4K Ultra HD</option>
              <option value="1080p" className="bg-[#121622]">1080p Full HD</option>
              <option value="auto" className="bg-[#121622]">Auto según red</option>
            </select>
          </div>

          {/* Language Selector */}
          <div className="flex items-center justify-between pt-2 border-t border-white/10">
            <span className="font-semibold text-white flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-[#00F2FE]" /> Idioma / Language
            </span>
            <select
              value={userProfile.preferences.language}
              onChange={(e) => onUpdatePreference('language', e.target.value as AppLanguage)}
              className="bg-white/10 text-white rounded-xl px-2.5 py-1 text-xs border border-white/10 focus:outline-none cursor-pointer"
            >
              <option value="es" className="bg-[#121622]">Español</option>
              <option value="en" className="bg-[#121622]">English</option>
              <option value="ja" className="bg-[#121622]">日本語</option>
              <option value="ko" className="bg-[#121622]">한국어</option>
              <option value="pt" className="bg-[#121622]">Português</option>
            </select>
          </div>

          {/* Data Saver */}
          <label className="flex items-center justify-between pt-2 border-t border-white/10 cursor-pointer">
            <div>
              <span className="font-semibold text-white block">Ahorro de datos móviles</span>
              <span className="text-[11px] text-slate-400">Cargar miniaturas de menor resolución en conexiones lentas</span>
            </div>
            <input
              type="checkbox"
              checked={userProfile.preferences.dataSaver}
              onChange={(e) => onUpdatePreference('dataSaver', e.target.checked)}
              className="w-4 h-4 accent-[#FF4D8D] rounded cursor-pointer"
            />
          </label>

          {/* In-App Notifications */}
          <label className="flex items-center justify-between pt-2 border-t border-white/10 cursor-pointer">
            <div>
              <span className="font-semibold text-white block">Alertas de nuevas colecciones</span>
              <span className="text-[11px] text-slate-400">Avisar cuando se agreguen fondos 4K y paquetes temáticos</span>
            </div>
            <input
              type="checkbox"
              checked={userProfile.preferences.notificationsEnabled}
              onChange={(e) => onUpdatePreference('notificationsEnabled', e.target.checked)}
              className="w-4 h-4 accent-[#00F2FE] rounded cursor-pointer"
            />
          </label>
        </div>

        {/* REWARDED AD-FREE PASS CARD */}
        {onRequestAdFreePass && (
          <AdFreePassCard onRequestWatchAd={onRequestAdFreePass} />
        )}

        {/* PRIVACY & GOOGLE PLAY AD SETTINGS */}
        <div className="p-4 rounded-3xl bg-[#121622] border border-white/5 space-y-3 text-xs">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            Privacidad y Anuncios (Google Play & UMP)
          </span>

          <label className="flex items-center justify-between cursor-pointer">
            <div>
              <span className="font-semibold text-white block">Anuncios Personalizados</span>
              <span className="text-[11px] text-slate-400">
                {personalizedAds
                  ? 'Consentimiento otorgado para anuncios basados en intereses'
                  : 'Solo anuncios contextuales sin cookies ni identificadores publicitarios'}
              </span>
            </div>
            <input
              type="checkbox"
              checked={personalizedAds}
              onChange={(e) => {
                const granted = e.target.checked;
                setPersonalizedAds(granted);
                adService.setPersonalizedAdsConsent(granted);
                onShowToast(
                  granted
                    ? 'Consentimiento de personalización activado'
                    : 'Personalización desactivada: anuncios solo contextuales',
                  'info'
                );
              }}
              className="w-4 h-4 accent-[#00F2FE] rounded cursor-pointer"
            />
          </label>
        </div>

        {/* ANDROID NATIVE APP BUILD INFO */}
        <div className="p-4 rounded-3xl bg-gradient-to-r from-[#121622] via-[#161B28] to-[#121622] border border-white/10 flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h4 className="text-xs font-bold text-white">Yūgen Anime Wallpapers</h4>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono">v1.4.1</span>
              </div>
              <p className="text-[11px] text-slate-400">Paquete APK Android · art.yugen.wallpapers</p>
            </div>
          </div>
          <span className="px-2.5 py-1 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 rounded-full border border-emerald-500/20">
            APK Nativo
          </span>
        </div>

        {/* SYSTEM & MAINTENANCE */}
        <div className="p-4 rounded-3xl bg-[#121622] border border-white/5 space-y-2 text-xs">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
            Mantenimiento y Soporte
          </span>

          <button
            onClick={handleClearCache}
            className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-white/5 transition-colors cursor-pointer text-left"
          >
            <div className="flex items-center gap-2">
              <Trash2 className="w-4 h-4 text-slate-400" />
              <span>Limpiar caché local de imágenes</span>
            </div>
            <span className="text-slate-400 text-[11px]">Liberar espacio</span>
          </button>

          <button
            onClick={() => setShowAboutModal(true)}
            className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-white/5 transition-colors cursor-pointer text-left"
          >
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 text-slate-400" />
              <span>Acerca de Yūgen</span>
            </div>
            <span className="text-slate-400 text-[11px]">v{BRAND.version}</span>
          </button>

          <button
            onClick={() => setShowPrivacyModal(true)}
            className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-white/5 transition-colors cursor-pointer text-left"
          >
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-slate-400" />
              <span>Política de Privacidad</span>
            </div>
            <span className="text-slate-400 text-[11px]">Leer</span>
          </button>

          <button
            onClick={() => setShowTermsModal(true)}
            className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-white/5 transition-colors cursor-pointer text-left"
          >
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-slate-400" />
              <span>Términos de Uso</span>
            </div>
            <span className="text-slate-400 text-[11px]">Leer</span>
          </button>

          <button
            onClick={handleExportBackup}
            className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-white/5 transition-colors cursor-pointer text-left"
          >
            <div className="flex items-center gap-2">
              <Download className="w-4 h-4 text-slate-400" />
              <span>Exportar copia de seguridad</span>
            </div>
            <span className="text-slate-400 text-[11px]">Favoritos y perfil</span>
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-white/5 transition-colors cursor-pointer text-left"
          >
            <div className="flex items-center gap-2">
              <Upload className="w-4 h-4 text-slate-400" />
              <span>Importar copia de seguridad</span>
            </div>
            <span className="text-slate-400 text-[11px]">Desde archivo</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json,application/json"
            className="hidden"
            onChange={handleImportFile}
          />

          {/* Admin portal shortcut (Restricted to Owner juanyamels@gmail.com or Master PIN) */}
          {(!adminAuthService.isDiscreetMode() || adminAuthService.isAdminUnlocked(userProfile.email)) && (
            <button
              onClick={onOpenAdmin}
              className="w-full flex items-center justify-between p-2.5 rounded-2xl bg-gradient-to-r from-purple-500/15 via-indigo-500/10 to-purple-500/15 border border-purple-500/25 text-purple-200 hover:bg-purple-500/25 transition-all cursor-pointer text-left mt-2 shadow-sm"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-300">
                  {adminAuthService.isAdminUnlocked(userProfile.email) ? (
                    <ShieldAlert className="w-4 h-4" />
                  ) : (
                    <Lock className="w-3.5 h-3.5" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-xs">Panel de Control & IA</span>
                    <span className="text-[9px] bg-purple-500/30 text-purple-200 px-1.5 py-0.2 rounded font-mono font-bold">
                      {adminAuthService.isAdminUnlocked(userProfile.email) ? 'PROPIETARIO' : 'SOLO OWNER'}
                    </span>
                  </div>
                  <span className="text-[10px] text-purple-300/70 block">
                    {adminAuthService.isAdminUnlocked(userProfile.email)
                      ? 'Sesión activa (juanyamels@gmail.com)'
                      : 'Protegido con PIN Maestro'}
                  </span>
                </div>
              </div>
              <span className="text-[10px] font-mono font-bold bg-purple-500/30 border border-purple-500/40 text-purple-200 px-2 py-1 rounded-xl">
                {adminAuthService.isAdminUnlocked(userProfile.email) ? 'ENTRAR' : 'DESBLOQUEAR'}
              </span>
            </button>
          )}
        </div>
      </div>

      {/* AUTH MODAL */}
      <Modal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} title="Sincronizar mi Cuenta" maxWidth="sm">
        <div className="space-y-4 text-slate-200">
          <p className="text-xs text-slate-400">
            Demo local: crea un perfil en este dispositivo. Sin servidor, tus datos no se sincronizan
            a otros equipos.
          </p>

          <button
            onClick={() => {
              onLoginGoogle();
              setShowAuthModal(false);
              onShowToast('¡Conectado exitosamente con Google!', 'success');
            }}
            className="w-full py-2.5 px-4 rounded-2xl bg-white text-black font-semibold text-xs flex items-center justify-center gap-2 hover:bg-slate-100 transition-colors shadow-md cursor-pointer"
          >
            <span className="font-bold">G</span> Continuar con Google
          </button>

          <div className="flex items-center gap-2 my-2">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-[10px] text-slate-500 uppercase">o con email</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          <form onSubmit={handleEmailSubmit} className="space-y-2.5">
            <input
              type="text"
              placeholder="Tu nombre o apodo"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-[#FF4D8D]"
            />
            <input
              type="email"
              placeholder="correo@ejemplo.com"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              required
              className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-[#FF4D8D]"
            />
            <Button type="submit" variant="primary" size="md" className="w-full">
              Acceder con Email
            </Button>
          </form>
        </div>
      </Modal>

      {/* PREMIUM SUBSCRIPTION MODAL */}
      <Modal isOpen={showPremiumModal} onClose={() => setShowPremiumModal(false)} title="Yūgen Pass Premium" maxWidth="md">
        <div className="space-y-4 text-slate-200">
          <p className="text-xs text-slate-400">
            Desbloquea la experiencia definitiva para entusiastas del arte anime y pantallas de alta gama.
          </p>
          <p className="text-[11px] text-amber-300/90 bg-amber-500/10 border border-amber-500/20 rounded-xl px-3 py-2">
            Vista previa demo: el pago real requiere Google Play Billing. No se cobra nada aquí.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {MONETIZATION_CONFIG.plans.map((p) => (
              <div
                key={p.id}
                className={`p-4 rounded-2xl border transition-all ${
                  p.popular
                    ? 'bg-gradient-to-b from-[#FF4D8D]/20 to-[#7928CA]/20 border-[#FF4D8D] shadow-lg shadow-[#FF4D8D]/20'
                    : 'bg-white/5 border-white/10'
                }`}
              >
                {p.popular && (
                  <span className="text-[10px] font-bold text-amber-400 bg-amber-400/20 px-2 py-0.5 rounded-full border border-amber-400/30 mb-2 inline-block">
                    Más popular · {p.savingsBadge}
                  </span>
                )}
                <h4 className="text-sm font-bold text-white">{p.name}</h4>
                <div className="my-1.5">
                  <span className="text-2xl font-extrabold text-white">{p.price}</span>
                  <span className="text-xs text-slate-400"> {p.billingPeriod}</span>
                </div>

                <ul className="space-y-1.5 my-3 text-[11px] text-slate-300">
                  {p.features.map((f, i) => (
                    <li key={i} className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="pt-2">
            <Button
              variant="primary"
              size="lg"
              onClick={() => {
                onTogglePremium();
                setShowPremiumModal(false);
                onShowToast(
                  userProfile.isPremium
                    ? 'Has regresado al plan gratuito.'
                    : '¡Felicidades! Yūgen Pass Premium ha sido activado.',
                  'success'
                );
              }}
              className="w-full font-bold"
            >
              {userProfile.isPremium ? 'Cambiar a Plan Gratuito (demo)' : 'Activar Demo Premium'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* ABOUT MODAL */}
      <Modal isOpen={showAboutModal} onClose={() => setShowAboutModal(false)} title="Acerca de Yūgen" maxWidth="sm">        <div className="space-y-3 text-xs text-slate-300">
          <div className="text-center py-2">
            <h3 className="text-lg font-extrabold text-white">{BRAND.name} · {BRAND.kanji}</h3>
            <p className="text-[11px] text-[#FF4D8D] font-medium">{BRAND.tagline}</p>
          </div>
          <p className="leading-relaxed">
            {BRAND.description} Diseñada meticulosamente con estética cinematográfica, transiciones fluidas a 60 FPS y espacio libre en pantalla para que el reloj y widgets de tu smartphone luzcan impecables.
          </p>
          <div className="pt-2 border-t border-white/10 text-[11px] text-slate-400 space-y-1">
            <p><strong>Versión:</strong> {BRAND.version} (Build {BRAND.buildNumber})</p>
            <p><strong>Autor:</strong> {BRAND.author}</p>
            <p><strong>Contacto:</strong> {BRAND.supportEmail}</p>
          </div>
        </div>
      </Modal>

      {/* LEGAL MODALS */}
      <PrivacyPolicyModal isOpen={showPrivacyModal} onClose={() => setShowPrivacyModal(false)} />
      <TermsModal isOpen={showTermsModal} onClose={() => setShowTermsModal(false)} />
    </div>
  );
};

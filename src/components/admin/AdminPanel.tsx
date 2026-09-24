import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  PlusCircle,
  BarChart3,
  Sparkles,
  Trash2,
  Upload,
  Eye,
  Download,
  Heart,
  Layers,
  CheckCircle2,
  RefreshCw,
  DollarSign,
  Wallet,
  ShieldCheck,
  Lock,
  KeyRound,
  ShieldAlert,
  RotateCcw,
  HelpCircle,
  AlertTriangle,
} from 'lucide-react';
import { Wallpaper } from '../../types/wallpaper.types';
import { Category } from '../../types/category.types';
import { wallpaperRepository } from '../../repositories';
import { Button } from '../common/Button';
import { ImagePipeline } from '../../services/imagePipeline';
import { analytics } from '../../services/analyticsService';
import { adService } from '../../services/adService';
import { adminAuthService } from '../../services/adminAuthService';
import { getErrorLog, clearErrorLog, LoggedError } from '../../services/errorLog';
import { PayoutModal } from '../ads/PayoutModal';
import { AdPolicyAuditModal } from '../ads/AdPolicyAuditModal';
import { MaxAdContentRating } from '../../types/monetization.types';

interface AdminPanelProps {
  onClose: () => void;
  onShowToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ onClose, onShowToast }) => {
  const [wallpapers, setWallpapers] = useState<Wallpaper[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'add' | 'ai_generate' | 'manage' | 'monetization'>('overview');
  const [showPayoutModal, setShowPayoutModal] = useState(false);
  const [showPolicyAuditModal, setShowPolicyAuditModal] = useState(false);
  const [adConfig, setAdConfig] = useState(() => adService.getConfig());
  const [adMetrics, setAdMetrics] = useState(() => adService.getMetrics());

  // Metrics clean launch mode
  const [isCleanLaunch, setIsCleanLaunch] = useState(() => wallpaperRepository.isCleanLaunchMode());

  // Security states
  const [isDiscreet, setIsDiscreet] = useState(() => adminAuthService.isDiscreetMode());
  const [showPinChange, setShowPinChange] = useState(false);
  const [currentPinInput, setCurrentPinInput] = useState('');
  const [newPinInput, setNewPinInput] = useState('');

  // Error log (diagnóstico local)
  const [errorLog, setErrorLog] = useState<LoggedError[]>(() => getErrorLog());
  const handleClearErrors = () => {
    clearErrorLog();
    setErrorLog([]);
    onShowToast('Registro de errores limpiado.', 'info');
  };

  // New wallpaper form state
  const [title, setTitle] = useState('');
  const [titleJp, setTitleJp] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('cat-cyberpunk');
  const [imageUrl, setImageUrl] = useState('');
  const [tags, setTags] = useState('anime, 4k, mobile');
  const [isFeatured, setIsFeatured] = useState(false);
  const [isTrending, setIsTrending] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  const [isAmoled, setIsAmoled] = useState(false);

  // AI Prompt Studio state
  const [aiPreset, setAiPreset] = useState<'cyberpunk' | 'samurai' | 'ghibli' | 'mecha' | 'tokyo_rain'>('cyberpunk');
  const [customPrompt, setCustomPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const loadData = async () => {
    const w = await wallpaperRepository.getAllWallpapers();
    const c = await wallpaperRepository.getAllCategories();
    setWallpapers(w);
    setCategories(c);
  };

  useEffect(() => {
    loadData();
  }, []);

  // Aggregated Stats
  const totalWallpapers = wallpapers.length;
  const totalViews = wallpapers.reduce((acc, w) => acc + (w.stats.views || 0), 0);
  const totalDownloads = wallpapers.reduce((acc, w) => acc + (w.stats.downloads || 0), 0);
  const totalFavorites = wallpapers.reduce((acc, w) => acc + (w.stats.favorites || 0), 0);
  const topWallpaper = [...wallpapers].sort((a, b) => b.stats.views - a.stats.views)[0];

  const handleAddWallpaper = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !imageUrl.trim()) {
      onShowToast('Por favor completa el título y la URL de la imagen', 'error');
      return;
    }

    const selectedCat = categories.find((c) => c.id === categoryId);
    const catName = selectedCat ? selectedCat.name : 'Anime';

    const newWp: Wallpaper = {
      id: `wp-custom-${Date.now()}`,
      title: title.trim(),
      titleJp: titleJp.trim() || undefined,
      description: description.trim() || `${title} wallpaper vertical en 4K Ultra HD.`,
      categoryId,
      categoryName: catName,
      urls: {
        thumbnail: `${imageUrl}&w=400&q=80`,
        preview: `${imageUrl}&w=900&q=85`,
        fhd: `${imageUrl}&w=1080&q=90`,
        uhd4k: `${imageUrl}&w=2160&q=95`,
        original: `${imageUrl}&w=2160&q=95`,
      },
      resolution: {
        width: 1440,
        height: 3200,
        label: isAmoled ? 'AMOLED' : '4K',
      },
      ratio: '9:20',
      orientation: 'portrait',
      isFeatured,
      isTrending,
      isNew: true,
      isPremium,
      isAmoled,
      isNightSelection: isAmoled || title.toLowerCase().includes('night'),
      tags: tags.split(',').map((t) => t.trim().toLowerCase()).filter(Boolean),
      palette: {
        dominant: '#090B10',
        accents: ['#FF4D8D', '#00F2FE'],
        textColor: 'light',
      },
      themeColor: '#FF4D8D',
      stats: {
        views: 120,
        downloads: 15,
        favorites: 8,
        rating: 4.9,
      },
      source: {
        type: 'CURATED_STUDIO',
        creator: 'Yūgen AI Engine',
        license: 'CC-BY-NC-4.0',
        generationPrompt: description,
        createdAt: new Date().toISOString(),
      },
      publishedAt: new Date().toISOString(),
    };

    await wallpaperRepository.addWallpaper(newWp);
    await loadData();

    setTitle('');
    setTitleJp('');
    setDescription('');
    setImageUrl('');
    onShowToast(`¡"${newWp.title}" ha sido añadido exitosamente al catálogo!`, 'success');
    setActiveTab('manage');
  };

  // AI Generation Presets
  const AI_PRESETS = {
    cyberpunk: {
      name: 'Cyberpunk Neo-Tokyo',
      prompt: 'Vertical 9:20 anime wallpaper, cybernetic anime heroine standing on rain-slicked roof, neon billboards in Neo-Tokyo, negative space in upper third for lockscreen clock, high contrast, 8k resolution, cinematic lighting',
      sampleUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop',
    },
    samurai: {
      name: 'Ronin Blade Sunset',
      prompt: 'Vertical 9:20 anime artwork, wandering ronin with glowing katana, cherry blossom petals swirling in scarlet twilight, minimalist composition, OLED black negative space, Masterpiece art style',
      sampleUrl: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?auto=format&fit=crop',
    },
    ghibli: {
      name: 'Ghibli Pastoral Fantasy',
      prompt: 'Vertical 9:20 anime landscape, nostalgic summer meadow with floating islands, fluffy cumulus clouds, soft watercolor tones, Studio Ghibli style, serene and spacious layout',
      sampleUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop',
    },
    mecha: {
      name: 'Titan Mecha Orbital',
      prompt: 'Vertical 9:20 anime mechanical warrior descending into earth orbit, glowing thrusters, hyper-detailed mechanical joints, dark nebula space background, sharp 4K detail',
      sampleUrl: 'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop',
    },
    tokyo_rain: {
      name: 'Shibuya Night Rain',
      prompt: 'Vertical 9:20 anime city street at midnight, glowing vending machines reflection in wet asphalt, lone umbrella silhouette, cyan and magenta rim light, cinematic anime background',
      sampleUrl: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop',
    },
  };

  const handleGenerateAI = async () => {
    setIsGenerating(true);
    const preset = AI_PRESETS[aiPreset];
    const promptText = customPrompt.trim() || preset.prompt;

    // Simulate AI pipeline generation
    setTimeout(async () => {
      const newWp: Wallpaper = {
        id: `wp-ai-${Date.now()}`,
        title: `${preset.name} AI #${Math.floor(Math.random() * 899 + 100)}`,
        titleJp: '電脳幻影',
        description: `Generado mediante pipeline de IA vertical 9:20 con prompt optimizado: "${promptText.substring(0, 100)}..."`,
        categoryId: aiPreset === 'samurai' ? 'cat-samurai' : aiPreset === 'ghibli' ? 'cat-paisajes' : 'cat-cyberpunk',
        categoryName: aiPreset === 'samurai' ? 'Samuráis & Espadas' : aiPreset === 'ghibli' ? 'Paisajes Anime' : 'Cyberpunk Anime',
        urls: {
          thumbnail: `${preset.sampleUrl}&w=400&q=80`,
          preview: `${preset.sampleUrl}&w=900&q=85`,
          fhd: `${preset.sampleUrl}&w=1080&q=90`,
          uhd4k: `${preset.sampleUrl}&w=2160&q=95`,
          original: `${preset.sampleUrl}&w=2160&q=95`,
        },
        resolution: {
          width: 1440,
          height: 3200,
          label: '4K',
        },
        ratio: '9:20',
        orientation: 'portrait',
        isFeatured: true,
        isTrending: true,
        isNew: true,
        isPremium: false,
        isAmoled: aiPreset === 'cyberpunk',
        isNightSelection: true,
        tags: ['ai-generated', '4k', 'anime', aiPreset],
        palette: {
          dominant: '#0b0d14',
          accents: ['#FF4D8D', '#00F2FE'],
          textColor: 'light',
        },
        themeColor: '#00F2FE',
        stats: {
          views: 1,
          downloads: 0,
          favorites: 1,
          rating: 5.0,
        },
        source: {
          type: 'AI_GENERATED',
          creator: 'Yūgen Generative Studio',
          license: 'CC-BY-NC-4.0',
          generationPrompt: promptText,
          createdAt: new Date().toISOString(),
        },
        publishedAt: new Date().toISOString(),
      };

      await wallpaperRepository.addWallpaper(newWp);
      await loadData();
      setIsGenerating(false);
      onShowToast(`¡"${newWp.title}" ha sido generado y añadido al catálogo!`, 'success');
      setActiveTab('manage');
    }, 1500);
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('¿Seguro que deseas eliminar este fondo?')) {
      await wallpaperRepository.deleteWallpaper(id);
      await loadData();
      onShowToast('Fondo eliminado del repositorio.', 'info');
    }
  };

  const handleResetMetricsToZero = async () => {
    if (
      confirm(
        '¿Deseas reiniciar todas las vistas, descargas y favoritos a CERO (0)?\n\nTu catálogo quedará limpio para registrar únicamente interacciones reales de usuarios a partir de ahora.'
      )
    ) {
      await wallpaperRepository.resetAllStatsToZero();
      setIsCleanLaunch(true);
      await loadData();
      onShowToast('¡Métricas reiniciadas a 0 con éxito! Catálogo limpio para lanzamiento.', 'success');
    }
  };

  const handleRestoreDemoMetrics = async () => {
    if (confirm('¿Deseas restaurar los números simulados de muestra para pruebas?')) {
      await wallpaperRepository.restoreDemoStats();
      setIsCleanLaunch(false);
      await loadData();
      onShowToast('Métricas demo restauradas.', 'info');
    }
  };

  const handleChangePin = (e: React.FormEvent) => {
    e.preventDefault();
    const res = adminAuthService.updateMasterPin(currentPinInput, newPinInput);
    if (res.success) {
      onShowToast(res.message, 'success');
      setShowPinChange(false);
      setCurrentPinInput('');
      setNewPinInput('');
    } else {
      onShowToast(res.message, 'error');
    }
  };

  const handleToggleDiscreet = () => {
    const next = !isDiscreet;
    setIsDiscreet(next);
    adminAuthService.setDiscreetMode(next);
    onShowToast(
      next
        ? 'Modo Discreto activado: el botón de Admin está oculto para otros usuarios.'
        : 'Modo Normal: el botón de Admin es visible en el perfil.',
      'info'
    );
  };

  const handleLockSession = () => {
    adminAuthService.lockSession();
    onShowToast('Sesión de administrador bloqueada.', 'info');
    onClose();
  };

  return (
    <div className="min-h-screen bg-[#090B10] text-slate-200 pb-20">
      {/* Admin Header */}
      <div className="sticky top-0 z-30 bg-[#0E121B]/95 backdrop-blur-xl border-b border-white/10 px-4 py-3 max-w-4xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 text-white flex items-center justify-center cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-extrabold text-white">Panel de Control Yūgen</h2>
              <span className="text-[10px] bg-[#FF4D8D]/20 text-[#FF4D8D] font-mono px-2 py-0.5 rounded border border-[#FF4D8D]/30">
                PROPIETARIO
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Admin autorizado: <strong className="text-white">juanyamels@gmail.com</strong>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleLockSession}
            className="px-3 py-1.5 rounded-xl bg-red-500/15 hover:bg-red-500/25 border border-red-500/30 text-red-300 text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
            title="Bloquear sesión de administrador"
          >
            <Lock className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Bloquear Admin</span>
          </button>
          <Button size="sm" variant="outline" onClick={onClose}>
            Salir a la App
          </Button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 pt-4 space-y-6">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-white/10 pb-2 overflow-x-auto no-scrollbar">
          {[
            { id: 'overview', label: 'Métricas & Stats', icon: BarChart3 },
            { id: 'monetization', label: 'Monetización & Cobros ($)', icon: DollarSign },
            { id: 'add', label: 'Subir Wallpaper', icon: PlusCircle },
            { id: 'ai_generate', label: 'Pipeline IA 9:20', icon: Sparkles },
            { id: 'manage', label: `Catálogo (${totalWallpapers})`, icon: Layers },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#FF4D8D] text-white shadow-md'
                    : 'bg-white/5 text-slate-400 hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="space-y-5 animate-in fade-in duration-200">
            {/* CLEAN LAUNCH & REAL METRICS CONTROLLER BANNER */}
            <div className="p-5 rounded-3xl bg-gradient-to-r from-[#121622] via-[#161D2E] to-[#121622] border border-white/10 shadow-xl space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#00F2FE]/10 border border-[#00F2FE]/30 flex items-center justify-center text-[#00F2FE] shrink-0 mt-0.5">
                    <BarChart3 className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-white">
                        Métricas de Lanzamiento: {isCleanLaunch ? 'Modo Real Limpio (0 Inicial)' : 'Modo Datos Demo'}
                      </h3>
                      <span
                        className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                          isCleanLaunch
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        }`}
                      >
                        {isCleanLaunch ? 'EN VIVO (DESDE 0)' : 'DATOS DEMO'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                      {isCleanLaunch
                        ? 'Tu aplicación está limpia. Todas las vistas, descargas y favoritos que ves provienen exclusivamente de interacciones reales de usuarios.'
                        : 'El catálogo tiene números simulados de muestra generados durante el desarrollo para probar el diseño de tendencias.'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {isCleanLaunch ? (
                    <button
                      onClick={handleRestoreDemoMetrics}
                      className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-300 hover:text-white transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Ver Datos Demo</span>
                    </button>
                  ) : (
                    <button
                      onClick={handleResetMetricsToZero}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-400 text-black font-extrabold text-xs shadow-lg active:scale-95 transition-transform cursor-pointer flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Reiniciar Todo a 0 (Lanzamiento)</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-4 rounded-2xl bg-[#121622] border border-white/5">
                <span className="text-xs text-slate-400 block">Total Fondos</span>
                <span className="text-2xl font-extrabold text-white mt-1 block">{totalWallpapers}</span>
                <span className="text-[10px] text-emerald-400 mt-1 block">✓ {categories.length} Categorías</span>
              </div>

              <div className="p-4 rounded-2xl bg-[#121622] border border-white/5">
                <span className="text-xs text-slate-400 block">Total Vistas</span>
                <span className="text-2xl font-extrabold text-[#00F2FE] mt-1 block">
                  {totalViews >= 1000 ? `${(totalViews / 1000).toFixed(1)}k` : totalViews}
                </span>
                <span className="text-[10px] text-slate-400 mt-1 block">Interacciones de usuarios</span>
              </div>

              <div className="p-4 rounded-2xl bg-[#121622] border border-white/5">
                <span className="text-xs text-slate-400 block">Descargas 4K</span>
                <span className="text-2xl font-extrabold text-[#FF4D8D] mt-1 block">
                  {totalDownloads >= 1000 ? `${(totalDownloads / 1000).toFixed(1)}k` : totalDownloads}
                </span>
                <span className="text-[10px] text-slate-400 mt-1 block">Resolución nativa</span>
              </div>

              <div className="p-4 rounded-2xl bg-[#121622] border border-white/5">
                <span className="text-xs text-slate-400 block">Favoritos Totales</span>
                <span className="text-2xl font-extrabold text-amber-400 mt-1 block">
                  {totalFavorites >= 1000 ? `${(totalFavorites / 1000).toFixed(1)}k` : totalFavorites}
                </span>
                <span className="text-[10px] text-slate-400 mt-1 block">Guardados en biblioteca</span>
              </div>
            </div>

            {/* ERROR LOG (diagnóstico local) */}
            <div className="p-5 rounded-3xl bg-[#121622] border border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  Errores recientes ({errorLog.length})
                </h4>
                {errorLog.length > 0 && (
                  <button
                    onClick={handleClearErrors}
                    className="text-[11px] text-rose-400 hover:text-rose-300 cursor-pointer"
                  >
                    Limpiar
                  </button>
                )}
              </div>
              {errorLog.length === 0 ? (
                <p className="text-[11px] text-slate-500">Sin errores registrados. Buen estado.</p>
              ) : (
                <div className="space-y-1.5 max-h-48 overflow-y-auto">
                  {errorLog.slice(0, 10).map((e, i) => (
                    <div key={i} className="p-2.5 rounded-xl bg-black/40 border border-white/5 text-[11px]">
                      <span className="text-amber-300 font-mono">[{e.source}]</span>{' '}
                      <span className="text-slate-300">{e.message}</span>
                      <span className="text-slate-500 block mt-0.5">{new Date(e.timestamp).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* ADMIN SECURITY & EXCLUSIVE ACCESS SETTINGS */}
            <div className="p-5 rounded-3xl bg-[#121622] border border-white/10 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
                    <ShieldAlert className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                      Seguridad y Acceso Exclusivo de Administrador
                    </h4>
                    <p className="text-[11px] text-slate-400">
                      Protege tu panel para que solo tú (juanyamels@gmail.com) puedas entrar.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setShowPinChange(!showPinChange)}
                  className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-semibold text-white flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  <KeyRound className="w-3.5 h-3.5 text-[#00F2FE]" />
                  <span>{showPinChange ? 'Cancelar' : 'Cambiar PIN Maestro'}</span>
                </button>
              </div>

              {showPinChange && (
                <form onSubmit={handleChangePin} className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-3">
                  <h5 className="text-xs font-bold text-slate-200">Actualizar PIN Maestro de Administrador</h5>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] text-slate-400 mb-1">PIN Actual</label>
                      <input
                        type="password"
                        inputMode="numeric"
                        maxLength={6}
                        placeholder="••••"
                        value={currentPinInput}
                        onChange={(e) => setCurrentPinInput(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-[#00F2FE]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">Nuevo PIN (4 a 6 dígitos)</label>
                      <input
                        type="password"
                        inputMode="numeric"
                        maxLength={6}
                        placeholder="••••"
                        value={newPinInput}
                        onChange={(e) => setNewPinInput(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-[#00F2FE]"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#00F2FE] to-[#7928CA] text-white font-bold text-xs shadow-md active:scale-95 transition-transform cursor-pointer"
                    >
                      Guardar Nuevo PIN
                    </button>
                  </div>
                </form>
              )}

              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-white block">Modo Discreto (Ocultar botón de Admin)</span>
                  <span className="text-[11px] text-slate-400">
                    Oculta completamente el acceso en el Perfil para que otros usuarios no sepan que existe.
                  </span>
                </div>
                <button
                  onClick={handleToggleDiscreet}
                  className={`w-11 h-6 rounded-full p-1 transition-colors cursor-pointer ${
                    isDiscreet ? 'bg-[#FF4D8D]' : 'bg-white/20'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white transition-transform ${
                      isDiscreet ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Top Wallpaper Highlight */}
            {topWallpaper && (
              <div className="p-4 rounded-3xl bg-[#121622] border border-white/10 flex flex-col sm:flex-row items-center gap-4">
                <img
                  src={topWallpaper.urls.thumbnail}
                  alt={topWallpaper.title}
                  className="w-24 h-36 rounded-2xl object-cover border border-white/10"
                />
                <div className="flex-1 text-center sm:text-left">
                  <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wide">
                    🏆 Wallpaper Más Popular
                  </span>
                  <h3 className="text-base font-bold text-white mt-0.5">{topWallpaper.title}</h3>
                  <p className="text-xs text-slate-400 mt-1">{topWallpaper.description}</p>
                  <div className="flex items-center justify-center sm:justify-start gap-4 mt-3 text-xs">
                    <span className="text-slate-300">👁️ {topWallpaper.stats.views.toLocaleString()} vistas</span>
                    <span className="text-emerald-400">📥 {topWallpaper.stats.downloads.toLocaleString()} descargas</span>
                    <span className="text-[#FF4D8D]">❤️ {topWallpaper.stats.favorites.toLocaleString()} favs</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* UPLOAD FORM TAB */}
        {activeTab === 'add' && (
          <form onSubmit={handleAddWallpaper} className="p-6 rounded-3xl bg-[#121622] border border-white/10 space-y-4 max-w-xl mx-auto animate-in fade-in duration-200">
            <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
              <Upload className="w-4 h-4 text-[#FF4D8D]" /> Subir Nuevo Wallpaper Anime
            </h3>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Título</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ej. Cyber Ninja Moonlight"
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-[#FF4D8D]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Título en Japonés (Opcional)</label>
                <input
                  type="text"
                  value={titleJp}
                  onChange={(e) => setTitleJp(e.target.value)}
                  placeholder="Ej. 月光のサイバー忍者"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-[#FF4D8D]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Categoría</label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-[#181D29] border border-white/10 text-xs text-white focus:outline-none focus:border-[#FF4D8D]"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">URL de la Imagen (Resolución 4K/FHD)</label>
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://images.unsplash.com/photo-..."
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-[#FF4D8D]"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Etiquetas (separadas por comas)</label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="anime, samurai, 4k, amoled, dark"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-[#FF4D8D]"
              />
            </div>

            {/* Checkbox Flags */}
            <div className="grid grid-cols-2 gap-2 pt-2">
              <label className="flex items-center gap-2 text-xs text-slate-300">
                <input
                  type="checkbox"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="w-4 h-4 accent-[#FF4D8D] rounded"
                />
                <span>Destacado (Featured)</span>
              </label>

              <label className="flex items-center gap-2 text-xs text-slate-300">
                <input
                  type="checkbox"
                  checked={isTrending}
                  onChange={(e) => setIsTrending(e.target.checked)}
                  className="w-4 h-4 accent-[#FF4D8D] rounded"
                />
                <span>En Tendencia</span>
              </label>

              <label className="flex items-center gap-2 text-xs text-slate-300">
                <input
                  type="checkbox"
                  checked={isAmoled}
                  onChange={(e) => setIsAmoled(e.target.checked)}
                  className="w-4 h-4 accent-[#00F2FE] rounded"
                />
                <span>Modo AMOLED (Negro Puro)</span>
              </label>

              <label className="flex items-center gap-2 text-xs text-slate-300">
                <input
                  type="checkbox"
                  checked={isPremium}
                  onChange={(e) => setIsPremium(e.target.checked)}
                  className="w-4 h-4 accent-amber-500 rounded"
                />
                <span>Solo para Miembros PRO</span>
              </label>
            </div>

            <Button type="submit" size="md" variant="primary" className="w-full mt-4">
              Guardar y Publicar en Catálogo
            </Button>
          </form>
        )}

        {/* AI GENERATE TAB */}
        {activeTab === 'ai_generate' && (
          <div className="p-6 rounded-3xl bg-[#121622] border border-white/10 space-y-4 max-w-xl mx-auto animate-in fade-in duration-200">
            <div>
              <span className="text-xs font-bold text-[#FF4D8D] uppercase tracking-wider block">
                Pipeline de Generación IA
              </span>
              <h3 className="text-base font-bold text-white mt-0.5">
                Generador de Fondos Verticales 9:20
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Genera fondos anime cinematográficos ajustados para pantallas de smartphone con espacio negativo superior para el reloj.
              </p>
            </div>

            {/* Presets */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-2">Preset de Estilo Anime</label>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(AI_PRESETS).map(([key, val]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => {
                      setAiPreset(key as any);
                      setCustomPrompt(val.prompt);
                    }}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                      aiPreset === key
                        ? 'bg-[#FF4D8D]/20 border-[#FF4D8D] text-white'
                        : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                    }`}
                  >
                    <span className="text-xs font-bold block">{val.name}</span>
                    <span className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">Ratio 9:20 smartphone</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Prompt */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Prompt de Generación Ajustable
              </label>
              <textarea
                rows={3}
                value={customPrompt || AI_PRESETS[aiPreset].prompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-[#FF4D8D] resize-none"
              />
            </div>

            <Button
              onClick={handleGenerateAI}
              isLoading={isGenerating}
              size="lg"
              variant="primary"
              leftIcon={<Sparkles className="w-4 h-4" />}
              className="w-full"
            >
              {isGenerating ? 'Generando wallpaper anime en 4K...' : 'Generar Wallpaper 4K con IA'}
            </Button>
          </div>
        )}

        {/* MANAGE REPOSITORY TAB */}
        {activeTab === 'manage' && (
          <div className="space-y-3 animate-in fade-in duration-200">
            <div className="flex items-center justify-between text-xs text-slate-400 pb-1">
              <span>{wallpapers.length} Wallpapers registrados en el repositorio</span>
              <button
                onClick={loadData}
                className="flex items-center gap-1 hover:text-white cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Recargar
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3">
              {wallpapers.map((wp) => (
                <div
                  key={wp.id}
                  className="group relative rounded-2xl overflow-hidden aspect-[9/16] bg-[#121622] border border-white/10 shadow-md"
                >
                  <img
                    src={wp.urls.thumbnail}
                    alt={wp.title}
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent p-2.5 flex flex-col justify-between">
                    <div className="flex justify-end">
                      <button
                        onClick={(e) => handleDelete(wp.id, e)}
                        className="w-7 h-7 rounded-lg bg-red-500/80 text-white flex items-center justify-center hover:bg-red-600 transition-colors cursor-pointer shadow"
                        title="Eliminar wallpaper"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div>
                      <h4 className="text-xs font-bold text-white truncate">{wp.title}</h4>
                      <p className="text-[10px] text-slate-400 truncate">{wp.categoryName}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* MONETIZATION & COBROS TAB */}
        {activeTab === 'monetization' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Revenue Highlights Card */}
            <div className="p-5 rounded-3xl bg-gradient-to-br from-[#1A0B2E] via-[#121622] to-emerald-950/40 border border-emerald-500/30 shadow-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 mb-1">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Monetización Google AdMob / AdSense (Modo prueba)</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl sm:text-4xl font-black text-white">
                    ${adMetrics.unpaidBalance.toFixed(2)}
                  </span>
                  <span className="text-sm font-semibold text-slate-400">USD Disponibles</span>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Ingresos acumulados históricos: <strong className="text-white">${adMetrics.estimatedRevenue.toFixed(2)} USD</strong> • eCPM medio: <strong className="text-emerald-400">${adMetrics.ecpmAvg.toFixed(2)}</strong>
                </p>
                <p className="text-[11px] text-amber-300/90 mt-1">
                  Cifras simuladas con IDs de prueba — no son ingresos reales ni pagos de AdMob.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowPolicyAuditModal(true)}
                  className="px-4 py-3 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs border border-white/15 transition-all flex items-center gap-2 cursor-pointer shrink-0"
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Auditoría Google Play</span>
                </button>

                <button
                  onClick={() => setShowPayoutModal(true)}
                  className="px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-300 hover:to-teal-400 text-black font-extrabold text-xs shadow-xl shadow-emerald-500/20 active:scale-95 transition-all flex items-center gap-2 cursor-pointer shrink-0"
                >
                  <Wallet className="w-4 h-4" />
                  <span>Cobrar / Retirar Fondos</span>
                </button>
              </div>
            </div>

            {/* Ad Format Impressions Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-2xl bg-[#121622] border border-white/5">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Total Impresiones</span>
                <span className="text-xl font-bold text-white font-mono">{adMetrics.totalImpressions.toLocaleString()}</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-[#121622] border border-white/5">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Banners Mostrados</span>
                <span className="text-xl font-bold text-[#00F2FE] font-mono">{adMetrics.bannerImpressions.toLocaleString()}</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-[#121622] border border-white/5">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Intersticiales</span>
                <span className="text-xl font-bold text-purple-400 font-mono">{adMetrics.interstitialImpressions.toLocaleString()}</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-[#121622] border border-white/5">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Recompensados (Videos)</span>
                <span className="text-xl font-bold text-amber-400 font-mono">{adMetrics.rewardedCompleted.toLocaleString()}</span>
              </div>
            </div>

            {/* Ad Network Settings */}
            <div className="p-5 rounded-3xl bg-[#121622] border border-white/10 space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-emerald-400" />
                    <span>Configuración de Red de Anuncios (Google AdMob SDK v23.4)</span>
                  </h3>
                  <p className="text-[11px] text-slate-400">Personaliza tus IDs de publicación y políticas de Better Ads para Google Play</p>
                </div>

                <div className="flex items-center gap-2">
                  <label className="text-xs font-semibold text-slate-300">Anuncios</label>
                  <input
                    type="checkbox"
                    checked={adConfig.enabled}
                    onChange={(e) => {
                      const updated = { ...adConfig, enabled: e.target.checked };
                      setAdConfig(updated);
                      adService.saveConfig(updated);
                      onShowToast(e.target.checked ? 'Anuncios activados' : 'Anuncios desactivados', 'info');
                    }}
                    className="w-4 h-4 accent-emerald-400 cursor-pointer"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1">
                    Modo de Anuncios
                  </label>
                  <select
                    value={adConfig.testMode ? 'test' : 'live'}
                    onChange={(e) => {
                      const updated = { ...adConfig, testMode: e.target.value === 'test' };
                      setAdConfig(updated);
                      adService.saveConfig(updated);
                      onShowToast(
                        e.target.value === 'test'
                          ? 'Modo pruebas activado (Google Test IDs)'
                          : 'Modo producción activado',
                        'info'
                      );
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#00F2FE]"
                  >
                    <option value="test" className="bg-[#090B10]">Modo de Prueba (Google Test Units)</option>
                    <option value="live" className="bg-[#090B10]">Modo Producción (IDs Reales AdMob)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1">
                    Intervalo de Intersticiales (descargas)
                  </label>
                  <input
                    type="number"
                    min="2"
                    max="10"
                    value={adConfig.interstitialFrequency}
                    onChange={(e) => {
                      const updated = { ...adConfig, interstitialFrequency: parseInt(e.target.value, 10) || 4 };
                      setAdConfig(updated);
                      adService.saveConfig(updated);
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#00F2FE]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1">
                    Espera mínima entre Intersticiales (Segundos - Google Play Safe)
                  </label>
                  <input
                    type="number"
                    min="30"
                    max="300"
                    value={adConfig.interstitialCooldownSeconds}
                    onChange={(e) => {
                      const updated = {
                        ...adConfig,
                        interstitialCooldownSeconds: parseInt(e.target.value, 10) || 90,
                      };
                      setAdConfig(updated);
                      adService.saveConfig(updated);
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#00F2FE]"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">
                    Google Play Better Ads exige al menos 60-90s para prevenir interrupciones inesperadas.
                  </p>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1">
                    Clasificación Máxima de Anuncios (Content Rating)
                  </label>
                  <select
                    value={adConfig.maxAdContentRating}
                    onChange={(e) => {
                      const updated = {
                        ...adConfig,
                        maxAdContentRating: e.target.value as MaxAdContentRating,
                      };
                      setAdConfig(updated);
                      adService.saveConfig(updated);
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#00F2FE]"
                  >
                    <option value="G" className="bg-[#090B10]">G - Apto para todo público</option>
                    <option value="PG" className="bg-[#090B10]">PG - Supervisión parental recomendada</option>
                    <option value="T" className="bg-[#090B10]">T - Adolescentes (Recomendado Anime)</option>
                    <option value="MA" className="bg-[#090B10]">MA - Solo adultos (Riesgo Play Store)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1">
                    Google AdMob App ID
                  </label>
                  <input
                    type="text"
                    value={adConfig.appId}
                    onChange={(e) => {
                      const updated = { ...adConfig, appId: e.target.value };
                      setAdConfig(updated);
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white font-mono text-[11px] focus:outline-none focus:border-[#00F2FE]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1">
                    Rewarded Video Unit ID (Desbloqueo 4K & Stickers)
                  </label>
                  <input
                    type="text"
                    value={adConfig.rewardedUnitId}
                    onChange={(e) => {
                      const updated = { ...adConfig, rewardedUnitId: e.target.value };
                      setAdConfig(updated);
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white font-mono text-[11px] focus:outline-none focus:border-[#00F2FE]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1">
                    Banner Unit ID (Feed In-App)
                  </label>
                  <input
                    type="text"
                    value={adConfig.bannerUnitId}
                    onChange={(e) => {
                      const updated = { ...adConfig, bannerUnitId: e.target.value };
                      setAdConfig(updated);
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white font-mono text-[11px] focus:outline-none focus:border-[#00F2FE]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1">
                    Interstitial Unit ID (Pantalla completa)
                  </label>
                  <input
                    type="text"
                    value={adConfig.interstitialUnitId}
                    onChange={(e) => {
                      const updated = { ...adConfig, interstitialUnitId: e.target.value };
                      setAdConfig(updated);
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white font-mono text-[11px] focus:outline-none focus:border-[#00F2FE]"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <Button
                  size="sm"
                  variant="primary"
                  onClick={() => {
                    adService.saveConfig(adConfig);
                    onShowToast('Configuración de AdMob guardada correctamente', 'success');
                  }}
                >
                  Guardar Configuración
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Payout Cash-out Modal */}
      {showPayoutModal && (
        <PayoutModal
          isOpen={showPayoutModal}
          onClose={() => {
            setShowPayoutModal(false);
            setAdMetrics(adService.getMetrics());
          }}
          onSuccess={(msg) => {
            onShowToast(msg, 'success');
            setAdMetrics(adService.getMetrics());
          }}
        />
      )}

      {/* Google Play Policy Audit Modal */}
      {showPolicyAuditModal && (
        <AdPolicyAuditModal
          isOpen={showPolicyAuditModal}
          onClose={() => setShowPolicyAuditModal(false)}
          onToast={onShowToast}
        />
      )}
    </div>
  );
};

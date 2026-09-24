import React, { useState, useEffect, Suspense, lazy } from 'react';
import { TopHeader } from './components/header/TopHeader';
import { BottomNavigation, NavTab } from './components/navigation/BottomNavigation';
import { ToastContainer, ToastMessage } from './components/common/Toast';
import { OfflineIndicator } from './components/common/OfflineIndicator';
import { SkeletonGrid } from './components/common/LoadingSkeleton';
import { useFavorites } from './hooks/useFavorites';
import { useDownloads } from './hooks/useDownloads';
import { useUserProfile } from './hooks/useUserProfile';
import { useTheme } from './hooks/useTheme';
import { Wallpaper } from './types/wallpaper.types';
import { WallpaperApplierService } from './services/wallpaperApplier';
import { wallpaperRepository } from './repositories';
import { adService } from './services/adService';
import { analytics } from './services/analyticsService';
import { adminAuthService } from './services/adminAuthService';

// Code-split: cada pantalla y modal pesado va en chunk separado.
// El bundle inicial queda solo con shell (header/nav/home).
const HomeScreen = lazy(() => import('./components/home/HomeScreen').then((m) => ({ default: m.HomeScreen })));
const ExploreScreen = lazy(() => import('./components/explore/ExploreScreen').then((m) => ({ default: m.ExploreScreen })));
const SearchScreen = lazy(() => import('./components/search/SearchScreen').then((m) => ({ default: m.SearchScreen })));
const FavoritesScreen = lazy(() => import('./components/favorites/FavoritesScreen').then((m) => ({ default: m.FavoritesScreen })));
const ProfileScreen = lazy(() => import('./components/profile/ProfileScreen').then((m) => ({ default: m.ProfileScreen })));
const StickersScreen = lazy(() => import('./components/stickers/StickersScreen').then((m) => ({ default: m.StickersScreen })));
const AdminPanel = lazy(() => import('./components/admin/AdminPanel').then((m) => ({ default: m.AdminPanel })));
const FullscreenViewer = lazy(() => import('./components/viewer/FullscreenViewer').then((m) => ({ default: m.FullscreenViewer })));
const ApplyWallpaperModal = lazy(() => import('./components/viewer/ApplyWallpaperModal').then((m) => ({ default: m.ApplyWallpaperModal })));
const InterstitialAdModal = lazy(() => import('./components/ads/InterstitialAdModal').then((m) => ({ default: m.InterstitialAdModal })));
const RewardedAdModal = lazy(() => import('./components/ads/RewardedAdModal').then((m) => ({ default: m.RewardedAdModal })));
const AdminAuthModal = lazy(() => import('./components/admin/AdminAuthModal').then((m) => ({ default: m.AdminAuthModal })));

function ScreenFallback() {
  return (
    <div className="pt-2">
      <SkeletonGrid count={6} />
    </div>
  );
}

export default function App() {
  const [currentTab, setCurrentTab] = useState<NavTab>('home');
  const [selectedWallpaper, setSelectedWallpaper] = useState<Wallpaper | null>(null);
  const [quickApplyWallpaper, setQuickApplyWallpaper] = useState<Wallpaper | null>(null);
  const [allWallpapers, setAllWallpapers] = useState<Wallpaper[]>([]);
  const [showInterstitialAd, setShowInterstitialAd] = useState(false);
  const [showAdminAuthModal, setShowAdminAuthModal] = useState(false);
  const [rewardedAdModal, setRewardedAdModal] = useState<{
    isOpen: boolean;
    rewardTitle: string;
    onGranted: () => void;
  } | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Custom Hooks
  const { favorites, toggleFavorite, count: favoritesCount } = useFavorites();
  const { history: downloadsHistory, download, clearHistory: clearDownloads } = useDownloads();
  const {
    profile,
    updatePreferences,
    loginWithGoogle,
    loginWithEmail,
    logout,
    togglePremium,
    clearCache,
  } = useUserProfile();
  const { theme, setTheme, amoledMode, setAmoledMode } = useTheme();

  // Sincroniza el tema elegido en Perfil con el tema global (fix: antes estaban desconectados)
  useEffect(() => {
    if (profile.preferences.theme !== theme) {
      setTheme(profile.preferences.theme);
    }
  }, [profile.preferences.theme, theme, setTheme]);

  useEffect(() => {
    if (profile.preferences.amoledPureBlack !== amoledMode) {
      setAmoledMode(profile.preferences.amoledPureBlack);
    }
  }, [profile.preferences.amoledPureBlack, amoledMode, setAmoledMode]);

  // Load catalog wallpapers
  useEffect(() => {
    wallpaperRepository.getAllWallpapers().then((wps) => setAllWallpapers(wps));
  }, []);

  // Network listener
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      showToast('Conexión reestablecida', 'success');
    };
    const handleOffline = () => {
      setIsOnline(false);
      showToast('Sin conexión a internet. Mostrando contenido en caché.', 'info');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const showToast = (text: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    setToasts((prev) => [...prev, { id, text, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const handleDismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Open Fullscreen Viewer and track view
  const handleSelectWallpaper = (wallpaper: Wallpaper) => {
    setSelectedWallpaper(wallpaper);
    analytics.track('wallpaper_view', { id: wallpaper.id, title: wallpaper.title });
  };

  // Quick download helper
  const handleQuickDownload = async (wallpaper: Wallpaper, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();

    // Check if wallpaper is VIP and needs rewarded ad unlock
    if (wallpaper.isPremium && !profile.isPremium && !adService.isWallpaperUnlocked(wallpaper.id)) {
      setRewardedAdModal({
        isOpen: true,
        rewardTitle: `Wallpaper VIP 4K "${wallpaper.title}"`,
        onGranted: async () => {
          adService.unlockWallpaper(wallpaper.id);
          showToast(`¡"${wallpaper.title}" desbloqueado gratis!`, 'success');
          await executeDownload(wallpaper);
        },
      });
      return;
    }

    await executeDownload(wallpaper);
  };

  const executeDownload = async (wallpaper: Wallpaper) => {
    showToast(`Iniciando descarga 4K de ${wallpaper.title}...`, 'info');
    const success = await download(
      wallpaper.id,
      wallpaper.title,
      wallpaper.urls.uhd4k || wallpaper.urls.preview,
      '4K',
      wallpaper.urls.thumbnail
    );
    if (success) {
      showToast(`¡"${wallpaper.title}" descargado con éxito en 4K!`, 'success');
      // Trigger AdMob Interstitial if frequency threshold met
      if (adService.incrementDownloadAndCheckInterstitial()) {
        setTimeout(() => setShowInterstitialAd(true), 600);
      }
    }
  };

  // Quick share helper
  const handleQuickShare = async (wallpaper: Wallpaper, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const success = await WallpaperApplierService.shareWallpaper(
      wallpaper.title,
      window.location.href,
      wallpaper.urls.fhd || wallpaper.urls.preview
    );
    if (success) {
      showToast('Fondo compartido', 'success');
    }
  };

  const handleWatchAdFreePass = () => {
    setRewardedAdModal({
      isOpen: true,
      rewardTitle: 'Pase 2 Horas Sin Anuncios VIP',
      onGranted: () => {
        adService.grantAdFreeHours(2);
        showToast('¡Pase de 2 Horas Sin Anuncios activado con éxito! 🛡️ Disfruta sin interrupciones.', 'success');
      },
    });
  };

  return (
    <div
      className={`min-h-screen bg-[#090B10] text-slate-100 flex flex-col font-sans transition-colors ${
        amoledMode ? 'bg-black' : 'bg-[#090B10]'
      }`}
    >
      {/* Toast Notification Layer */}
      <ToastContainer toasts={toasts} onDismiss={handleDismissToast} />
      <OfflineIndicator />

      {/* ADMIN PANEL FULLSCREEN VIEW */}
      {currentTab === 'admin' ? (
        <Suspense fallback={<ScreenFallback />}>
          <AdminPanel
            onClose={() => setCurrentTab('profile')}
            onShowToast={showToast}
          />
        </Suspense>
      ) : (
        <>
          {/* Top Sticky Header */}
          <TopHeader
            userProfile={profile}
            onOpenProfile={() => setCurrentTab('profile')}
            onOpenSearch={() => setCurrentTab('search')}
            isOnline={isOnline}
          />

          {/* Main Content Area */}
          <main className="flex-1 w-full max-w-lg md:max-w-2xl mx-auto overflow-x-hidden pb-24">
            <Suspense fallback={<ScreenFallback />}>
            {currentTab === 'home' && (
              <HomeScreen
                onSelectWallpaper={handleSelectWallpaper}
                onApplyWallpaper={(wp) => setQuickApplyWallpaper(wp)}
                favorites={favorites}
                onToggleFavorite={toggleFavorite}
                onNavigateTab={setCurrentTab}
                onQuickDownload={handleQuickDownload}
                onQuickShare={handleQuickShare}
                onRequestAdFreePass={handleWatchAdFreePass}
              />
            )}

            {currentTab === 'explore' && (
              <ExploreScreen
                onSelectWallpaper={handleSelectWallpaper}
                favorites={favorites}
                onToggleFavorite={toggleFavorite}
                onQuickDownload={handleQuickDownload}
                onQuickShare={handleQuickShare}
              />
            )}

            {currentTab === 'stickers' && (
              <StickersScreen
                wallpapers={allWallpapers}
                onShowToast={showToast}
              />
            )}

            {currentTab === 'search' && (
              <SearchScreen
                onSelectWallpaper={handleSelectWallpaper}
                favorites={favorites}
                onToggleFavorite={toggleFavorite}
                onQuickDownload={handleQuickDownload}
                onQuickShare={handleQuickShare}
              />
            )}

            {currentTab === 'favorites' && (
              <FavoritesScreen
                favorites={favorites}
                onToggleFavorite={toggleFavorite}
                onSelectWallpaper={handleSelectWallpaper}
                onExplore={() => setCurrentTab('explore')}
                downloadsHistory={downloadsHistory}
                onClearDownloads={clearDownloads}
                onQuickDownload={handleQuickDownload}
                onQuickShare={handleQuickShare}
              />
            )}

            {currentTab === 'profile' && (
              <ProfileScreen
                userProfile={profile}
                onUpdatePreference={updatePreferences}
                onLoginGoogle={loginWithGoogle}
                onLoginEmail={loginWithEmail}
                onLogout={logout}
                onTogglePremium={togglePremium}
                onClearCache={clearCache}
                onShowToast={showToast}
                onOpenAdmin={() => {
                  if (adminAuthService.isAdminUnlocked(profile.email)) {
                    setCurrentTab('admin');
                  } else {
                    setShowAdminAuthModal(true);
                  }
                }}
                onRequestAdFreePass={handleWatchAdFreePass}
                favoritesCount={favoritesCount}
                downloadsCount={downloadsHistory.length}
              />
            )}
            </Suspense>
          </main>

          {/* Bottom Navigation (Admin tab only visible if authorized) */}
          <BottomNavigation
            currentTab={currentTab}
            onSelectTab={(tab) => {
              if (tab === 'admin' && !adminAuthService.isAdminUnlocked(profile.email)) {
                setShowAdminAuthModal(true);
                return;
              }
              setCurrentTab(tab);
            }}
            favoritesCount={favoritesCount}
            showAdminTab={adminAuthService.isAdminUnlocked(profile.email)}
          />
        </>
      )}

      {/* FULLSCREEN WALLPAPER VIEWER MODAL */}
      {selectedWallpaper && (
        <Suspense fallback={null}>
          <FullscreenViewer
            wallpaper={selectedWallpaper}
            onClose={() => setSelectedWallpaper(null)}
            isFavorite={favorites.includes(selectedWallpaper.id)}
            onToggleFavorite={toggleFavorite}
            onDownload={(wp, quality) => handleQuickDownload(wp)}
            onShowToast={showToast}
          />
        </Suspense>
      )}

      {/* QUICK APPLY WALLPAPER MODAL */}
      {quickApplyWallpaper && (
        <Suspense fallback={null}>
          <ApplyWallpaperModal
            wallpaper={quickApplyWallpaper}
            isOpen={Boolean(quickApplyWallpaper)}
            onClose={() => setQuickApplyWallpaper(null)}
            onSuccess={(msg) => showToast(msg, 'success')}
          />
        </Suspense>
      )}

      {/* INTERSTITIAL AD MODAL */}
      {showInterstitialAd && (
        <Suspense fallback={null}>
          <InterstitialAdModal
            isOpen={showInterstitialAd}
            onClose={() => setShowInterstitialAd(false)}
          />
        </Suspense>
      )}

      {/* REWARDED AD MODAL (VIP / 4K / STICKERS) */}
      {rewardedAdModal?.isOpen && (
        <Suspense fallback={null}>
          <RewardedAdModal
            isOpen={rewardedAdModal.isOpen}
            rewardTitle={rewardedAdModal.rewardTitle}
            onRewardGranted={() => {
              rewardedAdModal.onGranted();
              setRewardedAdModal(null);
            }}
            onClose={() => setRewardedAdModal(null)}
          />
        </Suspense>
      )}

      {/* ADMIN AUTH MODAL (PROTECTS OWNER ACCESS) */}
      <Suspense fallback={null}>
        <AdminAuthModal
          isOpen={showAdminAuthModal}
          onClose={() => setShowAdminAuthModal(false)}
          currentUserEmail={profile.email}
          onShowToast={showToast}
          onSuccess={() => {
            setShowAdminAuthModal(false);
            setCurrentTab('admin');
          }}
        />
      </Suspense>
    </div>
  );
}

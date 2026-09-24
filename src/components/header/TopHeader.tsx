import React, { useState } from 'react';
import { Bell, Search, WifiOff } from 'lucide-react';
import { BRAND } from '../../config/brand.config';
import { UserProfile } from '../../types/user.types';
import { notificationService, InAppNotification } from '../../services/notificationService';
import { NotificationPopover } from './NotificationPopover';
import { PWAInstallButton } from '../common/PWAInstallButton';

interface TopHeaderProps {
  userProfile: UserProfile;
  onOpenProfile: () => void;
  onOpenSearch: () => void;
  isOnline?: boolean;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  userProfile,
  onOpenProfile,
  onOpenSearch,
  isOnline = true,
}) => {
  const [notifications, setNotifications] = useState<InAppNotification[]>(() =>
    notificationService.getAll()
  );
  const [showNotifications, setShowNotifications] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkAllRead = () => {
    const updated = notificationService.markAllAsRead();
    setNotifications(updated);
  };

  const handleMarkAsRead = (id: string) => {
    const updated = notificationService.markAsRead(id);
    setNotifications(updated);
  };

  const handleDeleteNotification = (id: string) => {
    const updated = notificationService.deleteNotification(id);
    setNotifications(updated);
  };

  const handleClearAll = () => {
    const updated = notificationService.clearAll();
    setNotifications(updated);
  };

  return (
    <header className="sticky top-0 inset-x-0 z-30 bg-[#090B10]/90 backdrop-blur-xl border-b border-white/5 px-4 pt-[calc(0.625rem+env(safe-area-inset-top,0px))] pb-2.5 max-w-lg mx-auto transition-all">
      <div className="flex items-center justify-between">
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-[#FF4D8D] via-[#7928CA] to-[#00F2FE] p-[1.5px] shadow-lg shadow-[#FF4D8D]/20">
            <div className="w-full h-full rounded-[14px] bg-[#090B10] flex items-center justify-center">
              <span className="font-bold text-sm bg-gradient-to-tr from-[#FF4D8D] to-[#00F2FE] bg-clip-text text-transparent">
                幽
              </span>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-sm tracking-wider text-white">
                {BRAND.name}
              </span>
              <span className="text-[10px] text-[#FF4D8D] font-bold">4K</span>
            </div>
            <span className="text-[10px] text-slate-400 block -mt-0.5 tracking-tight font-light">
              {BRAND.kanji} · Anime Wallpaper Studio
            </span>
          </div>
        </div>

        {/* Action icons (PWA Install, Offline badge, Notifications, Avatar) */}
        <div className="flex items-center gap-2">
          <PWAInstallButton compact />

          <button
            onClick={onOpenSearch}
            aria-label="Buscar fondos"
            className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-2xl flex items-center justify-center transition-all cursor-pointer bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white"
          >
            <Search className="w-4 h-4" />
          </button>

          {!isOnline && (
            <div
              title="Modo sin conexión"
              className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-semibold border border-amber-500/30"
            >
              <WifiOff className="w-3 h-3" /> Offline
            </div>
          )}

          {/* Notifications Trigger & Popover */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications((prev) => !prev)}
              aria-label="Notificaciones"
              className={`w-11 h-11 min-w-[44px] min-h-[44px] rounded-2xl flex items-center justify-center transition-all cursor-pointer relative ${
                showNotifications
                  ? 'bg-white/15 text-white ring-2 ring-white/20'
                  : 'bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white'
              }`}
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-[#FF4D8D] ring-2 ring-[#090B10] animate-pulse" />
              )}
            </button>

            <NotificationPopover
              isOpen={showNotifications}
              onClose={() => setShowNotifications(false)}
              notifications={notifications}
              unreadCount={unreadCount}
              onMarkAllRead={handleMarkAllRead}
              onMarkAsRead={handleMarkAsRead}
              onDeleteNotification={handleDeleteNotification}
              onClearAll={handleClearAll}
            />
          </div>

          {/* User Avatar */}
          <button
            onClick={onOpenProfile}
            aria-label="Abrir perfil de usuario"
            className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-2xl overflow-hidden border border-white/15 relative cursor-pointer active:scale-95 transition-transform"
          >
            <img
              src={userProfile.avatarUrl}
              alt={userProfile.displayName}
              className="w-full h-full object-cover"
            />
            {userProfile.isPremium && (
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-amber-400 ring-1 ring-[#090B10]" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

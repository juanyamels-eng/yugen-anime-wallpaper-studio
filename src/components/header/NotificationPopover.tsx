import React, { useEffect, useRef } from 'react';
import { Bell, CheckCheck, Trash2, X, Sparkles, Layers, ShieldCheck, Flame, BellOff } from 'lucide-react';
import { InAppNotification } from '../../services/notificationService';

interface NotificationPopoverProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: InAppNotification[];
  unreadCount: number;
  onMarkAllRead: () => void;
  onMarkAsRead: (id: string) => void;
  onDeleteNotification: (id: string) => void;
  onClearAll: () => void;
}

export const NotificationPopover: React.FC<NotificationPopoverProps> = ({
  isOpen,
  onClose,
  notifications,
  unreadCount,
  onMarkAllRead,
  onMarkAsRead,
  onDeleteNotification,
  onClearAll,
}) => {
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const getCategoryIcon = (category: InAppNotification['category']) => {
    switch (category) {
      case 'collection':
        return <Layers className="w-3.5 h-3.5 text-[#00F2FE]" />;
      case 'new_drop':
        return <Flame className="w-3.5 h-3.5 text-[#FF4D8D]" />;
      case 'premium':
        return <Sparkles className="w-3.5 h-3.5 text-amber-400" />;
      case 'system':
      default:
        return <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />;
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 sm:hidden animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Popover Card */}
      <div
        ref={popoverRef}
        className="fixed sm:absolute top-14 left-4 right-4 sm:left-auto sm:right-0 sm:w-84 z-50 bg-[#101420]/95 backdrop-blur-2xl border border-white/15 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] overflow-hidden animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="px-4 py-3.5 bg-white/[0.03] border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-[#FF4D8D]/15 border border-[#FF4D8D]/30 flex items-center justify-center text-[#FF4D8D]">
              <Bell className="w-3.5 h-3.5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-extrabold text-white tracking-wide">Notificaciones</span>
                {unreadCount > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full bg-[#FF4D8D] text-white text-[10px] font-bold">
                    {unreadCount}
                  </span>
                )}
              </div>
              <span className="text-[10px] text-slate-400">Novedades y colecciones</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {unreadCount > 0 && (
              <button
                onClick={onMarkAllRead}
                className="p-1.5 rounded-lg text-slate-300 hover:text-[#00F2FE] hover:bg-white/5 transition-colors cursor-pointer"
                title="Marcar todas como leídas"
              >
                <CheckCheck className="w-4 h-4" />
              </button>
            )}
            {notifications.length > 0 && (
              <button
                onClick={onClearAll}
                className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-white/5 transition-colors cursor-pointer"
                title="Limpiar todas"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Notification List */}
        <div className="max-h-[360px] overflow-y-auto divide-y divide-white/5 p-2 space-y-1">
          {notifications.length === 0 ? (
            <div className="py-10 px-4 text-center">
              <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-2 text-slate-500">
                <BellOff className="w-5 h-5" />
              </div>
              <p className="text-xs font-semibold text-slate-300">No tienes notificaciones</p>
              <p className="text-[11px] text-slate-500 mt-0.5">Te avisaremos cuando hayan nuevas colecciones 4K.</p>
            </div>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                onClick={() => onMarkAsRead(n.id)}
                className={`p-3 rounded-2xl transition-all cursor-pointer relative group flex items-start gap-2.5 ${
                  n.read
                    ? 'bg-transparent hover:bg-white/[0.03] text-slate-400'
                    : 'bg-white/[0.06] hover:bg-white/[0.09] text-slate-200 border border-white/10'
                }`}
              >
                {/* Category Icon */}
                <div
                  className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                    n.read ? 'bg-white/5 border border-white/5' : 'bg-white/10 border border-white/15'
                  }`}
                >
                  {getCategoryIcon(n.category)}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 pr-4">
                  <div className="flex items-center justify-between gap-1 mb-0.5">
                    <h4
                      className={`text-xs font-bold truncate ${
                        n.read ? 'text-slate-300' : 'text-white'
                      }`}
                    >
                      {n.title}
                    </h4>
                    <span className="text-[9px] font-mono text-slate-500 shrink-0">{n.timeAgo}</span>
                  </div>
                  <p className="text-[11px] leading-relaxed text-slate-400 line-clamp-2">{n.body}</p>
                </div>

                {/* Unread dot or Delete on hover */}
                <div className="shrink-0 flex items-center">
                  {!n.read && (
                    <span className="w-2 h-2 rounded-full bg-[#FF4D8D] group-hover:hidden" />
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteNotification(n.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-white/10 text-slate-400 hover:text-red-400 transition-all cursor-pointer"
                    title="Eliminar notificación"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

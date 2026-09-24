import React, { useState } from 'react';
import { Wifi, Battery, Signal, Bell, MessageSquare, Phone, Compass, Camera, Music, Calendar } from 'lucide-react';
import { Wallpaper } from '../../types/wallpaper.types';

interface PhonePreviewMockupProps {
  wallpaper: Wallpaper;
  initialMode?: 'lock' | 'home';
  onClose?: () => void;
}

export const PhonePreviewMockup: React.FC<PhonePreviewMockupProps> = ({
  wallpaper,
  initialMode = 'lock',
  onClose,
}) => {
  const [screenMode, setScreenMode] = useState<'lock' | 'home'>(initialMode);

  // Time formatter
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  const dateStr = `${days[now.getDay()]}, ${now.getDate()} de ${months[now.getMonth()]}`;

  return (
    <div className="flex flex-col items-center justify-center p-2 w-full max-w-sm mx-auto">
      {/* Mode Switcher Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-black/60 backdrop-blur-md rounded-2xl border border-white/10 mb-3 shadow-lg">
        <button
          onClick={() => setScreenMode('lock')}
          className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            screenMode === 'lock'
              ? 'bg-[#FF4D8D] text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Pantalla de Bloqueo
        </button>
        <button
          onClick={() => setScreenMode('home')}
          className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            screenMode === 'home'
              ? 'bg-[#00F2FE] text-black shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Pantalla de Inicio
        </button>
      </div>

      {/* Simulated Smartphone Frame */}
      <div className="relative w-[285px] sm:w-[310px] aspect-[9/19.5] rounded-[42px] p-2.5 bg-[#181D28] border-4 border-[#2A3347] shadow-2xl shadow-black/80 overflow-hidden ring-1 ring-white/10">
        {/* Dynamic Island / Camera Notch */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-24 h-5 bg-black rounded-full z-30 flex items-center justify-end px-2">
          <div className="w-2.5 h-2.5 rounded-full bg-[#111] border border-neutral-700/50" />
        </div>

        {/* Wallpaper Layer */}
        <div className="relative w-full h-full rounded-[34px] overflow-hidden">
          <img
            src={wallpaper.urls.preview}
            alt={wallpaper.title}
            className="w-full h-full object-cover select-none"
          />

          {/* Status Bar */}
          <div className="absolute top-2 inset-x-5 flex items-center justify-between text-[11px] font-semibold text-white drop-shadow-md z-20">
            <span>{hours}:{minutes}</span>
            <div className="flex items-center gap-1.5">
              <Signal className="w-3 h-3" />
              <Wifi className="w-3 h-3" />
              <Battery className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* LOCK SCREEN OVERLAY */}
          {screenMode === 'lock' && (
            <div className="absolute inset-0 flex flex-col justify-between pt-14 pb-8 px-5 z-20 pointer-events-none text-white animate-in fade-in duration-300">
              {/* Clock & Date in upper negative space */}
              <div className="text-center drop-shadow-lg">
                <p className="text-xs font-medium tracking-wide text-white/90 drop-shadow">{dateStr}</p>
                <h1 className="text-6xl font-extralight tracking-tight font-sans drop-shadow-2xl">
                  {hours}:{minutes}
                </h1>
                <p className="text-[11px] font-medium text-white/75 mt-1 flex items-center justify-center gap-1">
                  <span>22°C</span> · <span>Tokio</span>
                </p>
              </div>

              {/* Simulated Notification Card */}
              <div className="p-3 rounded-2xl bg-black/45 backdrop-blur-xl border border-white/15 text-left shadow-xl">
                <div className="flex items-center justify-between text-[10px] text-white/70 mb-1">
                  <span className="flex items-center gap-1 font-semibold text-[#FF4D8D]">
                    <Bell className="w-3 h-3" /> YŪGEN ANIME
                  </span>
                  <span>ahora</span>
                </div>
                <p className="text-xs font-semibold text-white leading-tight">Nueva colección de Tokio lanzada</p>
                <p className="text-[10px] text-white/70 truncate">Explora fondos originales en resolución 4K UHD.</p>
              </div>

              {/* Bottom Lockscreen Shortcuts */}
              <div className="flex items-center justify-between px-2 pt-2">
                <div className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md border border-white/20 flex items-center justify-center text-white">
                  <Camera className="w-4 h-4" />
                </div>
                <div className="h-1 w-28 bg-white/60 rounded-full mx-auto" />
                <div className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md border border-white/20 flex items-center justify-center text-white">
                  <Phone className="w-4 h-4" />
                </div>
              </div>
            </div>
          )}

          {/* HOME SCREEN OVERLAY */}
          {screenMode === 'home' && (
            <div className="absolute inset-0 flex flex-col justify-between pt-16 pb-6 px-4 z-20 pointer-events-none text-white animate-in fade-in duration-300">
              {/* Top Search Widget */}
              <div className="p-2.5 rounded-2xl bg-black/40 backdrop-blur-md border border-white/15 flex items-center justify-between text-xs text-white/80 shadow-md">
                <span className="text-[11px] pl-2 font-medium">Buscar en Google...</span>
                <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-[10px]">G</div>
              </div>

              {/* App Icon Grid (2 rows of 4) */}
              <div className="grid grid-cols-4 gap-y-4 gap-x-2 my-auto px-1">
                {[
                  { name: 'Teléfono', icon: <Phone className="w-5 h-5" />, color: 'bg-emerald-500' },
                  { name: 'Mensajes', icon: <MessageSquare className="w-5 h-5" />, color: 'bg-blue-500' },
                  { name: 'Cámara', icon: <Camera className="w-5 h-5" />, color: 'bg-slate-700' },
                  { name: 'Fotos', icon: <Compass className="w-5 h-5" />, color: 'bg-amber-500' },
                  { name: 'Música', icon: <Music className="w-5 h-5" />, color: 'bg-rose-500' },
                  { name: 'Calendario', icon: <Calendar className="w-5 h-5" />, color: 'bg-red-500' },
                  { name: 'Yūgen', icon: <span className="font-bold text-[11px] text-white">幽</span>, color: 'bg-gradient-to-tr from-[#FF4D8D] to-[#7928CA]' },
                  { name: 'Ajustes', icon: <span className="text-xs">⚙️</span>, color: 'bg-zinc-600' },
                ].map((app, i) => (
                  <div key={i} className="flex flex-col items-center gap-1">
                    <div className={`w-11 h-11 rounded-2xl ${app.color} text-white flex items-center justify-center shadow-lg border border-white/10`}>
                      {app.icon}
                    </div>
                    <span className="text-[10px] font-medium text-white drop-shadow max-w-[48px] truncate text-center">
                      {app.name}
                    </span>
                  </div>
                ))}
              </div>

              {/* Dock Bar */}
              <div className="p-2 rounded-3xl bg-black/50 backdrop-blur-xl border border-white/20 flex items-center justify-around shadow-2xl">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow">
                  <Phone className="w-4 h-4" />
                </div>
                <div className="w-10 h-10 rounded-2xl bg-blue-500 text-white flex items-center justify-center shadow">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#FF4D8D] to-[#7928CA] text-white flex items-center justify-center shadow">
                  <span className="font-bold text-xs">幽</span>
                </div>
                <div className="w-10 h-10 rounded-2xl bg-slate-800 text-white flex items-center justify-center shadow">
                  <Compass className="w-4 h-4" />
                </div>
              </div>

              {/* Home Indicator bar */}
              <div className="h-1 w-28 bg-white/70 rounded-full mx-auto mt-2" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

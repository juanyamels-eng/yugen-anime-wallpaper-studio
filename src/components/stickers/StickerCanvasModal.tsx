import React, { useState, useRef } from 'react';
import { X, Download, RotateCw, ZoomIn, ZoomOut, Type, Sparkles, Check } from 'lucide-react';
import { Sticker } from '../../types/sticker.types';
import { Wallpaper } from '../../types/wallpaper.types';

interface StickerCanvasModalProps {
  sticker: Sticker;
  wallpapers: Wallpaper[];
  isOpen: boolean;
  onClose: () => void;
  onShowToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const StickerCanvasModal: React.FC<StickerCanvasModalProps> = ({
  sticker,
  wallpapers,
  isOpen,
  onClose,
  onShowToast,
}) => {
  const [selectedBg, setSelectedBg] = useState<string>(
    wallpapers[0]?.urls.preview ||
      'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&q=80'
  );
  const [stickerScale, setStickerScale] = useState(1);
  const [stickerRotation, setStickerRotation] = useState(0);
  const [stickerPosX, setStickerPosX] = useState(50); // percentage
  const [stickerPosY, setStickerPosY] = useState(50); // percentage
  const [caption, setCaption] = useState('YŪGEN ANIME');
  const [isExporting, setIsExporting] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  if (!isOpen) return null;

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const canvas = document.createElement('canvas');
      canvas.width = 1080;
      canvas.height = 1920; // 9:16 mobile story / wallpaper format
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Canvas context unavailable');

      // 1. Draw background image
      const bgImg = new Image();
      bgImg.crossOrigin = 'anonymous';
      bgImg.src = selectedBg;
      await new Promise((resolve, reject) => {
        bgImg.onload = resolve;
        bgImg.onerror = reject;
      });

      // Cover-fit background
      ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);

      // Add subtle dark gradient overlay for depth
      const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
      grad.addColorStop(0, 'rgba(0,0,0,0.2)');
      grad.addColorStop(0.5, 'rgba(0,0,0,0.1)');
      grad.addColorStop(1, 'rgba(0,0,0,0.6)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 2. Draw Sticker
      const stkImg = new Image();
      stkImg.crossOrigin = 'anonymous';
      stkImg.src = sticker.imageUrl;
      await new Promise((resolve, reject) => {
        stkImg.onload = resolve;
        stkImg.onerror = reject;
      });

      const stkBaseSize = 400 * stickerScale;
      const posX = (canvas.width * stickerPosX) / 100;
      const posY = (canvas.height * stickerPosY) / 100;

      ctx.save();
      ctx.translate(posX, posY);
      ctx.rotate((stickerRotation * Math.PI) / 180);
      ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
      ctx.shadowBlur = 30;
      ctx.shadowOffsetY = 15;
      ctx.drawImage(stkImg, -stkBaseSize / 2, -stkBaseSize / 2, stkBaseSize, stkBaseSize);
      ctx.restore();

      // 3. Draw Caption if present
      if (caption.trim()) {
        ctx.save();
        ctx.font = 'bold 36px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillStyle = '#FFFFFF';
        ctx.shadowColor = 'rgba(0, 0, 0, 0.9)';
        ctx.shadowBlur = 10;
        ctx.fillText(caption.toUpperCase(), canvas.width / 2, canvas.height - 120);
        ctx.restore();
      }

      // 4. Download output
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `yugen-sticker-wallpaper-${Date.now()}.png`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
          onShowToast('¡Wallpaper personalizado con sticker descargado en alta calidad!', 'success');
          onClose();
        }
      }, 'image/png');
    } catch {
      onShowToast('Error al exportar. Comprueba la conexión.', 'error');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-[#0D1017] border border-white/15 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-5 py-3 bg-[#121622] border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#00F2FE] to-[#7928CA] flex items-center justify-center text-white">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Sticker Studio & Overlay</h3>
              <p className="text-[11px] text-slate-400">Combina stickers con wallpapers para fondos únicos</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Studio Viewport */}
        <div className="p-4 flex flex-col items-center justify-center bg-[#07090E] overflow-hidden">
          <div className="relative w-[210px] h-[370px] rounded-2xl overflow-hidden border-2 border-white/20 shadow-2xl select-none">
            {/* Background */}
            <img
              src={selectedBg}
              alt="Background"
              className="w-full h-full object-cover pointer-events-none"
            />
            <div className="absolute inset-0 bg-black/20" />

            {/* Draggable/Positionable Sticker */}
            <div
              className="absolute transition-transform duration-75 cursor-move drop-shadow-[0_8px_20px_rgba(0,0,0,0.8)]"
              style={{
                left: `${stickerPosX}%`,
                top: `${stickerPosY}%`,
                transform: `translate(-50%, -50%) scale(${stickerScale}) rotate(${stickerRotation}deg)`,
              }}
            >
              <img
                src={sticker.imageUrl}
                alt={sticker.title}
                className="w-28 h-28 object-contain pointer-events-none"
              />
            </div>

            {/* Caption in mockup */}
            {caption && (
              <div className="absolute bottom-4 inset-x-2 text-center text-white font-bold text-[11px] tracking-wider drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
                {caption}
              </div>
            )}
          </div>
        </div>

        {/* Controls */}
        <div className="p-4 bg-[#121622] border-t border-white/10 space-y-3 overflow-y-auto max-h-[40vh]">
          {/* Background selector carousel */}
          <div>
            <span className="text-[11px] font-bold text-slate-300 block mb-1.5">
              Elegir Fondo Wallpaper
            </span>
            <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
              {wallpapers.slice(0, 8).map((wp) => (
                <button
                  key={wp.id}
                  onClick={() => setSelectedBg(wp.urls.preview)}
                  className={`w-12 h-16 rounded-xl overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                    selectedBg === wp.urls.preview
                      ? 'border-[#00F2FE] scale-105 shadow-md'
                      : 'border-white/10 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={wp.urls.thumbnail} alt={wp.title} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Sliders for scale, rotation and position */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <div className="flex justify-between text-slate-400 mb-1">
                <span>Tamaño: {Math.round(stickerScale * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="1.8"
                step="0.05"
                value={stickerScale}
                onChange={(e) => setStickerScale(parseFloat(e.target.value))}
                className="w-full accent-[#00F2FE]"
              />
            </div>

            <div>
              <div className="flex justify-between text-slate-400 mb-1">
                <span>Rotación: {stickerRotation}°</span>
              </div>
              <input
                type="range"
                min="-45"
                max="45"
                step="5"
                value={stickerRotation}
                onChange={(e) => setStickerRotation(parseInt(e.target.value, 10))}
                className="w-full accent-[#7928CA]"
              />
            </div>

            <div>
              <div className="flex justify-between text-slate-400 mb-1">
                <span>Posición X: {stickerPosX}%</span>
              </div>
              <input
                type="range"
                min="20"
                max="80"
                step="2"
                value={stickerPosX}
                onChange={(e) => setStickerPosX(parseInt(e.target.value, 10))}
                className="w-full accent-[#00F2FE]"
              />
            </div>

            <div>
              <div className="flex justify-between text-slate-400 mb-1">
                <span>Posición Y: {stickerPosY}%</span>
              </div>
              <input
                type="range"
                min="20"
                max="80"
                step="2"
                value={stickerPosY}
                onChange={(e) => setStickerPosY(parseInt(e.target.value, 10))}
                className="w-full accent-[#7928CA]"
              />
            </div>
          </div>

          {/* Caption input */}
          <div>
            <label className="block text-[11px] font-bold text-slate-400 mb-1">
              Texto o Marca Personalizada
            </label>
            <input
              type="text"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Escribe algo cool..."
              className="w-full px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-[#00F2FE]"
            />
          </div>

          {/* Export button */}
          <button
            onClick={handleExport}
            disabled={isExporting}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#00F2FE] to-[#7928CA] text-white font-bold text-xs shadow-lg shadow-[#00F2FE]/20 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isExporting ? (
              <span>Generando en alta resolución 1080×1920...</span>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Exportar y Descargar Fondo HD</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

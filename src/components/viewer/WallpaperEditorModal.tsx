import React, { useState, useRef, useEffect } from 'react';
import { X, Sliders, Check, Download, Sparkles, RefreshCw, Eye } from 'lucide-react';
import { Wallpaper } from '../../types/wallpaper.types';
import { Button } from '../common/Button';

interface WallpaperEditorModalProps {
  wallpaper: Wallpaper;
  onClose: () => void;
  onCustomDownload: (customBlobUrl: string, filename: string) => void;
  onShowToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

type AspectRatio = '9/16' | '9/19.5' | '9/20' | '1/1' | '16/9';

export const WallpaperEditorModal: React.FC<WallpaperEditorModalProps> = ({
  wallpaper,
  onClose,
  onCustomDownload,
  onShowToast,
}) => {
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('9/19.5');
  const [blur, setBlur] = useState<number>(0);
  const [brightness, setBrightness] = useState<number>(100);
  const [contrast, setContrast] = useState<number>(100);
  const [saturation, setSaturation] = useState<number>(100);
  const [isExporting, setIsExporting] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Apply Quick Preset
  const applyPreset = (preset: 'original' | 'amoled' | 'blur_home' | 'night') => {
    if (preset === 'original') {
      setBlur(0);
      setBrightness(100);
      setContrast(100);
      setSaturation(100);
    } else if (preset === 'amoled') {
      setBlur(0);
      setBrightness(105);
      setContrast(125);
      setSaturation(120);
    } else if (preset === 'blur_home') {
      setBlur(12);
      setBrightness(90);
      setContrast(105);
      setSaturation(105);
    } else if (preset === 'night') {
      setBlur(2);
      setBrightness(75);
      setContrast(110);
      setSaturation(90);
    }
  };

  const getAspectClass = () => {
    switch (aspectRatio) {
      case '9/16': return 'aspect-[9/16]';
      case '9/19.5': return 'aspect-[9/19.5]';
      case '9/20': return 'aspect-[9/20]';
      case '1/1': return 'aspect-square';
      case '16/9': return 'aspect-[16/9]';
      default: return 'aspect-[9/19.5]';
    }
  };

  // Render to canvas with exact filters and crop
  const handleExport = async (forApply: boolean = false) => {
    setIsExporting(true);
    try {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = wallpaper.urls.uhd4k || wallpaper.urls.original || wallpaper.urls.preview;

      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Canvas context not available');

      // Target aspect ratio dimensions (standardizing to UHD vertical 2160 width or appropriate ratio)
      let targetW = 1440;
      let targetH = 3120; // 9:19.5 standard
      if (aspectRatio === '9/16') {
        targetW = 1440; targetH = 2560;
      } else if (aspectRatio === '9/20') {
        targetW = 1440; targetH = 3200;
      } else if (aspectRatio === '1/1') {
        targetW = 2048; targetH = 2048;
      } else if (aspectRatio === '16/9') {
        targetW = 3840; targetH = 2160;
      }

      canvas.width = targetW;
      canvas.height = targetH;

      // Apply CSS-like filters on Canvas
      ctx.filter = `blur(${blur * 2}px) brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`;

      // Crop image to cover target canvas centered
      const imgRatio = img.width / img.height;
      const targetRatio = targetW / targetH;
      let renderW = targetW;
      let renderH = targetH;
      let offsetX = 0;
      let offsetY = 0;

      if (imgRatio > targetRatio) {
        renderH = targetH;
        renderW = targetH * imgRatio;
        offsetX = (targetW - renderW) / 2;
      } else {
        renderW = targetW;
        renderH = targetW / imgRatio;
        offsetY = (targetH - renderH) / 2;
      }

      ctx.drawImage(img, offsetX, offsetY, renderW, renderH);

      canvas.toBlob((blob) => {
        if (!blob) {
          onShowToast('Error al generar la imagen', 'error');
          setIsExporting(false);
          return;
        }

        const customUrl = URL.createObjectURL(blob);
        const filename = `yugen_${wallpaper.title.toLowerCase().replace(/[^a-z0-9]/g, '_')}_custom.jpg`;

        if (forApply) {
          onCustomDownload(customUrl, filename);
        } else {
          // Download directly
          const link = document.createElement('a');
          link.href = customUrl;
          link.download = filename;
          link.click();
          onShowToast('Fondo personalizado descargado en alta calidad', 'success');
        }

        setIsExporting(false);
      }, 'image/jpeg', 0.95);
    } catch (err) {
      console.error(err);
      onShowToast('No se pudo procesar la imagen con los filtros seleccionados', 'error');
      setIsExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xl flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-[#121622] border border-white/10 rounded-3xl p-5 shadow-2xl flex flex-col max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-[#00F2FE]" />
            <h3 className="text-sm font-bold text-white">Personalizar & Recortar Fondo</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Live Preview Canvas Container */}
        <div className="py-4 flex justify-center items-center bg-[#090B10] rounded-2xl my-3 border border-white/5 overflow-hidden">
          <div
            className={`relative max-h-56 max-w-[200px] overflow-hidden rounded-xl border border-white/20 shadow-xl transition-all duration-200 ${getAspectClass()}`}
          >
            <img
              src={wallpaper.urls.uhd4k || wallpaper.urls.preview}
              alt="Preview"
              className="w-full h-full object-cover transition-all"
              style={{
                filter: `blur(${blur}px) brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`,
              }}
            />
            {blur > 4 && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-black/60 text-white/90 backdrop-blur-sm">
                  Modo Iconos Home
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Presets Row */}
        <div className="mb-4">
          <label className="text-[11px] font-semibold text-slate-400 block mb-2">Preajustes Rápidos</label>
          <div className="grid grid-cols-4 gap-2">
            <button
              onClick={() => applyPreset('original')}
              className="py-1.5 px-2 rounded-xl bg-white/5 hover:bg-white/10 text-[11px] font-medium text-slate-200 cursor-pointer border border-white/5 active:scale-95"
            >
              Original
            </button>
            <button
              onClick={() => applyPreset('amoled')}
              className="py-1.5 px-2 rounded-xl bg-gradient-to-r from-[#FF4D8D]/20 to-[#EC4899]/20 hover:bg-[#FF4D8D]/30 text-[11px] font-semibold text-[#FF4D8D] cursor-pointer border border-[#FF4D8D]/30 active:scale-95"
            >
              AMOLED
            </button>
            <button
              onClick={() => applyPreset('blur_home')}
              className="py-1.5 px-2 rounded-xl bg-[#00F2FE]/15 hover:bg-[#00F2FE]/25 text-[11px] font-semibold text-[#00F2FE] cursor-pointer border border-[#00F2FE]/30 active:scale-95"
            >
              Blur Home
            </button>
            <button
              onClick={() => applyPreset('night')}
              className="py-1.5 px-2 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-[11px] font-semibold text-purple-300 cursor-pointer border border-purple-500/30 active:scale-95"
            >
              Nocturno
            </button>
          </div>
        </div>

        {/* Aspect Ratio Selector */}
        <div className="mb-4">
          <label className="text-[11px] font-semibold text-slate-400 block mb-2">Formato de Pantalla (Ratio)</label>
          <div className="grid grid-cols-5 gap-1.5">
            {(['9/16', '9/19.5', '9/20', '1/1', '16/9'] as AspectRatio[]).map((r) => (
              <button
                key={r}
                onClick={() => setAspectRatio(r)}
                className={`py-1.5 rounded-xl text-[11px] font-bold transition-all cursor-pointer ${
                  aspectRatio === r
                    ? 'bg-white text-black shadow-md'
                    : 'bg-white/5 text-slate-400 hover:text-white border border-white/5'
                }`}
              >
                {r === '9/19.5' ? 'iPhone' : r === '9/16' ? '9:16' : r === '9/20' ? '9:20' : r === '1/1' ? '1:1' : '16:9'}
              </button>
            ))}
          </div>
        </div>

        {/* Sliders: Blur, Brightness, Contrast, Saturation */}
        <div className="space-y-3 mb-5">
          <div>
            <div className="flex justify-between text-[11px] mb-1">
              <span className="text-slate-300">Desenfoque (Blur)</span>
              <span className="text-slate-400 font-mono">{blur}px</span>
            </div>
            <input
              type="range"
              min="0"
              max="20"
              step="1"
              value={blur}
              onChange={(e) => setBlur(Number(e.target.value))}
              className="w-full accent-[#00F2FE] cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-[11px] mb-1">
              <span className="text-slate-300">Brillo</span>
              <span className="text-slate-400 font-mono">{brightness}%</span>
            </div>
            <input
              type="range"
              min="60"
              max="140"
              step="5"
              value={brightness}
              onChange={(e) => setBrightness(Number(e.target.value))}
              className="w-full accent-[#FF4D8D] cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-[11px] mb-1">
              <span className="text-slate-300">Contraste (Negro Puro)</span>
              <span className="text-slate-400 font-mono">{contrast}%</span>
            </div>
            <input
              type="range"
              min="80"
              max="140"
              step="5"
              value={contrast}
              onChange={(e) => setContrast(Number(e.target.value))}
              className="w-full accent-[#00F2FE] cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-[11px] mb-1">
              <span className="text-slate-300">Saturación de Color</span>
              <span className="text-slate-400 font-mono">{saturation}%</span>
            </div>
            <input
              type="range"
              min="60"
              max="150"
              step="5"
              value={saturation}
              onChange={(e) => setSaturation(Number(e.target.value))}
              className="w-full accent-[#FF4D8D] cursor-pointer"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 pt-2 border-t border-white/10">
          <button
            onClick={() => applyPreset('original')}
            className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-300 cursor-pointer"
            title="Restablecer"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <Button
            onClick={() => handleExport(false)}
            isLoading={isExporting}
            variant="primary"
            leftIcon={<Download className="w-4 h-4" />}
            className="flex-1 text-xs font-bold uppercase tracking-wider shadow-lg shadow-[#FF4D8D]/25"
          >
            Descargar Ajustado
          </Button>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  text: string;
}

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-2 pointer-events-none w-full max-w-sm px-4">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-2xl backdrop-blur-2xl border shadow-2xl transition-all duration-300 animate-in fade-in slide-in-from-top-3 ${
            t.type === 'success'
              ? 'bg-[#0E1716]/95 border-emerald-500/30 text-emerald-100 shadow-emerald-950/40'
              : t.type === 'error'
              ? 'bg-[#1C0F14]/95 border-rose-500/30 text-rose-100 shadow-rose-950/40'
              : 'bg-[#0D1424]/95 border-[#00F2FE]/30 text-cyan-100 shadow-cyan-950/40'
          }`}
        >
          {t.type === 'success' && (
            <div className="w-7 h-7 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
          )}
          {t.type === 'error' && (
            <div className="w-7 h-7 rounded-xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center shrink-0">
              <AlertCircle className="w-4 h-4 text-rose-400" />
            </div>
          )}
          {t.type === 'info' && (
            <div className="w-7 h-7 rounded-xl bg-[#00F2FE]/20 border border-[#00F2FE]/30 flex items-center justify-center shrink-0">
              <Info className="w-4 h-4 text-[#00F2FE]" />
            </div>
          )}

          <p className="text-xs font-semibold flex-1 leading-snug">{t.text}</p>

          <button
            onClick={() => onDismiss(t.id)}
            className="p-1 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer shrink-0"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
};

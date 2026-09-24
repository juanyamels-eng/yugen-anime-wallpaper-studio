import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { reportError } from '../../services/errorLog';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  message: string;
}

/**
 * Evita la pantalla negra total en Android: muestra fallback con reintento
 * y guarda el error en el registro local.
 */
export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false, message: '' };

  static getDerivedStateFromError(error: unknown): ErrorBoundaryState {
    return { hasError: true, message: error instanceof Error ? error.message : String(error) };
  }

  componentDidCatch(error: unknown): void {
    reportError(error instanceof Error ? error.stack || error.message : String(error), 'react');
  }

  private handleRetry = () => {
    this.setState({ hasError: false, message: '' });
    window.location.reload();
  };

  render(): React.ReactNode {
    if (this.state.hasError) {
      return (
        <div className="min-h-dvh bg-[#090B10] text-slate-200 flex flex-col items-center justify-center p-6 text-center">
          <div className="w-14 h-14 rounded-2xl bg-[#FF4D8D]/15 border border-[#FF4D8D]/30 flex items-center justify-center text-[#FF4D8D] mb-4">
            <AlertTriangle className="w-7 h-7" />
          </div>
          <h2 className="text-base font-bold text-white mb-1">Algo falló al cargar Yūgen</h2>
          <p className="text-xs text-slate-400 max-w-xs mb-5">
            {this.state.message || 'Error inesperado. Tu colección local está a salvo.'}
          </p>
          <button
            onClick={this.handleRetry}
            className="min-h-[48px] px-6 rounded-2xl bg-[#FF4D8D] text-white text-sm font-bold active:scale-95 transition-transform"
          >
            Reintentar
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

// Defensive guard to ensure window.fetch is writable and has setter in iframe environments
(function ensureFetchSetter() {
  try {
    if (typeof window === 'undefined') return;
    var p = window;
    while (p) {
      try {
        var d = Object.getOwnPropertyDescriptor(p, 'fetch');
        if (d && d.configurable) {
          (function(desc, proto) {
            Object.defineProperty(proto, 'fetch', {
              get: function() {
                return this.__custom_fetch__ || (desc.get ? desc.get.call(this) : desc.value);
              },
              set: function(val) {
                this.__custom_fetch__ = val;
              },
              configurable: true,
              enumerable: true
            });
          })(d, p);
        }
      } catch (err) {}
      p = Object.getPrototypeOf(p);
    }

    var original = window.fetch ? window.fetch.bind(window) : null;
    var current = original;
    try {
      Object.defineProperty(window, 'fetch', {
        get: function() {
          return current || (window as any).__custom_fetch__ || original;
        },
        set: function(val) {
          current = val;
          try { (window as any).__custom_fetch__ = val; } catch (e) {}
        },
        configurable: true,
        enumerable: true
      });
    } catch (err) {}
  } catch (e) {}
})();

import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import { Capacitor } from '@capacitor/core';
import { SplashScreen } from '@capacitor/splash-screen';
import { StatusBar, Style } from '@capacitor/status-bar';
import App from './App.tsx';
import './index.css';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { reportError } from './services/errorLog';

// Ajustes nativos Android: status bar oscura + ocultar splash al montar.
async function initNative() {
  try {
    if (!Capacitor.isNativePlatform()) return;
    await StatusBar.setStyle({ style: Style.Dark }).catch(() => {});
    await StatusBar.setBackgroundColor({ color: '#090B10' }).catch(() => {});
  } finally {
    // Oculta el splash aunque falle lo anterior
    SplashScreen.hide().catch(() => {});
  }
}
initNative();

window.addEventListener('error', (e) => {
  reportError(e.message || 'window.onerror', 'window');
});
window.addEventListener('unhandledrejection', (e) => {
  reportError(e.reason instanceof Error ? e.reason.message : String(e.reason), 'promise');
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
);

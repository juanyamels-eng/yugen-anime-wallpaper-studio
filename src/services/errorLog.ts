/**
 * Registro local de errores (sin backend).
 * Guarda los últimos 50 errores para diagnóstico en Admin.
 */

export interface LoggedError {
  message: string;
  source: string;
  timestamp: string;
}

const STORAGE_KEY = 'yugen_error_log_v1';
const MAX_ENTRIES = 50;

function readAll(): LoggedError[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function reportError(message: string, source = 'app'): void {
  try {
    const list = readAll();
    list.unshift({ message: String(message).slice(0, 500), source, timestamp: new Date().toISOString() });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list.slice(0, MAX_ENTRIES)));
  } catch {
    // sin almacenamiento disponible
  }
  console.error(`[Yugen:${source}]`, message);
}

export function getErrorLog(): LoggedError[] {
  return readAll();
}

export function clearErrorLog(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}

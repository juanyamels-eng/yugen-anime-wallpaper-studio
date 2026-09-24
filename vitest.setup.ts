// Polyfill mínimo de almacenamiento para tests en entorno node.
class MemoryStorage {
  private store = new Map<string, string>();
  getItem(key: string): string | null {
    return this.store.has(key) ? this.store.get(key)! : null;
  }
  setItem(key: string, value: string): void {
    this.store.set(key, String(value));
  }
  removeItem(key: string): void {
    this.store.delete(key);
  }
  clear(): void {
    this.store.clear();
  }
}

// @ts-expect-error entorno node sin DOM
globalThis.localStorage = new MemoryStorage();
// @ts-expect-error entorno node sin DOM
globalThis.sessionStorage = new MemoryStorage();

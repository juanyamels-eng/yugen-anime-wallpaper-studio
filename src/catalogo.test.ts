import { describe, it, expect } from 'vitest';
import { WALLPAPERS_CATALOG } from './data/wallpapers-catalog';
import { CATEGORIES_CATALOG } from './data/categories-catalog';

describe('catalogo', () => {
  it('tiene 22 categorias x 100 fondos unicos', () => {
    expect(CATEGORIES_CATALOG.length).toBe(22);
    expect(WALLPAPERS_CATALOG.length).toBe(2200);
    const ids = new Set(WALLPAPERS_CATALOG.map((w) => w.id));
    expect(ids.size).toBe(2200);
    for (const cat of ['cat-winter', 'cat-festival', 'cat-yokai']) {
      expect(WALLPAPERS_CATALOG.filter((w) => w.categoryId === cat).length).toBe(100);
    }
  });
});

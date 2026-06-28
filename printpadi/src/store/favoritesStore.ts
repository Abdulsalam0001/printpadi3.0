// ============================================================
// PrintPadi – Favorites Store
// Exact port of features/favorites/favorites-store.ts
// localStorage → Capacitor Preferences for native persistence
// API calls preserved; guest fallback preserved exactly.
// ============================================================

import { create } from 'zustand';
import { Preferences } from '@capacitor/preferences';
import { toast } from 'sonner';

// ── Storage key (same as original) ───────────────────────────
export const FAVORITE_PRODUCT_IDS_STORAGE_KEY = 'printpadi:favorite-product-ids';

// ── Capacitor Preferences replaces localStorage ───────────────

async function readLocalFavoriteIds(): Promise<string[]> {
  try {
    const { value } = await Preferences.get({ key: FAVORITE_PRODUCT_IDS_STORAGE_KEY });
    if (!value) return [];
    const parsed = JSON.parse(value) as unknown;
    if (!Array.isArray(parsed)) return [];
    return [...new Set(parsed.filter((id): id is string => typeof id === 'string'))];
  } catch {
    return [];
  }
}

async function writeLocalFavoriteIds(ids: string[]): Promise<void> {
  await Preferences.set({
    key:   FAVORITE_PRODUCT_IDS_STORAGE_KEY,
    value: JSON.stringify(ids),
  });
}

async function clearLocalFavoriteIds(): Promise<void> {
  await Preferences.remove({ key: FAVORITE_PRODUCT_IDS_STORAGE_KEY });
}

// ── API helpers (same shape as shared/api/favorites.ts) ──────
// These call the same PrintPadi backend. Replace BASE_URL with
// your actual API base URL (from env).

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? '';

async function fetchFavoriteProductIds(): Promise<string[]> {
  const res = await fetch(`${API_BASE}/api/favorites`, { credentials: 'include' });
  if (!res.ok) throw new Error('Failed to fetch favorites');
  const data = await res.json() as { productIds: string[] };
  return data.productIds ?? [];
}

async function postFavoriteProduct(productId: string): Promise<string[]> {
  const res = await fetch(`${API_BASE}/api/favorites`, {
    method:      'POST',
    credentials: 'include',
    headers:     { 'Content-Type': 'application/json' },
    body:        JSON.stringify({ productId }),
  });
  if (!res.ok) throw new Error('Failed to add favorite');
  const data = await res.json() as { productIds: string[] };
  return data.productIds ?? [];
}

async function deleteFavoriteProduct(productId: string): Promise<string[]> {
  const res = await fetch(`${API_BASE}/api/favorites/${productId}`, {
    method:      'DELETE',
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Failed to remove favorite');
  const data = await res.json() as { productIds: string[] };
  return data.productIds ?? [];
}

async function mergeFavoriteProducts(localIds: string[]): Promise<string[]> {
  const res = await fetch(`${API_BASE}/api/favorites/merge`, {
    method:      'POST',
    credentials: 'include',
    headers:     { 'Content-Type': 'application/json' },
    body:        JSON.stringify({ productIds: localIds }),
  });
  if (!res.ok) throw new Error('Failed to merge favorites');
  const data = await res.json() as { productIds: string[] };
  return data.productIds ?? [];
}

async function fetchAuthMeOptional(): Promise<{ id: string } | null> {
  try {
    const res = await fetch(`${API_BASE}/api/auth/me`, { credentials: 'include' });
    if (!res.ok) return null;
    return res.json() as Promise<{ id: string }>;
  } catch {
    return null;
  }
}

// ── Store types ───────────────────────────────────────────────

type InitOptions = { force?: boolean };

type FavoritesState = {
  favoriteIds:               string[];
  isAuthenticated:           boolean;
  ready:                     boolean;
  init:                      (opts?: InitOptions) => Promise<void>;
  toggleFavorite:            (productId: string) => Promise<void>;
  isFavorite:                (productId: string) => boolean;
  rehydrateGuestAfterLogout: () => void;
};

// ── Singleton in-flight guard (exact copy) ───────────────────
let initInFlight: Promise<void> | null = null;

// ── Store ─────────────────────────────────────────────────────

export const useFavoritesStore = create<FavoritesState>((set, get) => ({
  favoriteIds:     [],
  isAuthenticated: false,
  ready:           false,

  isFavorite: productId => get().favoriteIds.includes(productId),

  // ── init: exact logic, async localStorage → Capacitor Preferences ──
  init: async (opts?: InitOptions) => {
    const force = Boolean(opts?.force);
    if (!force && get().ready) return;
    if (initInFlight) {
      await initInFlight;
      if (!force && get().ready) return;
    }

    initInFlight = (async () => {
      try {
        if (force) set({ ready: false });

        const user = await fetchAuthMeOptional();

        if (!user) {
          set({
            favoriteIds:     await readLocalFavoriteIds(),
            isAuthenticated: false,
            ready:           true,
          });
          return;
        }

        try {
          let ids = await fetchFavoriteProductIds();
          const localIds = await readLocalFavoriteIds();
          if (localIds.length > 0) {
            ids = await mergeFavoriteProducts(localIds);
            await clearLocalFavoriteIds();
          }
          set({ favoriteIds: ids, isAuthenticated: true, ready: true });
        } catch {
          set({ favoriteIds: [], isAuthenticated: true, ready: true });
        }
      } catch {
        set({
          favoriteIds:     await readLocalFavoriteIds(),
          isAuthenticated: false,
          ready:           true,
        });
      } finally {
        initInFlight = null;
      }
    })();

    await initInFlight;
  },

  // ── rehydrateGuestAfterLogout (exact copy) ────────────────────
  rehydrateGuestAfterLogout: () => {
    readLocalFavoriteIds().then(ids => {
      set({ favoriteIds: ids, isAuthenticated: false, ready: true });
    });
  },

  // ── toggleFavorite: optimistic update, exact copy ─────────────
  toggleFavorite: async (productId: string) => {
    if (!get().ready) await get().init();

    const { favoriteIds, isAuthenticated } = get();
    const wasFavorite = favoriteIds.includes(productId);
    const optimistic  = wasFavorite
      ? favoriteIds.filter(id => id !== productId)
      : [...favoriteIds, productId];

    set({ favoriteIds: optimistic });

    try {
      if (isAuthenticated) {
        const ids = wasFavorite
          ? await deleteFavoriteProduct(productId)
          : await postFavoriteProduct(productId);
        set({ favoriteIds: ids });
      } else {
        await writeLocalFavoriteIds(optimistic);
      }
    } catch (err) {
      // Roll back on failure
      set({ favoriteIds });
      toast.error(err instanceof Error ? err.message : 'Could not update favourite.');
    }
  },
}));

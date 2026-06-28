// ============================================================
// PrintPadi – FavoritesBootstrap
// Exact port of features/favorites/favorites-bootstrap.tsx
// Mounts once at the app root to initialise the favorites store.
// ============================================================

import { useEffect } from 'react';
import { useFavoritesStore } from '../store/favoritesStore';

export default function FavoritesBootstrap() {
  const init = useFavoritesStore(s => s.init);

  useEffect(() => {
    void init();
  }, [init]);

  // Renders nothing – side-effect only
  return null;
}

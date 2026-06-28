// ============================================================
// PrintPadi – Scroll Restoration
// Exact port of lib/scroll-restoration.ts
// Works with Ionic's IonContent scroll container.
// ============================================================

const SCROLL_PREFIX  = 'pp-scroll:';
const RESTORE_FLAG   = 'pp-should-restore-scroll';

export function getScrollStorageKey(pathname: string, search = ''): string {
  return `${SCROLL_PREFIX}${pathname}${search}`;
}

/**
 * Call this before navigating to a product detail page so the
 * home / search page can restore its position when the user comes back.
 * Exact copy of saveScrollPositionForReturn().
 */
export function saveScrollPositionForReturn(pathname: string, scrollTop: number): void {
  const key = getScrollStorageKey(pathname, window.location.search);
  sessionStorage.setItem(key, String(scrollTop));
}

/**
 * Called from the back button handler.
 * Exact copy of markScrollRestorePending().
 */
export function markScrollRestorePending(): void {
  sessionStorage.setItem(RESTORE_FLAG, '1');
}

/**
 * Returns the saved scroll Y for a route, or null if none.
 * Clears the flag and stored value after reading.
 * Exact copy of consumeScrollRestore().
 */
export function consumeScrollRestore(pathname: string, search = ''): number | null {
  if (sessionStorage.getItem(RESTORE_FLAG) !== '1') return null;
  sessionStorage.removeItem(RESTORE_FLAG);

  const key = getScrollStorageKey(pathname, search);
  const raw = sessionStorage.getItem(key);
  sessionStorage.removeItem(key);
  if (!raw) return null;

  const y = Number.parseInt(raw, 10);
  return Number.isFinite(y) ? y : null;
}

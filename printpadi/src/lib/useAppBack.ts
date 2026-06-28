// ============================================================
// PrintPadi – useAppBack hook
// Exact port of lib/use-app-back.ts
// next/navigation useRouter → Ionic useIonRouter
// ============================================================

import { useCallback } from 'react';
import { useIonRouter } from '@ionic/react';
import { markScrollRestorePending } from './scrollRestoration';

type UseAppBackOptions = {
  restoreScroll?: boolean;
  fallbackHref?:  string;
};

/**
 * Returns a stable callback that navigates back (or to fallbackHref).
 * Mirrors useAppBack() exactly: marks scroll-restore flag when needed.
 */
export function useAppBack({
  restoreScroll = false,
  fallbackHref  = '/home',
}: UseAppBackOptions = {}) {
  const router = useIonRouter();

  return useCallback(() => {
    if (restoreScroll) {
      markScrollRestorePending();
    }
    if (router.canGoBack()) {
      router.goBack();
      return;
    }
    router.push(fallbackHref, 'back', 'pop');
  }, [router, restoreScroll, fallbackHref]);
}

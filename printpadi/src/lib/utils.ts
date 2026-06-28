// ============================================================
// PrintPadi – Utilities
// Exact port of lib/utils.ts from Next.js project
// ============================================================

import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/** Class-name helper (Tailwind + clsx merge) */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format a number as Nigerian Naira without the ₦ symbol.
 * e.g. 3500 → "3,500"
 * Mirrors formatNaira() in lib/utils.ts.
 */
export function formatNaira(value: number): string {
  const safeValue = Number.isFinite(value) ? value : 0;
  return new Intl.NumberFormat('en-NG', {
    maximumFractionDigits: 0,
  }).format(safeValue);
}

/**
 * Returns the flag image src for a product origin code.
 * Mirrors lib/product-origin.ts pattern.
 */
export function getOriginFlagSrc(origin?: string): string {
  if (origin === 'CN') return '/icons/china.svg';
  return '/nigeria.svg';
}

export function getOriginFlagAlt(origin?: string): string {
  if (origin === 'CN') return 'China';
  return 'Nigeria';
}

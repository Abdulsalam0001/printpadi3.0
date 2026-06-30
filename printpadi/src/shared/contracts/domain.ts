// ============================================================
// PrintPadi – Domain types (compatibility re-export)
// The canonical, fully-typed source of truth lives in
// `@/models/domain` (exact port of the Next.js
// shared/contracts/domain.ts). This file exists so any code
// importing from "@/shared/contracts/domain" — matching the
// Next.js import path exactly — resolves to the same types.
// ============================================================

export * from '@/models/domain';

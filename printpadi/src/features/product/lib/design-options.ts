// ============================================================
// PrintPadi – features/product/lib/design-options.ts
// Exact port of features/product/lib/design-options.ts
// from the Next.js project.
// ============================================================

import type { Product } from '@/shared/contracts/domain';

export type DesignMethodOption = {
  id: string;
  title: string;
  description?: string;
  disabled?: boolean;
};

export const DESIGN_METHOD_OPTIONS: DesignMethodOption[] = [
  {
    id: 'UPLOAD_NOW',
    title: 'Upload Design',
    description: 'Get free mock up for approval',
  },
  {
    id: 'SEND_AFTER_CHECKOUT',
    title: 'Send Design via WhatsApp or Email after Checkout',
    description: 'Get free mock up for approval',
  },
  {
    id: 'HIRE_DESIGNER',
    title: 'Hire a Designer From Printpadi',
    description: 'At extra cost, our design team will follow up after checkout',
  },
  {
    id: 'PRINTPADI_AI',
    title: 'Use Printpadi AI (Free)',
    disabled: true,
  },
];

export const UPLOAD_NOW_DESIGN_METHOD_ID = 'UPLOAD_NOW';

/** Empty by default so no design option is preselected; selection is optional. */
export const DEFAULT_DESIGN_METHOD_ID = '';

/**
 * A product offers design methods when it is customizable. Bulk products default
 * to customizable; retail products only when flagged or when they carry option groups.
 */
export const isProductCustomizable = (product: Product): boolean => {
  if (product.type === 'bulk') {
    return product.isCustomizable !== false;
  }
  if (product.isCustomizable === true) {
    return true;
  }
  const customizations = product.optionGroups?.customizations?.length ?? 0;
  const designOptions = product.optionGroups?.designOptions?.length ?? 0;
  return customizations > 0 || designOptions > 0;
};

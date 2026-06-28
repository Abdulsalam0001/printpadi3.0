// ============================================================
// PrintPadi – Cart pricing helpers
// Exact port of features/cart/lib/pricing.ts
// ============================================================

import type { Product } from '../models/domain';

export const UNBOUNDED_STOCK = Number.MAX_SAFE_INTEGER;

/** Minimum order quantity for a product. Retail = 1, bulk = product.moq */
export const getMinQuantity = (product: Product): number => {
  if (product.type !== 'bulk') return 1;
  const moq = Number(product.moq);
  if (!Number.isFinite(moq) || moq < 1) return 1;
  return Math.floor(moq);
};

/**
 * Maximum quantity the customer can add to cart.
 * Respects per-colour stock when a colour is selected.
 */
export const getStockCeiling = (
  product: Product,
  colorName?: string,
  colorId?: string,
): number => {
  const normalizedColorId = colorId?.trim();
  if (normalizedColorId) {
    const selectedById = product.colors?.find(c => c.id === normalizedColorId);
    if (selectedById?.stockCount != null) {
      return resolveStockCount(selectedById.stockCount);
    }
  }

  const normalizedColorName = colorName?.trim().toLowerCase();
  const selectedColorStock = product.colors?.find(
    c => c.name.trim().toLowerCase() === normalizedColorName,
  )?.stockCount;

  const fallbackStock =
    product.totalStockCount ??
    product.stock ??
    (product.type === 'bulk' ? product.totalStockCount : undefined);

  return resolveStockCount(selectedColorStock ?? fallbackStock);
};

const resolveStockCount = (stock: number | undefined | null): number => {
  if (stock == null || !Number.isFinite(stock)) return UNBOUNDED_STOCK;
  if (Number(stock) <= 0) return 0;
  return Math.floor(Number(stock));
};

/** Clamp a quantity between min and max */
export const clampQuantity = (
  quantity: number,
  minQuantity: number,
  maxQuantity: number,
): number => {
  if (!Number.isFinite(quantity)) return minQuantity;
  if (maxQuantity <= 0) return 0;
  return Math.min(maxQuantity, Math.max(minQuantity, Math.floor(quantity)));
};

type PriceTier = NonNullable<Product['priceTiers']>[number];

/** Find the price tier that applies to a given quantity */
export const findActiveTier = (
  product: Product,
  quantity: number,
): PriceTier | undefined => {
  if (product.type !== 'bulk' || !Array.isArray(product.priceTiers)) return undefined;
  return product.priceTiers.find(tier => {
    const min = tier.minQty ?? 1;
    const max = tier.maxQty ?? Number.POSITIVE_INFINITY;
    return quantity >= min && quantity <= max;
  });
};

/** Sum price adjustments from selected option choices */
export const getOptionAdjustmentTotal = (
  product: Product,
  selectedChoices: Record<string, string>,
): number => {
  if (!product.optionGroups) return 0;
  const allGroups = [
    ...product.optionGroups.customizations,
    ...product.optionGroups.designOptions,
  ];
  return allGroups.reduce((sum, group) => {
    const choiceId = selectedChoices[group.id];
    if (!choiceId) return sum;
    const choice = group.choices.find(c => c.id === choiceId);
    return sum + (choice?.priceAdjustment ?? 0);
  }, 0);
};

/** Base unit price resolved against tiers and product.basePrice */
export const getUnitBasePrice = (product: Product, quantity: number): number => {
  if (product.type === 'bulk') {
    const activeTier = findActiveTier(product, quantity);
    if (activeTier?.price != null && Number.isFinite(activeTier.price)) {
      return activeTier.price;
    }
    if (Number.isFinite(product.basePrice) && (product.basePrice ?? 0) > 0) {
      return product.basePrice as number;
    }
    const tierPrices =
      product.priceTiers
        ?.map(t => t.price)
        .filter(p => Number.isFinite(p)) ?? [];
    if (tierPrices.length > 0) return Math.min(...tierPrices);
  }
  const fallback = Array.isArray(product.price)
    ? product.price.filter(p => Number.isFinite(p))
    : [];
  return fallback[0] ?? 0;
};

/** Final unit price = base + option adjustments */
export const getComputedUnitPrice = (
  product: Product,
  quantity: number,
  selectedChoices: Record<string, string>,
): number =>
  getUnitBasePrice(product, quantity) +
  getOptionAdjustmentTotal(product, selectedChoices);

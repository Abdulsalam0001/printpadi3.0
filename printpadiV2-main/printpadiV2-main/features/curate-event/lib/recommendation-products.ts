import {
	clampQuantity,
	findActiveTier,
	getMinQuantity,
	getStockCeiling,
} from "@/features/cart/lib/pricing";
import type { Product } from "@/shared/contracts/domain";

export const DEFAULT_GUEST_COUNT = 50;

export function parseGuestCount(value: string | undefined): number {
	const parsed = Number.parseInt((value ?? "").trim(), 10);
	if (!Number.isFinite(parsed) || parsed < 1) {
		return DEFAULT_GUEST_COUNT;
	}
	return parsed;
}

export function productMatchesGuestCount(
	product: Product,
	guestCount: number,
): boolean {
	if (product.type === "retail") {
		return true;
	}

	const moq = getMinQuantity(product);
	if (guestCount < moq) {
		return false;
	}

	const tiers = product.priceTiers ?? [];
	if (tiers.length === 0) {
		return true;
	}

	return Boolean(findActiveTier(product, guestCount));
}

export function getRecommendedQuantity(
	product: Product,
	guestCount: number,
): number {
	const minQuantity = getMinQuantity(product);
	const maxQuantity = getStockCeiling(product);

	if (product.type === "retail") {
		return clampQuantity(guestCount, 1, maxQuantity);
	}

	return clampQuantity(guestCount, minQuantity, maxQuantity);
}

export function getRecommendationLineTotal(
	quantity: number,
	unitPrice: number,
): number {
	return quantity * unitPrice;
}

export function getProductCategoryLabel(product: Product): string {
	if (product.tagNames && product.tagNames.length > 0) {
		return product.tagNames[0] ?? product.category;
	}
	return product.category;
}

export function filterRecommendationProducts(
	products: Product[],
	guestCount: number,
): Product[] {
	return products.filter(product => productMatchesGuestCount(product, guestCount));
}

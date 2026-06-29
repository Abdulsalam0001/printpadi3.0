import type { Product } from "@/shared/contracts/domain";

export const UNBOUNDED_STOCK = Number.MAX_SAFE_INTEGER;

export const getMinQuantity = (product: Product): number => {
	if (product.type !== "bulk") {
		return 1;
	}
	const moq = Number(product.moq);
	if (!Number.isFinite(moq) || moq < 1) {
		return 1;
	}
	return Math.floor(moq);
};

export const getStockCeiling = (
	product: Product,
	colorName?: string,
	colorId?: string,
): number => {
	const normalizedColorId = colorId?.trim();
	if (normalizedColorId) {
		const selectedById = product.colors?.find(color => color.id === normalizedColorId);
		if (selectedById?.stockCount != null) {
			return resolveStockCount(selectedById.stockCount);
		}
	}

	const normalizedColorName = colorName?.trim().toLowerCase();
	const selectedColorStock = product.colors?.find(
		color => color.name.trim().toLowerCase() === normalizedColorName,
	)?.stockCount;

	const fallbackStock =
		product.totalStockCount ??
		product.stock ??
		(product.type === "bulk" ? product.totalStockCount : undefined);

	const resolvedStock = selectedColorStock ?? fallbackStock;
	return resolveStockCount(resolvedStock);
};

const resolveStockCount = (resolvedStock: number | undefined | null): number => {
	if (resolvedStock == null) {
		return UNBOUNDED_STOCK;
	}
	if (!Number.isFinite(resolvedStock)) {
		return UNBOUNDED_STOCK;
	}
	if (Number(resolvedStock) <= 0) {
		return 0;
	}

	return Math.floor(Number(resolvedStock));
};

export const clampQuantity = (
	quantity: number,
	minQuantity: number,
	maxQuantity: number,
): number => {
	if (!Number.isFinite(quantity)) {
		return minQuantity;
	}
	if (maxQuantity <= 0) {
		return 0;
	}
	return Math.min(maxQuantity, Math.max(minQuantity, Math.floor(quantity)));
};

type PriceTier = NonNullable<Product["priceTiers"]>[number];

export const findActiveTier = (
	product: Product,
	quantity: number,
): PriceTier | undefined => {
	if (product.type !== "bulk" || !Array.isArray(product.priceTiers)) {
		return undefined;
	}

	return product.priceTiers.find(tier => {
		const min = tier.minQty ?? 1;
		const max = tier.maxQty ?? Number.POSITIVE_INFINITY;
		return quantity >= min && quantity <= max;
	});
};

export const getOptionAdjustmentTotal = (
	product: Product,
	selectedChoices: Record<string, string>,
): number => {
	if (!product.optionGroups) {
		return 0;
	}

	const allGroups = [
		...product.optionGroups.customizations,
		...product.optionGroups.designOptions,
	];

	return allGroups.reduce((sum, group) => {
		const selectedChoiceId = selectedChoices[group.id];
		if (!selectedChoiceId) {
			return sum;
		}
		const selectedChoice = group.choices.find(choice => choice.id === selectedChoiceId);
		return sum + (selectedChoice?.priceAdjustment ?? 0);
	}, 0);
};

export const getUnitBasePrice = (product: Product, quantity: number): number => {
	if (product.type === "bulk") {
		const activeTier = findActiveTier(product, quantity);
		if (activeTier?.price != null && Number.isFinite(activeTier.price)) {
			return activeTier.price;
		}

		if (Number.isFinite(product.basePrice) && (product.basePrice ?? 0) > 0) {
			return product.basePrice as number;
		}

		const tierPrices =
			product.priceTiers
				?.map(tier => tier.price)
				.filter(price => Number.isFinite(price)) ?? [];
		if (tierPrices.length > 0) {
			return Math.min(...tierPrices);
		}
	}

	const fallbackPrices = Array.isArray(product.price)
		? product.price.filter(price => Number.isFinite(price))
		: [];
	return fallbackPrices[0] ?? 0;
};

export const getComputedUnitPrice = (
	product: Product,
	quantity: number,
	selectedChoices: Record<string, string>,
): number => {
	return getUnitBasePrice(product, quantity) + getOptionAdjustmentTotal(product, selectedChoices);
};

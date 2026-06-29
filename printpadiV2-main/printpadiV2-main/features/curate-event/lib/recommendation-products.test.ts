import { describe, expect, it } from "vitest";
import type { Product } from "@/shared/contracts/domain";
import {
	filterRecommendationProducts,
	getRecommendedQuantity,
	parseGuestCount,
	productMatchesGuestCount,
} from "@/features/curate-event/lib/recommendation-products";

const bulkProduct: Product = {
	id: "bulk-1",
	rating: 0,
	images: [],
	name: "Bulk Item",
	badges: [],
	orders: 0,
	type: "bulk",
	moq: 50,
	price: [4000],
	priceTiers: [{ label: "50-99 pcs", minQty: 50, maxQty: 99, price: 4000 }],
	category: "Souvenirs",
	tagNames: ["Souvenirs"],
};

describe("recommendation-products", () => {
	it("parses guest count with fallback", () => {
		expect(parseGuestCount("50")).toBe(50);
		expect(parseGuestCount("")).toBe(50);
	});

	it("matches bulk products when guest count satisfies moq and tier", () => {
		expect(productMatchesGuestCount(bulkProduct, 50)).toBe(true);
		expect(productMatchesGuestCount(bulkProduct, 10)).toBe(false);
	});

	it("filters and recommends quantity from guest count", () => {
		const filtered = filterRecommendationProducts([bulkProduct], 50);
		expect(filtered).toHaveLength(1);
		expect(getRecommendedQuantity(bulkProduct, 50)).toBe(50);
	});
});

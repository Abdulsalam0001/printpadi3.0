import { describe, expect, it } from "vitest";
import { isProductCustomizable } from "@/features/product/lib/design-options";
import type { Product } from "@/shared/contracts/domain";

const baseProduct: Product = {
	id: "p1",
	rating: 0,
	images: [],
	name: "Test",
	badges: [],
	orders: 0,
	type: "retail",
	price: [1000],
	category: "general",
};

describe("isProductCustomizable", () => {
	it("defaults bulk products to customizable when flag is unset", () => {
		expect(
			isProductCustomizable({
				...baseProduct,
				type: "bulk",
			}),
		).toBe(true);
	});

	it("treats bulk products with isCustomizable true as customizable", () => {
		expect(
			isProductCustomizable({
				...baseProduct,
				type: "bulk",
				isCustomizable: true,
			}),
		).toBe(true);
	});

	it("respects explicit false on bulk products", () => {
		expect(
			isProductCustomizable({
				...baseProduct,
				type: "bulk",
				isCustomizable: false,
			}),
		).toBe(false);
	});

	it("returns false for retail without flag or option groups", () => {
		expect(
			isProductCustomizable({
				...baseProduct,
				isCustomizable: false,
			}),
		).toBe(false);
	});
});

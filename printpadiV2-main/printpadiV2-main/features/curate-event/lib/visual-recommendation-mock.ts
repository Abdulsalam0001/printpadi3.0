import type { Product } from "@/shared/contracts/domain";

/** Static product for visual regression when API returns no tagged products. */
export const VISUAL_RECOMMENDATION_MOCK_PRODUCT: Product = {
	id: "visual-mock-party-hats",
	rating: 4.5,
	images: ["/shirts.svg"],
	name: "Custom Party Hats",
	badges: [],
	orders: 0,
	type: "bulk",
	moq: 50,
	price: [4000, 4000],
	basePrice: 4000,
	priceTiers: [
		{ label: "50-99 pcs", minQty: 50, maxQty: 99, price: 4000 },
		{ label: "100-249 pcs", minQty: 100, maxQty: 249, price: 3700 },
		{ label: "250+ pcs", minQty: 250, price: 3200 },
	],
	category: "Souvenirs",
	tagNames: ["Souvenirs"],
};

import { beforeEach, describe, expect, it } from "vitest";
import { useCartStore } from "@/features/cart/store/cart-store";
import { products } from "@/lib/products";

describe("cart store", () => {
	beforeEach(() => {
		useCartStore.setState({
			cart: { items: [], currency: "NGN" },
		});
	});

	it("adds product from PDP entry point with selected options", () => {
		const addItem = useCartStore.getState().addItem;
		const product = products.find(item => item.type === "retail") ?? products[0];
		addItem({
			product,
			quantity: 2,
			options: { color: "#030386", size: "m" },
		});

		const state = useCartStore.getState();
		expect(state.cart.items).toHaveLength(1);
		expect(state.itemCount()).toBe(2);
		expect(state.cart.items[0].options?.size).toBe("m");
	});

	it("keeps separate lines when choice selections differ", () => {
		const addItem = useCartStore.getState().addItem;
		const product = products.find(item => item.type === "retail") ?? products[0];
		addItem({
			product,
			quantity: 1,
			options: { colorId: "c1", sizeOptionId: "s1", choiceSelections: { g1: "a" } },
		});
		addItem({
			product,
			quantity: 1,
			options: { colorId: "c1", sizeOptionId: "s1", choiceSelections: { g1: "b" } },
		});

		const state = useCartStore.getState();
		expect(state.cart.items).toHaveLength(2);
	});

	it("uses a custom image when provided", () => {
		const addItem = useCartStore.getState().addItem;
		const product = products.find(item => item.type === "retail") ?? products[0];
		addItem({
			product,
			quantity: 1,
			image: "https://example.com/red-shirt.png",
			options: { colorId: "red", color: "Red" },
		});

		const state = useCartStore.getState();
		expect(state.cart.items[0].image).toBe("https://example.com/red-shirt.png");
	});

	it("increments subtotal when product is added twice", () => {
		const addItem = useCartStore.getState().addItem;
		const product = products[1];
		addItem({ product, quantity: 1 });
		addItem({ product, quantity: 3 });

		const state = useCartStore.getState();
		expect(state.cart.items).toHaveLength(1);
		expect(state.cart.items[0].quantity).toBe(4);
		expect(state.subtotal().amount).toBe((product.price[0] ?? 0) * 4);
	});
});

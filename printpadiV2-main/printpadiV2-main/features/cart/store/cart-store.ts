"use client";

import { create } from "zustand";
import type { Cart, CartItem, CartItemOption, Money, Product } from "@/shared/contracts/domain";
import { clampQuantity, getMinQuantity, getStockCeiling } from "@/features/cart/lib/pricing";

type AddItemInput = {
	product: Product;
	quantity: number;
	options?: CartItemOption;
	unitPrice?: number;
	minQuantity?: number;
	maxQuantity?: number;
	image?: string;
};

type CartState = {
	cart: Cart;
	addItem: (input: AddItemInput) => void;
	removeItem: (itemId: string) => void;
	incrementItem: (itemId: string) => void;
	decrementItem: (itemId: string) => void;
	clearCart: () => void;
	subtotal: () => Money;
	itemCount: () => number;
};

const cartCurrency: Money["currency"] = "NGN";

const createCartItemId = (input: AddItemInput) => {
	const choices = input.options?.choiceSelections;
	const choicesKey = choices
		? Object.keys(choices)
				.sort()
				.map(k => `${k}:${choices[k] ?? ""}`)
				.join("|")
		: "";
	return [
		input.product.id,
		input.options?.colorId ?? input.options?.colorHex ?? input.options?.color ?? "default-color",
		input.options?.sizeOptionId ?? input.options?.size ?? "default-size",
		choicesKey || "default-choices",
		input.options?.designMethod ?? "default-design-method",
		input.options?.designFileUrl ?? "no-design-file",
	].join(":");
};

const toMoney = (amount: number): Money => ({ amount, currency: cartCurrency });

export const useCartStore = create<CartState>((set, get) => ({
	cart: {
		items: [],
		currency: cartCurrency,
	},

	addItem: ({ product, quantity, options, unitPrice, minQuantity, maxQuantity, image }) => {
		const itemId = createCartItemId({ product, quantity, options });
		set(state => {
			const resolvedMinQuantity = Math.max(
				1,
				Math.floor(minQuantity ?? getMinQuantity(product)),
			);
			const requestedMaxQuantity = options?.colorId
				? getStockCeiling(product, options.color, options.colorId)
				: options?.color
					? getStockCeiling(product, options.color)
					: getStockCeiling(product);
			const resolvedMaxQuantity = Math.max(
				0,
				Math.floor(maxQuantity ?? requestedMaxQuantity),
			);
			if (resolvedMaxQuantity < resolvedMinQuantity) {
				return state;
			}
			const safeUnitPrice = Number.isFinite(unitPrice)
				? Math.max(0, Math.floor(unitPrice as number))
				: product.price[0] ?? 0;
			const existing = state.cart.items.find(item => item.id === itemId);
			if (existing) {
				const mergedQuantity = clampQuantity(
					existing.quantity + quantity,
					resolvedMinQuantity,
					resolvedMaxQuantity,
				);
				return {
					cart: {
						...state.cart,
						items: state.cart.items.map(item =>
							item.id === itemId
								? {
										...item,
										quantity: mergedQuantity,
										unitPrice: toMoney(safeUnitPrice),
										minQuantity: resolvedMinQuantity,
										maxQuantity: resolvedMaxQuantity,
									}
								: item,
						),
					},
				};
			}

			const safeQuantity = clampQuantity(
				quantity,
				resolvedMinQuantity,
				resolvedMaxQuantity,
			);

			const newItem: CartItem = {
				id: itemId,
				productId: product.id,
				name: product.name.trim(),
				image: image ?? product.images[0] ?? "/shirts.svg",
				unitPrice: toMoney(safeUnitPrice),
				quantity: safeQuantity,
				minQuantity: resolvedMinQuantity,
				maxQuantity: resolvedMaxQuantity,
				options: options
					? {
							...options,
						}
					: undefined,
			};

			return {
				cart: {
					...state.cart,
					items: [...state.cart.items, newItem],
				},
			};
		});
	},

	removeItem: itemId =>
		set(state => ({
			cart: {
				...state.cart,
				items: state.cart.items.filter(item => item.id !== itemId),
			},
		})),

	incrementItem: itemId =>
		set(state => ({
			cart: {
				...state.cart,
				items: state.cart.items.map(item =>
					item.id === itemId
						? {
								...item,
								quantity:
									item.maxQuantity != null
										? Math.min(item.maxQuantity, item.quantity + 1)
										: item.quantity + 1,
							}
						: item,
				),
			},
		})),

	decrementItem: itemId =>
		set(state => ({
			cart: {
				...state.cart,
				items: state.cart.items
					.map(item =>
						item.id === itemId
							? {
									...item,
									quantity: Math.max(item.minQuantity ?? 1, item.quantity - 1),
								}
							: item,
					)
					.filter(item => item.quantity > 0),
			},
		})),

	clearCart: () =>
		set({
			cart: {
				items: [],
				currency: cartCurrency,
			},
		}),

	subtotal: () => {
		const amount = get().cart.items.reduce(
			(sum, item) => sum + item.unitPrice.amount * item.quantity,
			0,
		);
		return toMoney(amount);
	},

	itemCount: () =>
		get().cart.items.reduce((count, item) => count + item.quantity, 0),
}));

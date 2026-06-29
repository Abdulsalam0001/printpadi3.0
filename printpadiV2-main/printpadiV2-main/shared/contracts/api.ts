import type { Cart, Product } from "./domain";

export type ApiResponse<T> = {
	success: boolean;
	data: T;
	message?: string;
	error?: string;
};

export type ProductsPayload = {
	products: Product[];
};

export type AddToCartPayload = {
	productId: string;
	quantity: number;
	options?: {
		color?: string;
		size?: string;
	};
};

export type AddToCartResponse = {
	cart: Cart;
};

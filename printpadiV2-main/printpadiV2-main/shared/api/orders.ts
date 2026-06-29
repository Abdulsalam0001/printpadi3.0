import { getPublicApiBaseUrl } from "@/shared/config/public-env";

const ordersBase = () => `${getPublicApiBaseUrl()}/api/orders`;

export type CheckoutLinePayload = {
	productId: string;
	quantity: number;
	colorId?: string;
	colorHex?: string;
	colorName?: string;
	sizeOptionId?: string;
	sizeLabel?: string;
	choiceSelections?: Record<string, string>;
	designMethod?: string;
	designFileUrl?: string;
	designFilePublicId?: string;
	designFileName?: string;
};

export type CheckoutPayload = {
	guestEmail: string;
	guestPhone: string;
	guestFullName: string;
	deliveryLocation?: string;
	lines: CheckoutLinePayload[];
};

type SuccessBody<T> = {
	status: "success";
	data: T;
};

type ErrorBody = {
	status?: string;
	message?: string;
};

async function parseJson(response: Response): Promise<unknown> {
	try {
		return await response.json();
	} catch {
		throw new Error("Invalid response from server.");
	}
}

export type CheckoutResponseOrder = {
	id: string;
	orderCode: string;
	paymentStatus: string;
	fulfillmentStatus: string;
	currency: string;
	total: string;
	createdAt: string;
};

export async function postCheckoutOrder(payload: CheckoutPayload): Promise<CheckoutResponseOrder> {
	const response = await fetch(`${ordersBase()}/checkout`, {
		method: "POST",
		credentials: "include",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
		},
		body: JSON.stringify(payload),
	});
	const body = await parseJson(response);
	if (!response.ok) {
		const err = body as ErrorBody;
		throw new Error(err.message || "Checkout failed.");
	}
	const data = body as SuccessBody<{ order: CheckoutResponseOrder }>;
	if (data.status !== "success" || !data.data?.order) {
		throw new Error("Unexpected response from server.");
	}
	return data.data.order;
}

export type OrderLookupResult = {
	orderCode: string;
	paymentStatus: string;
	fulfillmentStatus: string;
	currency: string;
	total: string;
	createdAt: string;
	deliveryLocation: string | null;
	items: Array<{
		productName: string;
		quantity: number;
		unitPrice: string;
		lineTotal: string;
		imageUrl: string | null;
		colorName?: string | null;
		sizeLabel?: string | null;
		designMethod?: string | null;
		designFileUrl?: string | null;
		optionChoices?: Array<{ groupName: string; choiceLabel: string }>;
	}>;
};

export async function postOrderLookup(orderCode: string, email: string): Promise<OrderLookupResult> {
	const response = await fetch(`${ordersBase()}/lookup`, {
		method: "POST",
		credentials: "include",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ orderCode, email }),
	});
	const body = await parseJson(response);
	if (!response.ok) {
		const err = body as ErrorBody;
		throw new Error(err.message || "Could not find order.");
	}
	const data = body as SuccessBody<{ order: OrderLookupResult }>;
	if (data.status !== "success" || !data.data?.order) {
		throw new Error("Unexpected response from server.");
	}
	return data.data.order;
}

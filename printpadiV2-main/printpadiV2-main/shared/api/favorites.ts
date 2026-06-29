import { getPublicApiBaseUrl } from "@/shared/config/public-env";

const base = () => `${getPublicApiBaseUrl()}/api/me/favorites`;

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

export async function fetchFavoriteProductIds(): Promise<string[]> {
	const response = await fetch(base(), {
		method: "GET",
		credentials: "include",
		headers: { Accept: "application/json" },
	});
	const body = await parseJson(response);
	if (!response.ok) {
		const err = body as ErrorBody;
		throw new Error(err.message || "Could not load favorites.");
	}
	const data = body as SuccessBody<{ productIds: string[] }>;
	if (data.status !== "success" || !Array.isArray(data.data?.productIds)) {
		throw new Error("Unexpected response from server.");
	}
	return data.data.productIds;
}

export async function postFavoriteProduct(productId: string): Promise<string[]> {
	const response = await fetch(base(), {
		method: "POST",
		credentials: "include",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ productId }),
	});
	const body = await parseJson(response);
	if (!response.ok) {
		const err = body as ErrorBody;
		throw new Error(err.message || "Could not save favorite.");
	}
	const data = body as SuccessBody<{ productIds: string[] }>;
	if (data.status !== "success" || !Array.isArray(data.data?.productIds)) {
		throw new Error("Unexpected response from server.");
	}
	return data.data.productIds;
}

export async function deleteFavoriteProduct(productId: string): Promise<string[]> {
	const response = await fetch(`${base()}/${encodeURIComponent(productId)}`, {
		method: "DELETE",
		credentials: "include",
		headers: { Accept: "application/json" },
	});
	const body = await parseJson(response);
	if (!response.ok) {
		const err = body as ErrorBody;
		throw new Error(err.message || "Could not remove favorite.");
	}
	const data = body as SuccessBody<{ productIds: string[] }>;
	if (data.status !== "success" || !Array.isArray(data.data?.productIds)) {
		throw new Error("Unexpected response from server.");
	}
	return data.data.productIds;
}

export async function mergeFavoriteProducts(productIds: string[]): Promise<string[]> {
	const response = await fetch(`${base()}/merge`, {
		method: "POST",
		credentials: "include",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ productIds }),
	});
	const body = await parseJson(response);
	if (!response.ok) {
		const err = body as ErrorBody;
		throw new Error(err.message || "Could not merge favorites.");
	}
	const data = body as SuccessBody<{ productIds: string[] }>;
	if (data.status !== "success" || !Array.isArray(data.data?.productIds)) {
		throw new Error("Unexpected response from server.");
	}
	return data.data.productIds;
}

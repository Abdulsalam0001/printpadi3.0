import { requiredEnv } from "@/shared/config/env";
import { normalizeApiOrigin } from "@/shared/lib/api-base-url";

export class ApiError extends Error {
	constructor(message: string, public readonly code?: string) {
		super(message);
		this.name = "ApiError";
	}
}

const serverApiRoot = () => `${normalizeApiOrigin(requiredEnv("BASE_API_URL"))}/api`;

export const apiClient = {
	async get<T>(path: string): Promise<T> {
		const shouldUseRelativePath = path.startsWith("/api/");
		const requestUrl = shouldUseRelativePath
			? path
			: `${serverApiRoot()}${path.startsWith("/") ? path : `/${path}`}`;
		const response = await fetch(requestUrl, {
			headers: { "Content-Type": "application/json" },
		});
		const json = await response.json();
		if (!response.ok) {
			throw new ApiError(json.message || "Request failed", json.error);
		}
		return json as T;
	},
};

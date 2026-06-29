import { normalizeApiOrigin } from "@/shared/lib/api-base-url";

/**
 * API origin for browser calls (no `/api` suffix — paths must include `/api/...`).
 * Must match `BASE_API_URL` on the server after normalization.
 */
export const getPublicApiBaseUrl = (): string => {
	const raw = process.env.NEXT_PUBLIC_BASE_API_URL;
	if (!raw?.trim()) {
		throw new Error("Missing NEXT_PUBLIC_BASE_API_URL");
	}
	return normalizeApiOrigin(raw);
};


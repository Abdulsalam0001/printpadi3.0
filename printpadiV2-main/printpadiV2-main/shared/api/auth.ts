import { getPublicApiBaseUrl } from "@/shared/config/public-env";

export type AuthUser = {
	id: string;
	email: string;
	name: string;
	role: string;
};

type MeSuccessBody = {
	status: "success";
	data: { user: AuthUser };
};

type ErrorBody = {
	status?: string;
	message?: string;
};

const buildMeUrl = () => `${getPublicApiBaseUrl()}/api/auth/me`;

export const getGoogleOAuthStartUrl = () =>
	`${getPublicApiBaseUrl()}/api/auth/google`;

export async function fetchAuthMe(): Promise<AuthUser> {
	const response = await fetch(buildMeUrl(), {
		method: "GET",
		credentials: "include",
		headers: {
			Accept: "application/json",
		},
	});

	let body: unknown;
	try {
		body = await response.json();
	} catch {
		throw new Error(
			"Invalid response from server. Check NEXT_PUBLIC_BASE_API_URL is the API origin only (e.g. http://localhost:3000), not …/api.",
		);
	}

	if (!response.ok) {
		const err = body as ErrorBody;
		throw new Error(err.message || "Not authenticated.");
	}

	const data = body as MeSuccessBody;
	if (data.status !== "success" || !data.data?.user) {
		throw new Error("Unexpected response from server.");
	}

	return data.data.user;
}

/** Returns the signed-in user, or `null` if not authenticated (does not throw on 401). */
export async function fetchAuthMeOptional(): Promise<AuthUser | null> {
	const response = await fetch(buildMeUrl(), {
		method: "GET",
		credentials: "include",
		headers: {
			Accept: "application/json",
		},
	});

	let body: unknown;
	try {
		body = await response.json();
	} catch {
		return null;
	}

	if (!response.ok) {
		return null;
	}

	const data = body as MeSuccessBody;
	if (data.status !== "success" || !data.data?.user) {
		return null;
	}

	return data.data.user;
}

const buildLogoutUrl = () => `${getPublicApiBaseUrl()}/api/auth/logout`;

/** Clears the httpOnly session cookie via the API (POST). */
export async function postAuthLogout(): Promise<void> {
	const response = await fetch(buildLogoutUrl(), {
		method: "POST",
		credentials: "include",
		headers: {
			Accept: "application/json",
		},
	});

	let body: unknown;
	try {
		body = await response.json();
	} catch {
		throw new Error("Invalid response from server.");
	}

	if (!response.ok) {
		const err = body as ErrorBody;
		throw new Error(err.message || "Sign out failed.");
	}

	const data = body as { status?: string };
	if (data.status !== "success") {
		throw new Error("Unexpected response from server.");
	}
}

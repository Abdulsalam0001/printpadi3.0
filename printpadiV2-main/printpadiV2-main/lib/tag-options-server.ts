import "server-only";

import { requiredEnv } from "@/shared/config/env";
import { normalizeApiOrigin } from "@/shared/lib/api-base-url";

export type TagOptionDto = {
	id: string;
	name: string;
	slug: string;
};

type TagOptionsJson = {
	status?: string;
	success?: boolean;
	data?: { tagOptions?: TagOptionDto[] };
};

const baseApiUrl = `${normalizeApiOrigin(requiredEnv("BASE_API_URL"))}/api`;

export async function getTagOptions(): Promise<TagOptionDto[]> {
	try {
		const res = await fetch(`${baseApiUrl}/products/tag-options`, {
			headers: { Accept: "application/json" },
			next: { revalidate: 120 },
		});

		if (!res.ok) {
			return [];
		}

		const json = (await res.json()) as TagOptionsJson;
		const ok = json.status === "success" || json.success === true;
		if (!ok || !json.data?.tagOptions || !Array.isArray(json.data.tagOptions)) {
			return [];
		}

		return json.data.tagOptions.filter(
			(row): row is TagOptionDto =>
				typeof row?.id === "string" &&
				typeof row?.name === "string" &&
				typeof row?.slug === "string",
		);
	} catch {
		return [];
	}
}

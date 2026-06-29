import "server-only";

import { DEFAULT_EVENT_STYLES } from "@/lib/event-styles-defaults";
import type { EventStyleDto } from "@/lib/event-styles";
import { requiredEnv } from "@/shared/config/env";
import { normalizeApiOrigin } from "@/shared/lib/api-base-url";

export type { EventStyleDto };

type EventStylesJson = {
	status?: string;
	success?: boolean;
	data?: { eventStyles?: EventStyleDto[] };
};

const baseApiUrl = `${normalizeApiOrigin(requiredEnv("BASE_API_URL"))}/api`;

export async function getEventStyles(): Promise<EventStyleDto[]> {
	try {
		const res = await fetch(`${baseApiUrl}/event-styles`, {
			headers: { Accept: "application/json" },
			next: { revalidate: 120 },
		});

		if (!res.ok) {
			return DEFAULT_EVENT_STYLES;
		}

		const json = (await res.json()) as EventStylesJson;
		const ok = json.status === "success" || json.success === true;
		if (!ok || !json.data?.eventStyles || !Array.isArray(json.data.eventStyles)) {
			return DEFAULT_EVENT_STYLES;
		}

		const eventStyles = json.data.eventStyles.filter(
			(row): row is EventStyleDto =>
				typeof row?.id === "string" &&
				typeof row?.name === "string" &&
				typeof row?.slug === "string" &&
				typeof row?.position === "number",
		);

		return eventStyles.length > 0 ? eventStyles : DEFAULT_EVENT_STYLES;
	} catch {
		return DEFAULT_EVENT_STYLES;
	}
}

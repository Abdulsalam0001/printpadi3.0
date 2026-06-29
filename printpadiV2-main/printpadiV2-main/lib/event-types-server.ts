import "server-only";

import {
	DEFAULT_EVENT_TYPES,
} from "@/lib/event-types-defaults";
import type { EventTypeDto } from "@/lib/event-types";
import { requiredEnv } from "@/shared/config/env";
import { normalizeApiOrigin } from "@/shared/lib/api-base-url";

export type { EventTypeDto };

type EventTypesJson = {
	status?: string;
	success?: boolean;
	data?: { eventTypes?: EventTypeDto[] };
};

const baseApiUrl = `${normalizeApiOrigin(requiredEnv("BASE_API_URL"))}/api`;

export async function getEventTypes(): Promise<EventTypeDto[]> {
	try {
		const res = await fetch(`${baseApiUrl}/event-types`, {
			headers: { Accept: "application/json" },
			next: { revalidate: 120 },
		});

		if (!res.ok) {
			return DEFAULT_EVENT_TYPES;
		}

		const json = (await res.json()) as EventTypesJson;
		const ok = json.status === "success" || json.success === true;
		if (!ok || !json.data?.eventTypes || !Array.isArray(json.data.eventTypes)) {
			return DEFAULT_EVENT_TYPES;
		}

		const eventTypes = json.data.eventTypes.filter(
			(row): row is EventTypeDto =>
				typeof row?.id === "string" &&
				typeof row?.name === "string" &&
				typeof row?.slug === "string" &&
				typeof row?.position === "number",
		);

		return eventTypes.length > 0 ? eventTypes : DEFAULT_EVENT_TYPES;
	} catch {
		return DEFAULT_EVENT_TYPES;
	}
}

import {
	CURATE_EVENT_STEPS,
	type CurateEventStep,
} from "@/features/curate-event/types";
import type { CurateEventDetails } from "@/features/curate-event/curate-event-details";
import { isCurateEventDetailsComplete } from "@/features/curate-event/curate-event-details";

type CurateEventStepAccess = {
	selectedEventTypeId: string | null;
	selectedEventStyleId: string | null;
	details: CurateEventDetails;
};

export function canAccessCurateEventStep(
	step: CurateEventStep,
	access: CurateEventStepAccess,
): boolean {
	const index = CURATE_EVENT_STEPS.findIndex(item => item.id === step);

	if (index === 0) {
		return true;
	}

	if (index >= 1 && !access.selectedEventTypeId) {
		return false;
	}

	if (index >= 2 && !isCurateEventDetailsComplete(access.details)) {
		return false;
	}

	if (index >= 3 && !access.selectedEventStyleId) {
		return false;
	}

	return true;
}

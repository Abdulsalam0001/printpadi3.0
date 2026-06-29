export type CurateEventStep =
	| "category"
	| "details"
	| "style"
	| "recommendations";

export const CURATE_EVENT_STEPS: {
	id: CurateEventStep;
	label: string;
}[] = [
	{ id: "category", label: "Category" },
	{ id: "details", label: "Details" },
	{ id: "style", label: "Style" },
	{ id: "recommendations", label: "Recommendations" },
];

export const CURATE_EVENT_STORAGE_KEY = "printpadi-curate-event";

export type CurateEventPersistedState = {
	selectedEventTypeId: string | null;
	selectedEventStyleId: string | null;
	step: CurateEventStep;
	details: {
		eventName: string;
		eventDescription: string;
		eventDate: string;
		eventLocation: string;
		guestCount: string;
	};
};

export type CurateEventDetails = {
	eventName: string;
	eventDescription: string;
	eventDate: string;
	eventLocation: string;
	guestCount: string;
};

export const createEmptyCurateEventDetails = (): CurateEventDetails => ({
	eventName: "",
	eventDescription: "",
	eventDate: "",
	eventLocation: "",
	guestCount: "",
});

export function isCurateEventDetailsComplete(details: CurateEventDetails): boolean {
	return (
		details.eventName.trim().length > 0 &&
		details.eventDescription.trim().length > 0 &&
		details.eventDate.trim().length > 0 &&
		details.eventLocation.trim().length > 0 &&
		details.guestCount.trim().length > 0
	);
}

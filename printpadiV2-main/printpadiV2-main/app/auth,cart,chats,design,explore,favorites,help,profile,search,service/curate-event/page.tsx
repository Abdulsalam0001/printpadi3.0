import CurateEventScreen from "@/features/curate-event/curate-event-screen";
import { getEventStyles } from "@/lib/event-styles-server";
import { getEventTypes } from "@/lib/event-types-server";

export default async function CurateEventPage() {
	const [eventTypes, eventStyles] = await Promise.all([
		getEventTypes(),
		getEventStyles(),
	]);

	return <CurateEventScreen eventTypes={eventTypes} eventStyles={eventStyles} />;
}

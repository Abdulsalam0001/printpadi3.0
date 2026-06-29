import type { EventTypeDto } from "@/lib/event-types";
import { EventTypeRow } from "@/features/curate-event/components/event-type-row";

type EventTypeListProps = {
	eventTypes: EventTypeDto[];
	selectedEventTypeId: string | null;
	onSelect: (eventTypeId: string) => void;
};

export function EventTypeList({
	eventTypes,
	selectedEventTypeId,
	onSelect,
}: EventTypeListProps) {
	return (
		<ul className="flex flex-col gap-3">
			{eventTypes.map(eventType => (
				<li key={eventType.id}>
					<EventTypeRow
						eventType={eventType}
						isSelected={selectedEventTypeId === eventType.id}
						onSelect={() => onSelect(eventType.id)}
					/>
				</li>
			))}
		</ul>
	);
}

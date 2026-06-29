import type { EventStyleDto } from "@/lib/event-styles";
import { EventStyleRow } from "@/features/curate-event/components/event-style-row";

type EventStyleListProps = {
	eventStyles: EventStyleDto[];
	selectedEventStyleId: string | null;
	onSelect: (eventStyleId: string) => void;
};

export function EventStyleList({
	eventStyles,
	selectedEventStyleId,
	onSelect,
}: EventStyleListProps) {
	return (
		<ul className="flex flex-col gap-3">
			{eventStyles.map(eventStyle => (
				<li key={eventStyle.id}>
					<EventStyleRow
						eventStyle={eventStyle}
						isSelected={selectedEventStyleId === eventStyle.id}
						onSelect={() => onSelect(eventStyle.id)}
					/>
				</li>
			))}
		</ul>
	);
}

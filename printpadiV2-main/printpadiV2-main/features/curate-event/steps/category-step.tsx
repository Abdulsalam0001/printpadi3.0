import type { EventTypeDto } from "@/lib/event-types";
import { EventTypeList } from "@/features/curate-event/components/event-type-list";

type CategoryStepProps = {
	eventTypes: EventTypeDto[];
	selectedEventTypeId: string | null;
	onSelect: (eventTypeId: string) => void;
};

export function CategoryStep({
	eventTypes,
	selectedEventTypeId,
	onSelect,
}: CategoryStepProps) {
	return (
		<section className="px-4 pt-5">
			<h2 className="font-bricolage-grotesque text-[20px] font-bold leading-[1.2] text-[#1B2559]">
				What type of event are you planning?
			</h2>
			<p className="mt-1.5 text-[12px] leading-snug text-neutral-500">
				Select your event type to get personalized recommendations
			</p>

			<div className="mt-4">
				<EventTypeList
					eventTypes={eventTypes}
					selectedEventTypeId={selectedEventTypeId}
					onSelect={onSelect}
				/>
			</div>
		</section>
	);
}

import type { EventStyleDto } from "@/lib/event-styles";
import { EventStyleList } from "@/features/curate-event/components/event-style-list";

type StyleStepProps = {
	eventStyles: EventStyleDto[];
	selectedEventStyleId: string | null;
	onSelect: (eventStyleId: string) => void;
};

export function StyleStep({
	eventStyles,
	selectedEventStyleId,
	onSelect,
}: StyleStepProps) {
	return (
		<section className="px-4 pt-5" data-testid="curate-event-style-step">
			<h2 className="text-center font-bricolage-grotesque text-[20px] font-bold leading-[1.2] text-[#1B2559]">
				Choose Your Event Style
			</h2>
			<p className="mt-1.5 text-center text-[12px] leading-snug text-neutral-500">
				this will help us suggest the perfect products
			</p>

			<div className="mt-5">
				<EventStyleList
					eventStyles={eventStyles}
					selectedEventStyleId={selectedEventStyleId}
					onSelect={onSelect}
				/>
			</div>
		</section>
	);
}

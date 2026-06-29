import type { EventStyleDto } from "@/lib/event-styles";
import { cn } from "@/lib/utils";

type EventStyleRowProps = {
	eventStyle: EventStyleDto;
	isSelected: boolean;
	onSelect: () => void;
};

export function EventStyleRow({
	eventStyle,
	isSelected,
	onSelect,
}: EventStyleRowProps) {
	return (
		<button
			type="button"
			onClick={onSelect}
			aria-pressed={isSelected}
			data-testid={`curate-event-style-${eventStyle.slug}`}
			className={cn(
				"flex min-h-[104px] w-full flex-col justify-center rounded-[16px] border border-neutral-200 bg-white px-4 py-6 text-left transition-colors",
				isSelected ? "border-black bg-neutral-50" : "hover:border-neutral-300",
			)}
		>
			<span className="text-[15px] font-semibold text-[#1B2559]">{eventStyle.name}</span>
			{eventStyle.description ? (
				<p className="mt-0.5 text-[12px] leading-snug text-neutral-500">
					{eventStyle.description}
				</p>
			) : null}
		</button>
	);
}

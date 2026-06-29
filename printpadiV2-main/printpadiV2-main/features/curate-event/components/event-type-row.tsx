import type { EventTypeDto } from "@/lib/event-types";
import { cn } from "@/lib/utils";

type EventTypeRowProps = {
	eventType: EventTypeDto;
	isSelected: boolean;
	onSelect: () => void;
};

export function EventTypeRow({
	eventType,
	isSelected,
	onSelect,
}: EventTypeRowProps) {
	return (
		<button
			type="button"
			onClick={onSelect}
			aria-pressed={isSelected}
			data-testid={`curate-event-type-${eventType.slug}`}
			className={cn(
				"flex w-full items-center gap-3 rounded-[16px] border border-neutral-200 bg-white px-4 py-3.5 text-left transition-colors",
				isSelected ? "border-black bg-neutral-50" : "hover:border-neutral-300",
			)}
		>
			{eventType.imagePath ? (
				// Native img preserves embedded JPEG quality inside SVG assets.
				// eslint-disable-next-line @next/next/no-img-element
				<img
					src={eventType.imagePath}
					alt=""
					width={80}
					height={80}
					className="size-20 shrink-0 rounded-[12px] object-cover"
					loading="eager"
					decoding="sync"
				/>
			) : (
				<span className="flex size-20 shrink-0 items-center justify-center rounded-[12px] bg-neutral-100 text-3xl">
					{eventType.icon ?? "✨"}
				</span>
			)}

			<div className="min-w-0 flex-1">
				<div className="flex items-center gap-1.5">
					{eventType.icon ? (
						<span className="text-[18px] leading-none" aria-hidden>
							{eventType.icon}
						</span>
					) : null}
					<span className="text-[15px] font-semibold text-[#1B2559]">
						{eventType.name}
					</span>
				</div>
				{eventType.description ? (
					<p className="mt-0.5 text-[12px] leading-snug text-neutral-500">
						{eventType.description}
					</p>
				) : null}
			</div>
		</button>
	);
}

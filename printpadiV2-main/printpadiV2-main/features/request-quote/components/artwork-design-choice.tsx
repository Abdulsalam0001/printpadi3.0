"use client";

import { TickSquare } from "iconsax-reactjs";
import { cn } from "@/lib/utils";

export type ArtworkDesignChoice = "has_artwork" | "need_design_help";

const OPTIONS: {
	id: ArtworkDesignChoice;
	label: string;
	icon: React.ReactNode;
}[] = [
	{
		id: "has_artwork",
		label: "Yes, I have artwork",
		icon: <TickSquare size={22} color="#5EB447" variant="Bold" aria-hidden />,
	},
	{
		id: "need_design_help",
		label: "Need design help",
		icon: <span className="text-[22px] leading-none" aria-hidden>🎨</span>,
	},
];

type ArtworkDesignChoiceProps = {
	value: ArtworkDesignChoice;
	onChange: (value: ArtworkDesignChoice) => void;
};

export function ArtworkDesignChoiceField({
	value,
	onChange,
}: ArtworkDesignChoiceProps) {
	return (
		<div className="flex gap-2" role="radiogroup" aria-label="Artwork and design">
			{OPTIONS.map(option => {
				const isSelected = value === option.id;

				return (
					<button
						key={option.id}
						type="button"
						role="radio"
						aria-checked={isSelected}
						onClick={() => onChange(option.id)}
						className={cn(
							"flex flex-1 flex-col items-center justify-center gap-1.5 rounded-[12px] border bg-white px-2 py-3 text-center transition-colors",
							isSelected
								? "border-[#2563EB] border-2"
								: "border-neutral-200",
						)}
					>
						{option.icon}
						<span className="text-[10px] font-medium leading-tight text-foreground">
							{option.label}
						</span>
					</button>
				);
			})}
		</div>
	);
}

export function getArtworkDesignLabel(value: ArtworkDesignChoice): string {
	return value === "has_artwork" ? "Yes, I have artwork" : "Need design help";
}

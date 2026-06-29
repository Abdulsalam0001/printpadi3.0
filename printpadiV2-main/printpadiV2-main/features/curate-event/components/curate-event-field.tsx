import type { ReactNode } from "react";

const fieldInputClassName =
	"w-full rounded-full border border-neutral-200 bg-white px-4 py-3 text-sm text-foreground outline-none placeholder:text-neutral-400 focus:border-black";

type CurateEventFieldProps = {
	label: string;
	icon: ReactNode;
	children: React.ReactNode;
};

export function CurateEventField({ label, icon, children }: CurateEventFieldProps) {
	return (
		<div className="space-y-2">
			<div className="flex items-center gap-2">
				{icon}
				<span className="text-[13px] font-semibold text-foreground">{label}</span>
			</div>
			{children}
		</div>
	);
}

export { fieldInputClassName };

export const fieldTextareaClassName =
	"w-full rounded-[16px] border border-neutral-200 bg-white px-4 py-3 text-sm text-foreground outline-none placeholder:text-neutral-400 focus:border-black";

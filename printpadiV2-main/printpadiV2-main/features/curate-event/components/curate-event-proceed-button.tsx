import { cn } from "@/lib/utils";

type CurateEventProceedButtonProps = {
	disabled: boolean;
	onClick: () => void;
};

export function CurateEventProceedButton({
	disabled,
	onClick,
}: CurateEventProceedButtonProps) {
	return (
		<div
			className="fixed inset-x-0 bottom-0 z-20 mx-auto max-w-md px-4 pb-8"
			style={{
				paddingBottom: "calc(2rem + env(safe-area-inset-bottom, 0px))",
			}}
		>
			<button
				type="button"
				disabled={disabled}
				onClick={onClick}
				data-testid="curate-event-proceed"
				className={cn(
					"flex h-[50px] w-full items-center justify-center rounded-full text-[15px] font-semibold text-white transition-colors",
					disabled
						? "cursor-not-allowed bg-[#C4C4C4]"
						: "bg-black hover:bg-black/90",
				)}
			>
				Proceed
			</button>
		</div>
	);
}

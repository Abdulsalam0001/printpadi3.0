import {
	CURATE_EVENT_STEPS,
	type CurateEventStep,
} from "@/features/curate-event/types";
import { cn } from "@/lib/utils";

type CurateEventStepperProps = {
	currentStep: CurateEventStep;
	onStepChange: (step: CurateEventStep) => void;
	canAccessStep: (step: CurateEventStep) => boolean;
};

export function CurateEventStepper({
	currentStep,
	onStepChange,
	canAccessStep,
}: CurateEventStepperProps) {
	const currentIndex = CURATE_EVENT_STEPS.findIndex(
		step => step.id === currentStep,
	);

	return (
		<nav
			aria-label="Curate event progress"
			className="px-4 pt-4"
		>
			<ol className="flex items-start justify-between">
				{CURATE_EVENT_STEPS.map((step, index) => {
					const isActive = index === currentIndex;
					const isComplete = index < currentIndex;
					const isAccessible = canAccessStep(step.id);

					return (
						<li
							key={step.id}
							className="relative flex flex-1 flex-col items-center"
						>
							{index < CURATE_EVENT_STEPS.length - 1 ? (
								<span
									aria-hidden
									className={cn(
										"absolute left-[calc(50%+8px)] top-[7px] h-px w-[calc(100%-16px)]",
										index < currentIndex ? "bg-black" : "bg-neutral-200",
									)}
								/>
							) : null}
							<button
								type="button"
								onClick={() => onStepChange(step.id)}
								disabled={!isAccessible}
								aria-current={isActive ? "step" : undefined}
								aria-disabled={!isAccessible}
								className={cn(
									"relative z-10 flex flex-col items-center outline-none transition-opacity",
									isAccessible
										? "cursor-pointer"
										: "cursor-not-allowed opacity-60",
								)}
							>
								<span
									className={cn(
										"size-4 rounded-full border-2",
										isActive || isComplete
											? "border-black bg-black"
											: "border-neutral-300 bg-white",
									)}
								/>
								<span
									className={cn(
										"mt-1.5 max-w-[4.5rem] text-center text-[9px] leading-tight",
										isActive || isComplete
											? "font-semibold text-foreground"
											: "font-medium text-neutral-400",
									)}
								>
									{step.label}
								</span>
							</button>
						</li>
					);
				})}
			</ol>
		</nav>
	);
}

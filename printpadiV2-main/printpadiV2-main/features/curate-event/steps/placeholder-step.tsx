import type { CurateEventStep } from "@/features/curate-event/types";
import { CURATE_EVENT_STEPS } from "@/features/curate-event/types";

type PlaceholderStepProps = {
	step: Exclude<CurateEventStep, "category">;
};

export function PlaceholderStep({ step }: PlaceholderStepProps) {
	const label = CURATE_EVENT_STEPS.find(item => item.id === step)?.label ?? step;

	return (
		<section className="px-4 pt-10 text-center">
			<h2 className="font-bricolage-grotesque text-[20px] font-bold text-[#1B2559]">
				{label}
			</h2>
			<p className="mt-2 text-[13px] text-neutral-500">
				This step is coming soon. You will be able to continue curating your event
				here.
			</p>
		</section>
	);
}

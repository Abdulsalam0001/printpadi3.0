import { Suspense } from "react";
import { TrackOrderScreen } from "@/features/profile/track-order-screen";

export default function TrackOrderPage() {
	return (
		<Suspense
			fallback={
				<div className="min-h-[40vh] px-4 pt-8 font-sans text-sm text-neutral-500">Loading…</div>
			}
		>
			<TrackOrderScreen />
		</Suspense>
	);
}

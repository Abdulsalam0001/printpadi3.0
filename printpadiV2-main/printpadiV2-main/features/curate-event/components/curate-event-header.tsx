"use client";

import { ArrowLeft } from "lucide-react";
import { useAppBack } from "@/lib/use-app-back";

export function CurateEventHeader() {
	const handleBack = useAppBack();

	return (
		<header className="relative flex min-h-10 items-center justify-center px-4 pt-3">
			<button
				type="button"
				onClick={handleBack}
				className="absolute left-4 inline-flex size-9 items-center justify-center rounded-full bg-black text-white outline-none transition-colors hover:bg-black/90 focus-visible:ring-2 focus-visible:ring-black/30"
				aria-label="Go back"
			>
				<ArrowLeft className="size-4" strokeWidth={2.25} />
			</button>
			<h1 className="text-center font-bricolage-grotesque text-[17px] font-semibold text-foreground">
				Curate An Event
			</h1>
		</header>
	);
}

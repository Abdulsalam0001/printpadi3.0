"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { markScrollRestorePending } from "@/lib/scroll-restoration";

type UseAppBackOptions = {
	restoreScroll?: boolean;
	fallbackHref?: string;
};

export function useAppBack({
	restoreScroll = false,
	fallbackHref = "/",
}: UseAppBackOptions = {}) {
	const router = useRouter();

	return useCallback(() => {
		if (restoreScroll) {
			markScrollRestorePending();
		}
		if (typeof window !== "undefined" && window.history.length > 1) {
			router.back();
			return;
		}
		router.push(fallbackHref);
	}, [router, restoreScroll, fallbackHref]);
}

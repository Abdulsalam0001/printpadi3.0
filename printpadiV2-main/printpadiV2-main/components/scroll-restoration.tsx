"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { consumeScrollRestore } from "@/lib/scroll-restoration";

/** Restores window scroll after PDP back navigation. */
export function ScrollRestoration() {
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const search = searchParams.toString();
	const query = search ? `?${search}` : "";

	useEffect(() => {
		const y = consumeScrollRestore(pathname, query);
		if (y === null) {
			return;
		}

		const restore = () => window.scrollTo(0, y);

		requestAnimationFrame(() => {
			restore();
			requestAnimationFrame(restore);
		});
	}, [pathname, query]);

	return null;
}

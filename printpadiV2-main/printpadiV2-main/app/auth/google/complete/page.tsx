"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { fetchAuthMe } from "@/shared/api/auth";
import { useFavoritesStore } from "@/features/favorites/favorites-store";
import { buttonVariants } from "@/components/ui/button-variants";
import { cn } from "@/lib/utils";

export default function GoogleOAuthCompletePage() {
	const router = useRouter();
	const [phase, setPhase] = useState<"loading" | "error">("loading");
	const [message, setMessage] = useState("");

	useEffect(() => {
		let cancelled = false;

		void (async () => {
			try {
				await fetchAuthMe();
				await useFavoritesStore.getState().init({ force: true });
				if (!cancelled) {
					router.replace("/");
				}
			} catch (error) {
				if (!cancelled) {
					setPhase("error");
					setMessage(
						error instanceof Error ? error.message : "Something went wrong.",
					);
				}
			}
		})();

		return () => {
			cancelled = true;
		};
	}, [router]);

	if (phase === "loading") {
		return (
			<div className="mx-auto flex min-h-[50vh] max-w-md flex-col items-center justify-center px-4 pb-28 pt-10 font-sans">
				<p className="text-sm text-gray-5">Signing you in…</p>
			</div>
		);
	}

	return (
		<div className="mx-auto flex min-h-[50vh] max-w-md flex-col px-4 pb-28 pt-10 font-sans">
			<h1 className="font-bricolage-grotesque text-xl font-semibold text-foreground">
				Could not finish sign-in
			</h1>
			<p className="mt-2 text-sm text-gray-5">{message}</p>
			<Link
				href="/auth/login"
				className={cn(
					buttonVariants({ variant: "default", size: "default" }),
					"mt-8 inline-flex w-full max-w-sm justify-center text-[15px] font-medium",
				)}
			>
				Back to sign in
			</Link>
		</div>
	);
}

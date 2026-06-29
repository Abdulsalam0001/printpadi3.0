import Link from "next/link";
import { buttonVariants } from "@/components/ui/button-variants";
import { cn } from "@/lib/utils";

const decodeReason = (raw: string) => {
	try {
		return decodeURIComponent(raw);
	} catch {
		return raw;
	}
};

const humanizeReason = (reason: string) => {
	const text = decodeReason(reason).trim();
	const lower = text.toLowerCase();

	if (lower === "access_denied") {
		return "Sign-in was cancelled.";
	}
	if (lower === "missing_code") {
		return "The sign-in response was incomplete. Please try again.";
	}

	return text || "Something went wrong during sign-in.";
};

type PageProps = {
	searchParams: Promise<{ reason?: string }>;
};

export default async function AuthErrorPage({ searchParams }: PageProps) {
	const { reason: reasonParam } = await searchParams;
	const message = humanizeReason(reasonParam ?? "unknown");

	return (
		<div className="mx-auto flex min-h-[50vh] max-w-md flex-col px-4 pb-28 pt-10 font-sans">
			<h1 className="font-bricolage-grotesque text-xl font-semibold text-foreground">
				Sign-in error
			</h1>
			<p className="mt-2 text-sm text-gray-5">{message}</p>
			<Link
				href="/auth/login"
				className={cn(
					buttonVariants({ variant: "default", size: "default" }),
					"mt-8 inline-flex w-full max-w-sm justify-center text-[15px] font-medium",
				)}
			>
				Try again
			</Link>
			<Link
				href="/"
				className={cn(
					buttonVariants({ variant: "ghost", size: "default" }),
					"mt-3 inline-flex w-full max-w-sm justify-center text-sm text-gray-5",
				)}
			>
				Back to home
			</Link>
		</div>
	);
}

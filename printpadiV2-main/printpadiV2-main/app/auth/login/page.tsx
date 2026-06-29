import Link from "next/link";
import { buttonVariants } from "@/components/ui/button-variants";
import { getGoogleOAuthStartUrl } from "@/shared/api/auth";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default function AuthLoginPage() {
	const googleUrl = getGoogleOAuthStartUrl();

	return (
		<div className="mx-auto flex min-h-[60vh] max-w-md flex-col px-4 pb-28 pt-10 font-sans">
			<h1 className="font-bricolage-grotesque text-2xl font-semibold text-foreground">
				Sign in
			</h1>
			<p className="mt-2 text-sm text-gray-5">
				Use your Google account to continue to PrintPadi.
			</p>
			<a
				href={googleUrl}
				className={cn(
					buttonVariants({ variant: "default", size: "lg" }),
					"mt-8 w-full max-w-sm justify-center text-[15px] font-medium",
				)}
			>
				Continue with Google
			</a>
			<Link
				href="/"
				className={cn(
					buttonVariants({ variant: "ghost", size: "default" }),
					"mt-4 w-full max-w-sm justify-center text-sm text-gray-5",
				)}
			>
				Back to home
			</Link>
		</div>
	);
}

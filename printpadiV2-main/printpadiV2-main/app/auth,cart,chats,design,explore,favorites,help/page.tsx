import Link from "next/link";
import { buttonVariants } from "@/components/ui/button-variants";
import { cn } from "@/lib/utils";

export default function HelpCenterPage() {
	return (
		<div className="mx-auto max-w-md px-4 pb-28 pt-10 font-sans">
			<h1 className="font-bricolage-grotesque text-2xl font-semibold text-foreground">Help center</h1>
			<p className="mt-3 text-sm text-gray-5">
				Need help with an order or product? Contact us and we will get back to you.
			</p>
			<Link
				href="/contact"
				className={cn(
					buttonVariants({ variant: "default", size: "default" }),
					"mt-8 inline-flex justify-center",
				)}
			>
				Contact us
			</Link>
		</div>
	);
}

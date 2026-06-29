import Link from "next/link";

export default function DesignPage() {
	return (
		<div className="mx-auto max-w-md px-4 pb-28 pt-10 font-sans">
			<h1 className="font-bricolage-grotesque text-2xl font-semibold text-foreground">Design</h1>
			<p className="mt-3 text-sm text-gray-5">
				Create custom prints with AI or work with a designer on your next project.
			</p>
			<div className="mt-8 flex flex-col gap-3">
				<Link
					href="/service/shop-gifts"
					className="inline-flex justify-center rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background"
				>
					AI Design
				</Link>
				<Link
					href="/service/hire-designer"
					className="inline-flex justify-center rounded-full border border-foreground px-6 py-3 text-sm font-medium text-foreground"
				>
					Hire a designer
				</Link>
			</div>
		</div>
	);
}

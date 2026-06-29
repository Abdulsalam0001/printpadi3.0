import Link from "next/link";

export type ChinaSourcingChromeProps = {
	showCta?: boolean;
};

export function ChinaSourcingChrome({ showCta = false }: ChinaSourcingChromeProps) {
	return (
		<>
			<div className="px-4 pt-4">
				<header className="mb-3 flex min-h-8 items-center justify-center">
					<h1 className="text-center font-bricolage-grotesque text-[17px] font-semibold text-foreground">
						Source From China
					</h1>
				</header>
			</div>

			<div className="px-4">
				<section
					className={`mt-[60px] text-center ${showCta ? "mb-6" : "mb-0"}`}
				>
					<h2 className="font-bricolage-grotesque text-[18px] font-bold leading-tight text-foreground">
						Professional China Sourcing
					</h2>
					<p className="mt-1.5 text-[13px] leading-[1.35] text-neutral-500">
						let us help you source quality products directly from Chinese manufacturers.
					</p>
					{showCta ? (
						<Link
							href="/service/source-china/request-quote"
							className="mt-4 flex h-11 w-full items-center justify-center rounded-full bg-black text-[13px] font-medium text-white"
						>
							Request Custom Quote
						</Link>
					) : null}
				</section>
			</div>
		</>
	);
}

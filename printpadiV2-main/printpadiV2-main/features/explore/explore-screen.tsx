"use client";

import Link from "next/link";
import { SearchNormal } from "iconsax-reactjs";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
} from "@/components/ui/input-group";
import type { TagOptionDto } from "@/lib/tag-options-server";
import { exploreImageForSlug } from "@/lib/explore-category-images";

function StatusBar() {
	return (
		<div className="flex h-11 items-center justify-between px-1 text-[15px] font-medium text-black">
			<span className="pl-1">9:41</span>
			<div className="flex items-center gap-1.5 pr-0.5" aria-hidden>
				<svg width="18" height="12" viewBox="0 0 18 12" fill="none" className="text-black">
					<rect x="0" y="7" width="3" height="5" rx="0.5" fill="currentColor" />
					<rect x="4" y="5" width="3" height="7" rx="0.5" fill="currentColor" />
					<rect x="8" y="3" width="3" height="9" rx="0.5" fill="currentColor" />
					<rect x="12" y="1" width="3" height="11" rx="0.5" fill="currentColor" />
				</svg>
				<svg width="16" height="12" viewBox="0 0 16 12" fill="none" className="text-black">
					<path
						d="M8 2.5c2.5 0 4.5 1.6 4.5 3.5S10.5 9.5 8 9.5 3.5 7.9 3.5 6 5.5 2.5 8 2.5Z"
						stroke="currentColor"
						strokeWidth="1.2"
					/>
					<path d="M1 10.5h14" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
				</svg>
				<svg width="25" height="12" viewBox="0 0 25 12" fill="none" className="text-black">
					<rect x="1" y="2" width="21" height="9" rx="2.5" stroke="currentColor" strokeWidth="1.2" />
					<rect x="22" y="4.5" width="1.5" height="4" rx="0.5" fill="currentColor" />
					<rect x="3" y="4" width="15" height="5" rx="1" fill="currentColor" />
				</svg>
			</div>
		</div>
	);
}

export type ExploreScreenProps = {
	tagOptions: TagOptionDto[];
};

export default function ExploreScreen({ tagOptions }: ExploreScreenProps) {
	return (
		<div
			data-testid="explore-screen"
			className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-md flex-col bg-white px-4 pb-28 pt-1 font-[family-name:var(--font-public-sans)]"
		>
			<StatusBar />

			<div className="mt-3">
				<form action="/search" method="get">
					<InputGroup className="h-12 min-h-12 rounded-full border border-[#D9D9D9] bg-white px-1 shadow-none ring-0">
						<InputGroupInput
							name="q"
							placeholder="Search"
							className="h-full pl-4 text-sm text-neutral-700 placeholder:text-[#B0B0B0]"
							aria-label="Search"
						/>
						<InputGroupAddon align="inline-end" className="pr-1 [&>div]:p-0">
							<button
								type="submit"
								className="flex size-9 items-center justify-center rounded-full bg-black"
								aria-label="Submit search"
							>
								<SearchNormal size="18" color="#FFFFFF" variant="Linear" />
							</button>
						</InputGroupAddon>
					</InputGroup>
				</form>
			</div>

			<h2 className="font-[family-name:var(--font-bricolage-grotesque)] mt-7 text-[17px] font-semibold leading-snug tracking-tight text-black">
				Explore Our Categories
			</h2>

			{tagOptions.length === 0 ? (
				<p className="mt-6 text-center text-sm text-neutral-500">
					Categories could not be loaded. Check API URL and that the server is running.
				</p>
			) : (
				<ul className="mt-5 grid grid-cols-4 gap-x-3 gap-y-6">
					{tagOptions.map(option => {
						const src = exploreImageForSlug(option.slug);
						const href = `/search?tag=${encodeURIComponent(option.slug)}`;
						return (
							<li key={option.id} className="flex flex-col items-center text-center">
								<Link
									href={href}
									className="flex w-full flex-col items-center gap-2 rounded-lg p-1 outline-none ring-black/10 transition-colors hover:bg-neutral-50"
								>
									<span className="relative flex aspect-square w-full max-w-[76px] items-center justify-center overflow-hidden rounded-full bg-neutral-100 ring-1 ring-neutral-200/80">
										{/* eslint-disable-next-line @next/next/no-img-element -- SVGs from /public; avoids next/image SVG constraints */}
										<img src={src} alt="" className="h-full w-full object-cover" />
									</span>
									<span className="line-clamp-2 w-full px-0.5 text-[11px] font-normal capitalize leading-[1.15] text-neutral-900">
										{option.name}
									</span>
								</Link>
							</li>
						);
					})}
				</ul>
			)}
		</div>
	);
}

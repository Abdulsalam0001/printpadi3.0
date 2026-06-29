"use client";

import Link from "next/link";
import { ProductCard } from "@/components/product-card";
import type { Product } from "@/lib/products";

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

export type SearchResultsScreenProps = {
	products: Product[];
	initialQuery: string;
	initialTagSlug: string | null;
	tagLabel: string | null;
};

export default function SearchResultsScreen({
	products,
	initialQuery,
	tagLabel,
}: SearchResultsScreenProps) {
	return (
		<div
			data-testid="search-results-screen"
			className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-md flex-col bg-white px-4 pb-28 pt-1 font-[family-name:var(--font-public-sans)]"
		>
			<StatusBar />

			<div className="mt-3 flex items-center justify-between gap-3">
				<p className="min-w-0 truncate text-xs text-neutral-600">
					{tagLabel ? (
						<>
							<span className="font-medium text-neutral-900">Category:</span> {tagLabel}
						</>
					) : null}
					{initialQuery ? (
						<>
							{tagLabel ? " · " : null}
							<span className="font-medium text-neutral-900">Query:</span> {initialQuery}
						</>
					) : null}
					{!tagLabel && !initialQuery ? <span className="text-neutral-500">Browse products</span> : null}
				</p>
				<button
					type="button"
					className="shrink-0 rounded-full border border-neutral-200 bg-white px-3 py-1.5 text-xs font-medium text-neutral-500"
					disabled
					aria-disabled="true"
				>
					Filters
				</button>
			</div>

			{products.length === 0 ? (
				<p className="mt-10 text-center text-sm text-neutral-500">
					No products match your search.{" "}
					<Link href="/explore" className="font-medium text-black underline-offset-2 hover:underline">
						Explore categories
					</Link>
				</p>
			) : (
				<ul className="mt-7 grid grid-cols-2 gap-3.5">
					{products.map(product => (
						<li key={product.id}>
							<ProductCard details={product} variation="primary" />
						</li>
					))}
				</ul>
			)}
		</div>
	);
}

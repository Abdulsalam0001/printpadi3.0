"use client";

import { ProductCard } from "@/components/product-card";
import { ChinaSourcingChrome } from "@/features/source-china/components/china-sourcing-chrome";
import type { Product } from "@/lib/products";

export type SourceChinaScreenProps = {
	products: Product[];
};

export default function SourceChinaScreen({ products }: SourceChinaScreenProps) {
	return (
		<div
			data-testid="source-china-screen"
			className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-md flex-col bg-white pb-8 font-[family-name:var(--font-public-sans)]"
		>
			<ChinaSourcingChrome showCta />

			<div className="px-4">
				{products.length === 0 ? (
					<p className="py-8 text-center text-sm text-neutral-500">
						No China-sourced products are available right now.
					</p>
				) : (
					<ul className="mt-[67px] grid grid-cols-3 gap-x-3 gap-y-4">
						{products.map(product => (
							<li key={product.id} className="w-full min-w-0">
								<ProductCard details={product} variation="secondary" />
							</li>
						))}
					</ul>
				)}
			</div>
		</div>
	);
}

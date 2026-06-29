"use client";

import Link from "next/link";
import { ProductCard } from "@/components/product-card";
import { useFavoritesStore } from "@/features/favorites/favorites-store";
import type { Product } from "@/lib/products";

export default function FavoritesClient({ products }: { products: Product[] }) {
	const ready = useFavoritesStore(s => s.ready);
	const favoriteIds = useFavoritesStore(s => s.favoriteIds);
	const set = new Set(favoriteIds);
	const list = products.filter(p => set.has(p.id));

	return (
		<div className="mx-auto w-full max-w-lg px-4 pb-28 pt-6 font-bricolage-grotesque">
			<h1 className="text-xl font-semibold text-foreground">My Favorites</h1>
			<p className="mt-1 text-sm text-gray-5">
				Products you have saved with the heart icon.
			</p>

			{!ready ? (
				<p className="mt-8 text-sm text-gray-5">Loading…</p>
			) : list.length === 0 ? (
				<div className="mt-8 rounded-2xl border border-gray-1 bg-white p-6 text-center">
					<p className="text-sm text-gray-5">No favorites yet.</p>
					<Link
						href="/explore"
						className="mt-4 inline-flex rounded-full bg-foreground px-5 py-2.5 text-sm font-semibold text-background"
					>
						Browse products
					</Link>
				</div>
			) : (
				<div className="mt-6 grid grid-cols-2 gap-3.5">
					{list.map(product => (
						<ProductCard key={product.id} details={product} variation="primary" />
					))}
				</div>
			)}
		</div>
	);
}

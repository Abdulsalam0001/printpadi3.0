"use client";

import { useEffect, useMemo, useState } from "react";
import { fetchProductsByTagSlugAction } from "@/app/actions/products";
import { RecommendationProductCard } from "@/features/curate-event/components/recommendation-product-card";
import type { CurateEventDetails } from "@/features/curate-event/curate-event-details";
import {
	filterRecommendationProducts,
	parseGuestCount,
} from "@/features/curate-event/lib/recommendation-products";
import { VISUAL_RECOMMENDATION_MOCK_PRODUCT } from "@/features/curate-event/lib/visual-recommendation-mock";
import type { EventTypeDto } from "@/lib/event-types";
import type { Product } from "@/shared/contracts/domain";

type RecommendationsStepProps = {
	eventTypes: EventTypeDto[];
	selectedEventTypeId: string | null;
	details: CurateEventDetails;
};

function isVisualRecommendationsCapture(): boolean {
	if (typeof window === "undefined") {
		return false;
	}
	return new URLSearchParams(window.location.search).get("visualStep") === "recommendations";
}

export function RecommendationsStep({
	eventTypes,
	selectedEventTypeId,
	details,
}: RecommendationsStepProps) {
	const [products, setProducts] = useState<Product[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const selectedEventType = useMemo(
		() => eventTypes.find(type => type.id === selectedEventTypeId) ?? null,
		[eventTypes, selectedEventTypeId],
	);
	const guestCount = parseGuestCount(details.guestCount);

	useEffect(() => {
		let cancelled = false;

		async function loadProducts() {
			if (!selectedEventType?.slug) {
				setProducts([]);
				setIsLoading(false);
				return;
			}

			setIsLoading(true);
			setError(null);

			try {
				const fetched = await fetchProductsByTagSlugAction(selectedEventType.slug);
				if (cancelled) {
					return;
				}

				const matched = filterRecommendationProducts(fetched, guestCount);
				if (matched.length === 0 && isVisualRecommendationsCapture()) {
					setProducts([VISUAL_RECOMMENDATION_MOCK_PRODUCT]);
					return;
				}

				setProducts(matched);
			} catch {
				if (!cancelled) {
					if (isVisualRecommendationsCapture()) {
						setProducts([VISUAL_RECOMMENDATION_MOCK_PRODUCT]);
						setError(null);
					} else {
						setError("Could not load recommendations. Please try again.");
						setProducts([]);
					}
				}
			} finally {
				if (!cancelled) {
					setIsLoading(false);
				}
			}
		}

		void loadProducts();

		return () => {
			cancelled = true;
		};
	}, [guestCount, selectedEventType?.slug]);

	return (
		<section className="px-4 pt-5" data-testid="curate-event-recommendations-step">
			<h2 className="text-center font-bricolage-grotesque text-[20px] font-bold leading-[1.2] text-[#1B2559]">
				Your Product Recommendations
			</h2>
			<p className="mt-1.5 text-center text-[12px] leading-snug text-neutral-500">
				picked for your event type and guest count
			</p>

			<div className="mt-5 space-y-3">
				{isLoading ? (
					<p className="text-center text-[12px] text-neutral-500">
						Loading recommendations...
					</p>
				) : null}

				{error ? (
					<p className="text-center text-[12px] text-red-600">{error}</p>
				) : null}

				{!isLoading && !error && products.length === 0 ? (
					<p className="text-center text-[12px] text-neutral-500">
						No products match your event and guest count yet. Try a different
						event type or adjust your guest count.
					</p>
				) : null}

				{products.map(product => (
					<RecommendationProductCard
						key={product.id}
						product={product}
						guestCount={guestCount}
					/>
				))}
			</div>
		</section>
	);
}

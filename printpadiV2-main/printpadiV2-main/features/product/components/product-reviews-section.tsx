import { ProductStarRating } from "@/features/product/components/product-star-rating";
import { PLACEHOLDER_REVIEWS } from "@/features/product/lib/placeholder-reviews";

export function ProductReviewsSection() {
	return (
		<div className="mx-4 mt-4 rounded-[15px] border border-gray-1 bg-white px-4 py-5 shadow-sm">
			<h2 className="font-bricolage-grotesque text-[16px] font-bold text-black">
				Customer Reviews
			</h2>
			<ul className="mt-4 flex flex-col gap-5">
				{PLACEHOLDER_REVIEWS.map(review => (
					<li key={review.id} className="border-b border-gray-6 pb-5 last:border-0 last:pb-0">
						<div className="flex items-start justify-between gap-2">
							<div>
								<p className="font-sans text-[14px] font-semibold text-black">
									{review.author}
								</p>
								{review.verified ? (
									<span className="mt-1 inline-block rounded bg-[#DCFCE7] px-1.5 py-0.5 font-sans text-[10px] font-medium text-[#16A34A]">
										Verified Purchase
									</span>
								) : null}
							</div>
							<span className="shrink-0 font-sans text-[11px] text-gray-4">
								{review.relativeTime}
							</span>
						</div>
						<ProductStarRating rating={review.rating} className="mt-2" />
						<p className="mt-2 font-sans text-[13px] leading-relaxed text-[#4A5565]">
							{review.body}
						</p>
					</li>
				))}
			</ul>
		</div>
	);
}

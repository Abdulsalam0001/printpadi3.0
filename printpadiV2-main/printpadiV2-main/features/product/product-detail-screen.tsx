"use client";

import { ProductDetailCtas } from "@/features/product/components/product-detail-ctas";
import { BulkPricingTiersBar } from "@/features/product/components/bulk-pricing-tiers-bar";
import { ProductInfoCard } from "@/features/product/components/product-info-card";
import { ProductMediaHero } from "@/features/product/components/product-media-hero";
import { ProductPurchasePanel } from "@/features/product/components/product-purchase-panel";
import { ProductReviewsSection } from "@/features/product/components/product-reviews-section";
import { SHOW_PRODUCT_REVIEWS } from "@/features/product/lib/product-review-display";
import { useProductPurchase } from "@/features/product/hooks/use-product-purchase";
import type { Product } from "@/shared/contracts/domain";

const bottomNavOffset = "5.75rem";
const ctaBarHeight = "5.5rem";

export function ProductDetailScreen({ details }: { details: Product }) {
	const purchase = useProductPurchase(details);

	return (
		<div
			data-testid="product-detail-screen"
			className="min-h-screen bg-[#F8F8F8] pb-4 font-sans"
			style={{
				paddingBottom: `calc(${bottomNavOffset} + ${ctaBarHeight} + env(safe-area-inset-bottom, 0px))`,
			}}
		>
			<ProductMediaHero images={purchase.heroImages} name={details.name} />
			<ProductInfoCard
				details={details}
				selectedColor={purchase.selectedColor}
				displayUnitPrice={purchase.computedUnitPrice}
			/>
			{details.type === "bulk" ? (
				<BulkPricingTiersBar
					product={details}
					quantity={purchase.quantity}
					variant="pdp"
					className="mx-4 mt-4"
				/>
			) : null}
			<ProductPurchasePanel details={details} purchase={purchase} />
			{SHOW_PRODUCT_REVIEWS ? <ProductReviewsSection /> : null}
			<ProductDetailCtas onAddToCart={purchase.addToCart} />
		</div>
	);
}

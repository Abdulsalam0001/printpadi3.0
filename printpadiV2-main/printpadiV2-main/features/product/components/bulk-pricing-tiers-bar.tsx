import { cn, formatNaira } from "@/lib/utils";
import type { Product } from "@/shared/contracts/domain";

type PriceTier = NonNullable<Product["priceTiers"]>[number];

export function BulkPricingTiersBar({
	product,
	variant = "drawer",
	className,
}: {
	product: Product;
	quantity?: number;
	variant?: "drawer" | "pdp";
	className?: string;
}) {
	if (product.type !== "bulk") {
		return null;
	}

	const prices =
		Array.isArray(product.price) && product.price.length > 0 ? product.price : [0];
	const minPrice = prices[0] ?? 0;
	const maxPrice = prices[prices.length - 1] ?? minPrice;
	const tiers = product.priceTiers?.slice(0, 4) ?? [];

	const labelClass =
		variant === "pdp" ? "text-[10px] text-gray-4" : "text-[8px] text-gray-4";
	const priceClass = "font-semibold text-[15px]";
	const containerClass =
		variant === "pdp"
			? "flex items-center justify-between rounded-[10px] bg-[#F8F8F8] px-4 py-3"
			: "flex items-center justify-between bg-[#F8F8F8] -mx-4 px-5 py-3";

	const renderTier = (tier: PriceTier, key: string) => (
		<div key={key} className="flex flex-col items-center justify-center">
			<h2 className={priceClass}>₦{formatNaira(tier.price)}</h2>
			<p className={labelClass}>{tier.label}</p>
		</div>
	);

	return (
		<div className={cn(containerClass, className)}>
			{tiers.length > 0 ? (
				tiers.map(tier => renderTier(tier, `${tier.label}-${tier.price}`))
			) : (
				<>
					{renderTier(
						{ label: "Lowest tier", price: minPrice },
						"fallback-min",
					)}
					{renderTier(
						{ label: "Highest tier", price: maxPrice },
						"fallback-max",
					)}
				</>
			)}
		</div>
	);
}

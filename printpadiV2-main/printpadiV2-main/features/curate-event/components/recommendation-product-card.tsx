"use client";

import { useState } from "react";
import Image from "next/image";
import { AddCircle, MinusCirlce } from "iconsax-reactjs";
import { toast } from "sonner";
import { Button } from "@/components/button";
import { useCartStore } from "@/features/cart/store/cart-store";
import {
	clampQuantity,
	getComputedUnitPrice,
	getMinQuantity,
	getStockCeiling,
} from "@/features/cart/lib/pricing";
import {
	getProductCategoryLabel,
	getRecommendationLineTotal,
	getRecommendedQuantity,
} from "@/features/curate-event/lib/recommendation-products";
import { formatNaira } from "@/lib/utils";
import type { Product } from "@/shared/contracts/domain";

function resolveDefaultColor(product: Product) {
	const colorOptions = product.colors ?? [];
	if (colorOptions.length === 0) {
		return undefined;
	}

	if (product.defaultColorId) {
		const fromDefault = colorOptions.find(color => color.id === product.defaultColorId);
		if (fromDefault) {
			return fromDefault;
		}
	}

	return colorOptions[0];
}

type RecommendationProductCardProps = {
	product: Product;
	guestCount: number;
};

export function RecommendationProductCard({
	product,
	guestCount,
}: RecommendationProductCardProps) {
	const addItem = useCartStore(state => state.addItem);
	const defaultColor = resolveDefaultColor(product);
	const minQuantity = getMinQuantity(product);
	const maxQuantity = getStockCeiling(product, defaultColor?.name, defaultColor?.id);
	const initialQuantity = getRecommendedQuantity(product, guestCount);

	const [quantity, setQuantity] = useState(initialQuantity);

	const safeQuantity = clampQuantity(quantity, minQuantity, maxQuantity);
	const unitPrice = getComputedUnitPrice(product, safeQuantity, {});
	const lineTotal = getRecommendationLineTotal(safeQuantity, unitPrice);
	const categoryLabel = getProductCategoryLabel(product);
	const imageUrl = product.images[0] ?? "/shirts.svg";
	const sizeOptions = product.sizeScale?.options ?? [];
	const defaultSize =
		sizeOptions.find(option => option.id === product.sizeScale?.defaultOptionId) ??
		sizeOptions[0];

	const handleAddToCart = () => {
		if (safeQuantity <= 0) {
			toast.error("Quantity must be at least 1.");
			return;
		}

		addItem({
			product,
			quantity: safeQuantity,
			unitPrice,
			image: defaultColor?.primaryImageUrl ?? imageUrl,
			options: {
				...(defaultColor
					? {
							color: defaultColor.name,
							colorId: defaultColor.id,
							colorHex: defaultColor.hexValue,
						}
					: {}),
				...(defaultSize
					? {
							size: defaultSize.label,
							sizeOptionId: defaultSize.id,
						}
					: {}),
			},
		});
		toast.success(`${product.name} added to cart.`);
	};

	return (
		<article
			className="rounded-[15px] border border-neutral-200 bg-white p-3 shadow-sm"
			data-testid="recommendation-product-card"
		>
			<div className="flex gap-3">
				<div className="relative size-[72px] shrink-0 overflow-hidden rounded-[10px] bg-[#F3F4F6]">
					<Image
						src={imageUrl}
						alt={product.name}
						fill
						className="object-cover"
						sizes="72px"
						unoptimized
					/>
				</div>

				<div className="min-w-0 flex-1">
					<p className="text-[11px] italic text-neutral-600">{categoryLabel}</p>

					<div className="mt-0.5 flex items-start justify-between gap-2">
						<h3 className="font-bricolage-grotesque text-[15px] font-bold leading-tight text-[#1B2559]">
							{product.name}
						</h3>
						<p className="shrink-0 font-bricolage-grotesque text-[15px] font-bold text-[#1B2559]">
							₦{formatNaira(unitPrice)}
						</p>
					</div>

					<p className="mt-1 text-[11px] italic text-neutral-400">
						{safeQuantity} pcs × ₦{formatNaira(unitPrice)}
					</p>

					<div className="mt-2 flex items-center justify-between gap-2">
						<p className="font-bricolage-grotesque text-[18px] font-bold text-[#1B2559]">
							₦{formatNaira(lineTotal)}
						</p>

						<div className="flex h-10 w-36 shrink-0 items-center justify-between rounded-full border border-black px-3">
							<Button
								type="button"
								className="bg-transparent p-0 hover:bg-transparent"
								onClick={() =>
									setQuantity(current =>
										Math.max(minQuantity, current - 1),
									)
								}
							>
								<MinusCirlce size={16} color="#000000" />
							</Button>
							<span className="min-w-6 text-center font-sans text-[15px]">
								{safeQuantity}
							</span>
							<Button
								type="button"
								className="bg-transparent p-0 hover:bg-transparent"
								onClick={() => setQuantity(current => current + 1)}
								disabled={safeQuantity >= maxQuantity}
							>
								<AddCircle size={16} color="#000000" />
							</Button>
						</div>
					</div>
				</div>
			</div>

			<Button
				type="button"
				className="mt-3 w-full rounded-full py-2.5 text-[14px]"
				onClick={handleAddToCart}
			>
				Add to cart
			</Button>
		</article>
	);
}

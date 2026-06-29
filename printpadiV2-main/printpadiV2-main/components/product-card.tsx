"use client";
import star from "@/public/icons/star.svg";
import Image from "next/image";
import { cn, formatNaira } from "@/lib/utils";
import { Heart, ShoppingCart } from "iconsax-reactjs";
import { Product } from "@/lib/products";
import { useFavoritesStore } from "@/features/favorites/favorites-store";

import {
	Drawer,
	DrawerContent,
	DrawerTitle,
	DrawerTrigger,
} from "@/components/ui/drawer";
import SliderForm from "@/features/cart/components/slider-form";
import Link from "next/link";
import {
	getProductOriginFlagAlt,
	getProductOriginFlagSrc,
} from "@/lib/product-origin";
import { isProductCustomizable } from "@/features/product/lib/design-options";
import { saveScrollPositionForReturn } from "@/lib/scroll-restoration";

/** Re-enable when rating and order counts are real aggregates, not placeholders. */
const SHOW_PRODUCT_CARD_SOCIAL_PROOF = false;

/** Width comes from home deal-row wrapper flex-basis; fill that slot. */
const SECONDARY_CARD_WIDTH_CLASS = "w-full";

export const ProductCard = ({
	variation = "primary",
	details,
}: {
	variation?: "primary" | "secondary";
	details: Product;
}) => {
	const productHref = `/product/${details.id}`;
	const primaryImageOrFallback = details.images?.[0] || "/shirts.svg";
	const prices = Array.isArray(details.price) && details.price.length > 0 ? details.price : [0];
	const primaryPrice = prices[0];
	const tierPrices =
		details.priceTiers?.map(tier => tier.price).filter(price => Number.isFinite(price)) ??
		[];
	const bulkMinPrice =
		tierPrices.length > 0 ? Math.min(...tierPrices) : primaryPrice;
	const bulkDisplayPrice = details.basePrice && details.basePrice > 0
		? details.basePrice
		: bulkMinPrice;
	const secondaryMinPrice = prices[0] ?? bulkMinPrice;
	const secondaryMaxPrice = prices.length > 1 ? prices[prices.length - 1] : secondaryMinPrice;
	const secondaryShowPriceRange =
		variation === "secondary" &&
		details.type === "bulk" &&
		secondaryMinPrice !== secondaryMaxPrice;
	const secondaryPriceLabel = secondaryShowPriceRange
		? `₦${formatNaira(secondaryMinPrice)} - ${formatNaira(secondaryMaxPrice)}`
		: `₦${formatNaira(details.type === "bulk" ? bulkDisplayPrice : primaryPrice)}`;
	const isCustomizable = isProductCustomizable(details);
	const displayStock = details.stock ?? 0;
	const retailPcs = details.totalStockCount ?? displayStock;
	const displayMoq = details.moq ?? 10;
	const retailStockToneClass =
		retailPcs <= 10
			? "text-red-600"
			: retailPcs <= 50
				? "text-amber-500"
				: "text-green-600";

	const favorited = useFavoritesStore(s => s.isFavorite(details.id));
	const toggleFavorite = useFavoritesStore(s => s.toggleFavorite);

	return (
		<div className="relative z-10 w-full">
			<Link
				href={productHref}
				aria-label={`View ${details.name}`}
				className="absolute inset-0 z-0 rounded-[15.13px]"
				onClick={saveScrollPositionForReturn}
			/>
			<div
				className={cn("pointer-events-none relative z-10 rounded-[15.13px]", {
					"w-full border-[1.37px] border-[#F3F4F6] ": variation == "primary",
					[cn(SECONDARY_CARD_WIDTH_CLASS, "flex flex-col")]:
						variation == "secondary",
				})}
			>
				<div
					className={cn("pointer-events-none w-full shrink-0", {
						"relative h-[174.9px] overflow-hidden rounded-t-[15.13px] rounded-b-none":
							variation == "primary",
						"relative overflow-hidden rounded-[10px] bg-[#F3F4F6]":
							variation == "secondary",
					})}
				>
					{variation === "secondary" ? (
						<div className="w-full pt-[100%]" aria-hidden />
					) : null}
					<Image
						src={primaryImageOrFallback}
						alt="banner"
						fill
						priority
						sizes={variation === "secondary" ? "33vw" : "50vw"}
						className="absolute inset-0 object-cover object-center"
					/>

					<div
						className={cn(
							"absolute flex w-full items-start justify-between px-2",
							variation === "secondary" ? "top-1.5" : "top-2.5",
						)}
					>
						<div className="flex items-center space-x-0.75">
							{isCustomizable && (
								<span
									className={cn(
										"inline-flex items-center rounded-full bg-active-link font-medium leading-none text-white",
										variation === "secondary"
											? "h-3 px-1 text-[7px]"
											: "h-3.5 px-1 text-[8px]",
									)}
								>
									Customizable
								</span>
							)}
						</div>
						<button
							type="button"
							aria-pressed={favorited}
							aria-label={
								favorited ? `Remove ${details.name} from favorites` : `Save ${details.name} to favorites`
							}
							onClick={e => {
								e.preventDefault();
								e.stopPropagation();
								void toggleFavorite(details.id);
							}}
							className={cn("pointer-events-auto relative z-10 rounded-full flex justify-center bg-white cursor-pointer", {
								"p-2": variation == "primary",
								"p-[4.5px] border-[0.15px] border-[#AAAAAA]":
									variation == "secondary",
							})}
						>
							<Heart
								size={variation == "primary" ? "14" : "12"}
								color={favorited ? "#e11d48" : "#4a5565"}
								variant={favorited ? "Bold" : "Outline"}
								aria-hidden
							/>
						</button>
					</div>
				</div>

				<div
					className={cn("pointer-events-none", {
						"py-3.75 px-3 flex flex-col space-y-2": variation == "primary",
						"px-1 py-2 flex flex-col space-y-1": variation == "secondary",
					})}
				>
					{SHOW_PRODUCT_CARD_SOCIAL_PROOF && variation === "primary" && (
						<div className="flex items-center justify-between">
							<div className="flex items-center space-x-0.75">
								<Image alt="rating" src={star} />
								<span className="font-sans font-medium text-gray-5 italic text-[10px]">
									{details.rating}
								</span>
							</div>
							<div className="flex items-center space-x-0.75">
								<span className="font-sans text-gray-5 italic text-[10px]">
									{details.orders}+ orders
								</span>
							</div>
						</div>
					)}
					{variation == "secondary" ? (
						<div className="flex items-center justify-between gap-x-1.5">
							<h3 className="min-w-0 flex-1 truncate capitalize text-[10px] leading-tight">
								{details.name}
							</h3>
							<img
								alt={getProductOriginFlagAlt(details.origin)}
								src={getProductOriginFlagSrc(details.origin)}
								width={16}
								height={16}
								className="size-4 shrink-0 rounded-full object-cover"
								loading="lazy"
								decoding="async"
							/>
						</div>
					) : (
						<div className="flex items-start justify-between">
							<h3 className="h-11 text-[15px] font-medium capitalize leading-5.5">
								{details.name}
							</h3>
						</div>
					)}
					{/* <p
						className={cn("text-xs font-sans italic", {
							// hidden: details.type == "retail",
						})}
					>
						{details.moq} moq{" "}
					</p> */}
					{variation == "primary" &&
						(details.type == "retail" ? (
							<p
								className={cn(
									"text-xs font-sans italic",
									retailStockToneClass,
								)}
							>
								{retailPcs} pcs{" "}
							</p>
						) : (
							<p
								className={cn("text-xs font-sans italic", {
									// hidden: details.type == "retail",
								})}
							>
								{displayMoq} moq{" "}
							</p>
						))}

					<div className="flex items-center justify-between">
						<h2
							className={cn("font-sans", {
								"text-[19px] font-bold": variation == "primary",
								"text-[11px] font-semibold": variation == "secondary",
							})}
						>
							{variation === "secondary"
								? secondaryPriceLabel
								: `₦${formatNaira(details.type === "bulk" ? bulkDisplayPrice : primaryPrice)}`}
						</h2>
						<Drawer>
							<DrawerTrigger asChild>
								<button
									type="button"
									onPointerDown={e => e.stopPropagation()}
									onClick={e => e.stopPropagation()}
									className={cn(
										"pointer-events-auto relative z-10 text-[15px] capitalize font-medium bg-foreground text-background px-3 py-1.5 rounded-[17.05px] cursor-pointer",
										{
											"p-[8.95px] rounded-full": variation == "primary",
											hidden: variation == "secondary",
										},
									)}
									aria-label={`Add ${details.name} to cart`}
								>
									<ShoppingCart size="16" color="#ffffff" />
								</button>
							</DrawerTrigger>
							<DrawerContent className="border-none font-bricolage-grotesque bg-white">
								<DrawerTitle className="">
									<SliderForm details={details} />
								</DrawerTitle>
							</DrawerContent>
						</Drawer>

						{variation === "secondary" && details.type == "bulk" && (
							<p className="text-[#0000FF] font-extralight font-sans text-[9px] italic">
								(MOQ: {displayMoq} Pcs)
							</p>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

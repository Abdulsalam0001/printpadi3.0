import { ProductStarRating } from "@/features/product/components/product-star-rating";
import { SHOW_PRODUCT_REVIEWS } from "@/features/product/lib/product-review-display";
import type { Product } from "@/shared/contracts/domain";
import { formatNaira } from "@/lib/utils";

const MOCK_REVIEW_COUNT = 48;
const SAFE_PAYMENT_ICON = "/icons/trust/secure-payment.svg";
const DELIVERY_TIME_ICON = "/icons/trust/delivery-time.svg";

type ProductColor = NonNullable<Product["colors"]>[number];

export function ProductInfoCard({
	details,
	selectedColor,
	displayUnitPrice,
}: {
	details: Product;
	selectedColor?: ProductColor;
	displayUnitPrice?: number;
}) {
	const prices =
		Array.isArray(details.price) && details.price.length > 0 ? details.price : [0];
	const minPrice = prices[0] ?? 0;
	const bulkDisplayPrice =
		displayUnitPrice ??
		(details.basePrice && details.basePrice > 0 ? details.basePrice : minPrice);
	const displayPrice =
		details.type === "bulk" ? bulkDisplayPrice : minPrice;
	const selectedColorStock =
		selectedColor?.availability?.stockCount ?? selectedColor?.stockCount;
	const displayStock =
		selectedColorStock ?? details.totalStockCount ?? details.stock ?? 0;
	const stockLabel =
		selectedColor?.availability?.label ??
		(selectedColorStock != null ? `${selectedColorStock} in stock` : `${displayStock} in stock`);
	const isSelectedColorOutOfStock =
		details.type === "retail" && selectedColor?.availability?.status === "OUT_OF_STOCK";
	const rating = details.rating > 0 ? details.rating : 4.5;
	const bulkDetails = details.bulkDetails;
	const productionTimeLabel = bulkDetails?.productionTime?.trim() || null;
	const deliveryTimeLabel = bulkDetails?.deliveryTime?.trim() || null;

	return (
		<div className="mx-4 mt-4 rounded-[15px] border border-gray-1 bg-white px-4 py-5 shadow-sm">
			<h1 className="font-bricolage-grotesque text-[20px] font-bold leading-snug text-[#1E2939]">
				{details.name}
			</h1>

			{SHOW_PRODUCT_REVIEWS ? (
				<div className="mt-2 flex items-center gap-2">
					<ProductStarRating rating={rating} />
					<span className="font-sans text-[12px] text-gray-5">
						{rating} ({MOCK_REVIEW_COUNT} reviews)
					</span>
				</div>
			) : null}

			<p
				className={`font-bricolage-grotesque text-[30px] font-bold leading-none text-black ${SHOW_PRODUCT_REVIEWS ? "mt-3" : "mt-2"}`}
			>
				₦{formatNaira(displayPrice)}{" "}
				<span className="font-sans text-[14px] font-normal text-gray-5">per piece</span>
			</p>

			{details.type === "retail" ? (
				<p
					className={`mt-2 flex items-center gap-1.5 font-sans text-[14px] ${
						isSelectedColorOutOfStock ? "text-gray-5" : "text-[#16A34A]"
					}`}
				>
					<span
						className={`size-1.5 rounded-full ${isSelectedColorOutOfStock ? "bg-gray-4" : "bg-[#16A34A]"}`}
						aria-hidden
					/>
					{isSelectedColorOutOfStock ? stockLabel : `${displayStock} in stock`}
				</p>
			) : (
				<div className="mt-2">
					<div className="space-y-0.5 font-sans text-[11px] font-light text-gray-5">
						<p>
							MOQ:{" "}
							<span className="font-medium">{details.moq ?? 10} pcs</span>
						</p>
						{productionTimeLabel ? (
							<p>
								Production:{" "}
								<span className="font-medium">{productionTimeLabel}</span>
							</p>
						) : null}
					</div>
					<div className="mt-2.5">
						<div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
							<div className="flex items-center gap-0.5">
								<img
									src={SAFE_PAYMENT_ICON}
									alt=""
									width={22}
									height={20}
									className="h-2.5 w-[11px] shrink-0 object-contain"
									aria-hidden
								/>
								<span className="text-[9px] font-medium italic capitalize text-[#5EB447]">
									safe payments - secure privacy
								</span>
							</div>
							{deliveryTimeLabel ? (
								<div className="flex items-center gap-0.5">
									<img
										src={DELIVERY_TIME_ICON}
										alt=""
										width={24}
										height={20}
										className="h-2.5 w-3 shrink-0 object-contain"
										aria-hidden
									/>
									<span className="text-[9px] font-medium italic text-[#5EB447]">
										{deliveryTimeLabel}
									</span>
								</div>
							) : null}
						</div>
						<p className="mt-1 font-sans text-[9px] font-light italic text-gray-4">
							shipping fee to be negotiated.{" "}
							<span className="text-black underline">contact</span> us for cost
							estimate & more details
						</p>
					</div>
					{(bulkDetails?.supportsSample && bulkDetails.samplePrice != null) ||
					(bulkDetails?.designerFee != null && bulkDetails.designerFee > 0) ? (
						<div className="mt-2 space-y-0.5 font-sans text-[11px] font-light text-gray-5">
							{bulkDetails?.supportsSample && bulkDetails.samplePrice != null ? (
								<p>
									Sample available —{" "}
									<span className="font-medium">
										₦{formatNaira(bulkDetails.samplePrice)}
									</span>
								</p>
							) : null}
							{bulkDetails?.designerFee != null && bulkDetails.designerFee > 0 ? (
								<p>
									Designer fee:{" "}
									<span className="font-medium">
										₦{formatNaira(bulkDetails.designerFee)}
									</span>
								</p>
							) : null}
						</div>
					) : null}
				</div>
			)}

			<p className="mt-4 font-sans text-[11px] leading-relaxed text-[#4A5565]">
				{details.description ?? "No product description available yet."}
			</p>
		</div>
	);
}

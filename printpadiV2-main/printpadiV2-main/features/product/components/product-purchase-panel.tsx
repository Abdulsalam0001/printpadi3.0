"use client";

import { Button } from "@/components/button";
import type { useProductPurchase } from "@/features/product/hooks/use-product-purchase";
import type { Product } from "@/shared/contracts/domain";
import { AddCircle, MinusCirlce } from "iconsax-reactjs";
import { cn } from "@/lib/utils";
import { DesignMethodOptions } from "@/features/product/components/design-method-options";
import { DesignUpload } from "@/features/product/components/design-upload";
import {
	isProductCustomizable,
	UPLOAD_NOW_DESIGN_METHOD_ID,
} from "@/features/product/lib/design-options";

type PurchaseState = ReturnType<typeof useProductPurchase>;

export function ProductPurchasePanel({
	details,
	purchase,
}: {
	details: Product;
	purchase: PurchaseState;
}) {
	const {
		colorOptions,
		sizeOptions,
		optionSelects,
		selectedColor,
		setSelectedColor,
		selectedSize,
		setSelectedSize,
		selectedChoices,
		setChoiceForGroup,
		selectedDesignMethod,
		setSelectedDesignMethod,
		designFile,
		setDesignFile,
		quantity,
		setQuantity,
		minQuantity,
		maxQuantity,
	} = purchase;

	return (
		<div className="mx-4 mt-4 rounded-[15px] border border-gray-1 bg-white px-4 py-5 shadow-sm">
			{colorOptions.length > 0 ? (
				<div className="mb-8">
					<h3 className="mb-3 font-medium capitalize text-[15px] text-black">Color:</h3>
					<div className="flex flex-wrap items-center gap-3">
						{colorOptions.map(opt => {
							const isOutOfStock =
								details.type === "retail" &&
								opt.availability?.status === "OUT_OF_STOCK";
							const ariaLabel = isOutOfStock
								? `${opt.name} — Out of stock`
								: opt.name;

							return (
								<button
									key={opt.id}
									type="button"
									disabled={isOutOfStock}
									onClick={() => setSelectedColor(opt)}
									className={cn(
										"flex size-7 items-center justify-center rounded-full p-0.5",
										selectedColor?.id === opt.id && "ring-1 ring-black",
										isOutOfStock && "cursor-not-allowed opacity-40",
									)}
									aria-label={ariaLabel}
								>
									<span
										className="size-5 rounded-full"
										style={{ backgroundColor: opt.hexValue }}
									/>
								</button>
							);
						})}
					</div>
				</div>
			) : null}

			{sizeOptions.length > 0 ? (
				<div className="mb-8">
					<h3 className="mb-3 font-medium capitalize text-[15px] text-black">
						{details.sizeScale?.name ?? "Size"}:
					</h3>
					<div className="flex flex-wrap gap-2.5">
						{sizeOptions.map(opt => (
							<button
								key={opt.id}
								type="button"
								onClick={() => setSelectedSize(opt)}
								className={cn(
									"flex size-7 items-center justify-center rounded-full border border-[#AAAAAA] text-[11px] uppercase text-[#AAAAAA]",
									selectedSize?.id === opt.id && "border-black bg-black text-white",
								)}
							>
								{opt.label}
							</button>
						))}
					</div>
				</div>
			) : null}

			{optionSelects.length > 0 ? (
				<div className="mb-8">
					<h3 className="mb-3 font-medium capitalize text-[15px] text-black">
						Customization:
					</h3>
					<div className="flex flex-col gap-3">
						{optionSelects.map(group => (
							<label key={group.id} className="block">
								<span className="sr-only">{group.label}</span>
								<select
									value={
										selectedChoices[group.id] ??
										(group.isRequired ? group.choices[0]?.id : "") ??
										""
									}
									onChange={event =>
										setChoiceForGroup(
											group.id,
											event.target.value,
											group.isRequired,
										)
									}
									className="h-11 w-full appearance-none rounded-lg border border-gray-1 bg-[#F3F4F6] px-3 font-sans text-[14px] text-gray-4 outline-none"
								>
									{!group.isRequired ? (
										<option value="">Select {group.label}</option>
									) : null}
									{group.choices.map(choice => (
										<option key={choice.id} value={choice.id}>
											{choice.label}
											{choice.displayPriceAdjustment
												? ` (${choice.displayPriceAdjustment})`
												: ""}
										</option>
									))}
								</select>
							</label>
						))}
					</div>
				</div>
			) : null}

			{isProductCustomizable(details) ? (
				<div className="mb-8">
					<DesignMethodOptions
						value={selectedDesignMethod}
						onChange={setSelectedDesignMethod}
					/>
					{selectedDesignMethod === UPLOAD_NOW_DESIGN_METHOD_ID ? (
						<DesignUpload value={designFile} onChange={setDesignFile} />
					) : null}
				</div>
			) : null}

			<div>
				<h3 className="mb-3 font-medium capitalize text-[15px] text-black">Quantity:</h3>
				<div className="flex h-10 w-36 items-center justify-between rounded-full border border-black px-3">
					<Button
						type="button"
						className="bg-transparent p-0 hover:bg-transparent"
						onClick={() =>
							setQuantity(current => Math.max(minQuantity, current - 1))
						}
					>
						<MinusCirlce size={16} color="#000000" />
					</Button>
					<span className="min-w-6 text-center font-sans text-[15px]">{quantity}</span>
					<Button
						type="button"
						className="bg-transparent p-0 hover:bg-transparent"
						onClick={() => setQuantity(current => current + 1)}
						disabled={quantity >= maxQuantity}
					>
						<AddCircle size={16} color="#000000" />
					</Button>
				</div>
			</div>
		</div>
	);
}

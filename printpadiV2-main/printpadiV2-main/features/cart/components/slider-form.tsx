"use client";
import { Product } from "@/lib/products";
import Image from "next/image";
import { useMemo, useState } from "react";
import { Button } from "@/components/button";
import { WhatsAppChatButton } from "@/components/whatsapp-chat-button";
import { AddCircle, MinusCirlce } from "iconsax-reactjs";
import { useCartStore } from "@/features/cart/store/cart-store";
import { toast } from "sonner";
import { formatNaira } from "@/lib/utils";
import { isInternationalProductOrigin } from "@/lib/product-origin";
import { buildWhatsAppOrderMessage } from "@/shared/lib/whatsapp";
import {
	UNBOUNDED_STOCK,
	clampQuantity,
	getComputedUnitPrice,
	getMinQuantity,
	getStockCeiling,
} from "@/features/cart/lib/pricing";
import { DesignMethodOptions } from "@/features/product/components/design-method-options";
import {
	DesignUpload,
	type DesignUploadValue,
} from "@/features/product/components/design-upload";
import {
	DEFAULT_DESIGN_METHOD_ID,
	UPLOAD_NOW_DESIGN_METHOD_ID,
	isProductCustomizable,
} from "@/features/product/lib/design-options";
import { BulkPricingTiersBar } from "@/features/product/components/bulk-pricing-tiers-bar";

const SAFE_PAYMENT_ICON = "/icons/trust/secure-payment.svg";
const DELIVERY_TIME_ICON = "/icons/trust/delivery-time.svg";

const SliderForm = ({ details }: { details: Product }) => {
	const colorOptions = details.colors ?? [];
	const sizeOptions = details.sizeScale?.options ?? [];
	const customizationGroups = details.optionGroups?.customizations ?? [];
	const designOptionGroups = details.optionGroups?.designOptions ?? [];
	const [selectedColor, setSelectedColor] = useState(colorOptions[0]);
	const [selectedSize, setSelectedSize] = useState(
		sizeOptions.find(option => option.id === details.sizeScale?.defaultOptionId) ??
			sizeOptions[0],
	);
	const [selectedChoices, setSelectedChoices] = useState<Record<string, string>>(() => {
		const requiredGroups = [...customizationGroups, ...designOptionGroups];
		return requiredGroups.reduce<Record<string, string>>((acc, group) => {
			if (group.isRequired && group.choices[0]?.id) {
				acc[group.id] = group.choices[0].id;
			}
			return acc;
		}, {});
	});
	const [selectedDesignMethod, setSelectedDesignMethod] = useState(
		DEFAULT_DESIGN_METHOD_ID,
	);
	const [designFile, setDesignFile] = useState<DesignUploadValue | null>(null);
	const requiresDesignUpload =
		isProductCustomizable(details) &&
		selectedDesignMethod === UPLOAD_NOW_DESIGN_METHOD_ID;
	const addItem = useCartStore(state => state.addItem);
	const primaryImageOrFallback = details.images?.[0] || "/shirts.svg";
	const displayMoq = details.moq ?? 10;
	const displayStock = details.stock ?? 0;
	const totalRetailStock = details.totalStockCount ?? displayStock;
	const minQuantity = getMinQuantity(details);
	const maxQuantity = useMemo(
		() => getStockCeiling(details, selectedColor?.name),
		[details, selectedColor?.name],
	);
	const [quantity, setQuantity] = useState(() =>
		clampQuantity(minQuantity, minQuantity, maxQuantity),
	);
	const computedUnitPrice = getComputedUnitPrice(details, quantity, selectedChoices);
	const isOutOfStock = maxQuantity < minQuantity;

	const selectedChoiceLabels = useMemo(() => {
		const groups = details.optionGroups?.customizations ?? [];
		return groups
			.map(group => {
				const selectedChoiceId = selectedChoices[group.id];
				if (!selectedChoiceId) {
					return null;
				}
				const selectedChoice = group.choices.find(choice => choice.id === selectedChoiceId);
				if (!selectedChoice) {
					return null;
				}
				return `${group.name}: ${selectedChoice.label}`;
			})
			.filter((entry): entry is string => Boolean(entry));
	}, [details.optionGroups, selectedChoices]);

	const internationalOnly = isInternationalProductOrigin(details.origin);
	const deliveryTimeLabel = details.bulkDetails?.deliveryTime?.trim() || null;

	const whatsappMessage = useMemo(() => {
		const productUrl =
			typeof window !== "undefined" ? window.location.href : "";
		return buildWhatsAppOrderMessage({
			productName: details.name,
			origin: details.origin,
			quantity,
			unitPriceLabel: formatNaira(computedUnitPrice),
			colorLabel: selectedColor?.name,
			sizeLabel: selectedSize?.label,
			customizationLines: selectedChoiceLabels,
			productUrl,
			productType: details.type,
			internationalSourcing: internationalOnly,
			moqLine:
				details.type === "bulk" ? `MOQ: ${displayMoq} pcs.` : undefined,
		});
	}, [
		computedUnitPrice,
		details.name,
		details.origin,
		details.type,
		displayMoq,
		internationalOnly,
		quantity,
		selectedChoiceLabels,
		selectedColor?.name,
		selectedSize?.label,
	]);

	const updateQuantity = (nextValue: number) => {
		if (isOutOfStock) {
			setQuantity(0);
			toast.error("Selected variant is out of stock.");
			return;
		}
		const clamped = clampQuantity(nextValue, minQuantity, maxQuantity);
		setQuantity(clamped);
		if (nextValue < minQuantity) {
			toast.info(`Minimum order is ${minQuantity} pcs.`);
		}
		if (maxQuantity !== UNBOUNDED_STOCK && nextValue > maxQuantity) {
			toast.info(`Maximum available is ${maxQuantity} pcs.`);
		}
	};
	return (
		<div className="mx-4">
			<div className="flex items-stretch w-full space-x-2.5">
				<div className="px-4 py-0.75 rounded-[2.56px]">
					<Image src={primaryImageOrFallback} alt="" width={55} height={55} />
				</div>
				<div className="flex items-start justify-between w-full">
					<div className="capitalize flex flex-col items-start justify-start">
						<h3 className="font-medium capitalize text-xs">
							{details.name}
						</h3>
						<div className="font-light text-[9px] mt-3.75">
							<h5>
								availability:{" "}
								<span className="font-medium text-[#008000]">
									{details.availabilityLabel ??
										(totalRetailStock > 0 ? "In stock" : "Out of stock")}
								</span>
							</h5>
							{details.type === "retail" && (
								<h5>
									stock count:{" "}
									<span className="font-medium text-[#FFA500]">
										{totalRetailStock} pcs
									</span>
								</h5>
							)}
							{details.type === "bulk" && (
								<h5>
									MOQ: <span className="font-medium">{displayMoq} pcs</span>
								</h5>
							)}
						</div>
					</div>
					<div>
						<h2 className="font-semibold text-[15px]">₦{formatNaira(computedUnitPrice)}</h2>
						<p className="text-[9px] text-gray-4 text-right">per piece</p>
					</div>
				</div>
			</div>
			<div>
				<div className="flex items-center space-x-2.5 mt-2.5">
					<div className="flex items-center space-x-0.5">
						<img
							src={SAFE_PAYMENT_ICON}
							alt=""
							width={22}
							height={20}
							className="h-2.5 w-[11px] shrink-0 object-contain"
							aria-hidden
						/>
						<span className="capitalize text-[#5EB447] font-medium text-[7px] italic">
							safe payments - secure privacy
						</span>
					</div>
					{deliveryTimeLabel ? (
						<div className="flex items-center space-x-0.5">
							<img
								src={DELIVERY_TIME_ICON}
								alt=""
								width={24}
								height={20}
								className="h-2.5 w-3 shrink-0 object-contain"
								aria-hidden
							/>
							<span className="text-[#5EB447] font-medium text-[7px] italic">
								{deliveryTimeLabel}
							</span>
						</div>
					) : null}
				</div>
				<p className="font-sans italic text-gray-4 font-light text-[8px]">
					shipping fee to be negotiated.{" "}
					<span className="text-black underline">contact</span> us for cost
					estimate & more details
				</p>
			</div>
			{details.type == "bulk" && (
				<BulkPricingTiersBar
					product={details}
					quantity={quantity}
					variant="drawer"
					className="mt-10"
				/>
			)}
			<div className="mt-10 flex flex-col space-y-5">
				{details.type == "bulk" && (
					<>
						{details.availabilityLabel && (
							<div className="flex items-center space-x-2">
								<h3 className="font-normal capitalize text-xs">availability:</h3>
								<div className="border-[0.2px] text-[10px] border-black rounded-[30px] flex justify-between w-fit items-center px-1.75 py-0.75">
									{details.availabilityLabel}
								</div>
							</div>
						)}
					</>
				)}
				{colorOptions.length > 0 && (
					<>
						<div>
							<h3 className="font-medium capitalize text-xs mb-2.75">Color:</h3>
							<div className="flex items-center space-x-3.75">
								{colorOptions.map((opt, i) => (
									<label
										key={opt.id || i}
										className="flex items-center space-x-3 cursor-pointer"
									>
										<input
											type="radio"
											name="color"
											value={opt.id}
											checked={selectedColor?.id === opt.id}
											onChange={() => {
												setSelectedColor(opt);
												const nextMaxQuantity = getStockCeiling(details, opt.name);
												const nextClamped = clampQuantity(
													quantity,
													minQuantity,
													nextMaxQuantity,
												);
												if (nextClamped !== quantity) {
													setQuantity(nextClamped);
													toast.info(
														`Quantity adjusted to ${nextClamped} based on ${opt.name} stock.`,
													);
												}
											}}
											className="hidden peer"
										/>

										<div className="flex justify-center items-center p-[1.24px] rounded-full peer-checked:border-[0.19px] peer-checked:border-[#000000]">
											<div
												style={{ backgroundColor: opt.hexValue }}
												className="h-[15.5px] w-[15.5px] rounded-full"
											></div>
										</div>
									</label>
								))}
							</div>
						</div>
					</>
				)}
				{sizeOptions.length > 0 && (
					<div>
						<h3 className="font-medium capitalize text-xs mb-2.75">
							{details.sizeScale?.name ?? "Size"}:
						</h3>
						<div className="flex items-center space-x-3.75">
							{sizeOptions.map((opt, i) => (
								<label
									key={opt.id || i}
									className="flex items-center space-x-3 cursor-pointer"
								>
									<input
										type="radio"
										name="size"
										value={opt.id}
										checked={selectedSize?.id === opt.id}
										onChange={() => setSelectedSize(opt)}
										className="hidden peer"
									/>

									<div className="flex justify-center items-center text-[10px] h-6.5 w-6.5 p-1.75 rounded-full text-[#AAAAAA] uppercase border-[0.5px] border-[#AAAAAA] peer-checked:bg-[#000000] peer-checked:text-white">
										{opt.label}
									</div>
								</label>
							))}
						</div>
					</div>
				)}
				{customizationGroups.map(group => (
					<div key={group.id}>
						<h3 className="font-medium capitalize text-xs mb-2.75">
							{group.name}
						</h3>
						<div className="flex flex-wrap gap-2">
							{group.choices.map(choice => (
								<button
									type="button"
									key={choice.id}
									className="cursor-pointer"
									onClick={() => {
										const defaultChoiceId = group.isRequired
											? group.choices[0]?.id
											: undefined;
										const currentChoiceId =
											selectedChoices[group.id] ?? defaultChoiceId;
										if (!group.isRequired && currentChoiceId === choice.id) {
											setSelectedChoices(current => {
												const next = { ...current };
												delete next[group.id];
												return next;
											});
											return;
										}
										setSelectedChoices(current => ({
											...current,
											[group.id]: choice.id,
										}));
									}}
								>
									<input
										type="radio"
										name={`customization-${group.id}`}
										value={choice.id}
										checked={
											(
												selectedChoices[group.id] ??
												(group.isRequired ? group.choices[0]?.id : undefined)
											) === choice.id
										}
										onChange={() => {}}
										className="hidden peer"
									/>
									<div className="text-[10px] rounded-full border-[0.5px] border-[#AAAAAA] px-2 py-1 text-[#AAAAAA] peer-checked:bg-[#000000] peer-checked:text-white">
										{choice.label}
										{choice.displayPriceAdjustment &&
											` (${choice.displayPriceAdjustment})`}
									</div>
								</button>
							))}
						</div>
					</div>
				))}
				{isProductCustomizable(details) && (
					<div>
						<DesignMethodOptions
							variant="drawer"
							value={selectedDesignMethod}
							onChange={setSelectedDesignMethod}
						/>
						{selectedDesignMethod === UPLOAD_NOW_DESIGN_METHOD_ID && (
							<DesignUpload
								variant="drawer"
								value={designFile}
								onChange={setDesignFile}
							/>
						)}
					</div>
				)}
				{/* <div>
					<h3 className="font-medium capitalize text-xs mb-2.75">
						Customization <span className="text-gray-4">(Optional)</span>
					</h3>
				</div> */}
				<div>
					<h3 className="font-medium capitalize text-xs mb-2.75">Quantity</h3>
					<div className="border-[0.2px] border-black px-1.5 py-1.5 rounded-[30px] flex justify-between items-center gap-1 w-full max-w-40">
						<Button
							className="shrink-0 bg-white p-0"
							onClick={() => updateQuantity(quantity - 1)}
						>
							<MinusCirlce size="16" color="#000000" />
						</Button>
						<div className="flex min-w-0 flex-1 justify-center">
							<input
								type="number"
								value={quantity}
								onChange={event => {
									const parsed = Number.parseInt(event.target.value || "0", 10);
									if (!Number.isFinite(parsed)) {
										setQuantity(0);
										return;
									}
									// Allow free typing; clamp only on explicit actions.
									setQuantity(parsed);
								}}
								className="w-full min-w-[3ch] max-w-16 text-center text-[15px] font-normal tabular-nums"
							/>
						</div>
						<Button
							className="shrink-0 bg-white p-0"
							onClick={() => updateQuantity(quantity + 1)}
						>
							<AddCircle size="16" color="#000000" />
						</Button>
					</div>
					<p className="text-[10px] text-gray-4 mt-1">
						{isOutOfStock
							? "Out of stock for selected variant"
							: maxQuantity === UNBOUNDED_STOCK
								? `Allowed quantity: ${minQuantity}+ pcs`
								: `Allowed quantity: ${minQuantity}-${maxQuantity} pcs`}
					</p>
				</div>
				
			</div>
			<div
				className={`mt-10 mb-8 flex w-full gap-3 ${
					details.type === "bulk" && !internationalOnly
						? "flex-row items-stretch"
						: "flex-col"
				}`}
			>
				{!internationalOnly && (
					<Button
						className="font-medium text-[15px] py-4.5 rounded-[30px] w-full flex-1"
						onClick={() => {
							if (isOutOfStock) {
								toast.error("Cannot add to cart: selected variant is out of stock.");
								return;
							}
							if (quantity < minQuantity || quantity > maxQuantity) {
								toast.error("Please choose a valid quantity before adding to cart.");
								return;
							}
							if (requiresDesignUpload && !designFile) {
								toast.error("Please upload your design before adding to cart.");
								return;
							}
							const designFileOptions =
								requiresDesignUpload && designFile
									? {
											designFileUrl: designFile.url,
											designFilePublicId: designFile.publicId,
											designFileName: designFile.fileName,
										}
									: {};
							addItem({
								product: details,
								quantity,
								unitPrice: computedUnitPrice,
								minQuantity,
								maxQuantity,
								options:
									details.type === "retail" || colorOptions.length > 0
										? {
												color: selectedColor?.name,
												colorHex: selectedColor?.hexValue,
												size: selectedSize?.label,
												choiceSelections: selectedChoices,
												...(selectedDesignMethod
													? { designMethod: selectedDesignMethod }
													: {}),
												...designFileOptions,
											}
										: {
												choiceSelections: selectedChoices,
												...(selectedDesignMethod
													? { designMethod: selectedDesignMethod }
													: {}),
												...designFileOptions,
											},
							});
							toast.success(
								`${details.name} added (${quantity} pcs${selectedColor?.name ? `, ${selectedColor.name}` : ""}).`,
							);
						}}
					>
						Add To Cart
					</Button>
				)}
				{(details.type === "bulk" || internationalOnly) && (
					<WhatsAppChatButton
						message={whatsappMessage}
						className="font-medium text-[15px] py-4.5 rounded-[30px] w-full flex-1"
					/>
				)}
			</div>
		</div>
	);
};

export default SliderForm;

"use client";

import { useMemo, useState } from "react";
import type { Product } from "@/shared/contracts/domain";
import { useCartStore } from "@/features/cart/store/cart-store";
import {
	clampQuantity,
	getComputedUnitPrice,
	getStockCeiling,
} from "@/features/cart/lib/pricing";
import {
	DEFAULT_DESIGN_METHOD_ID,
	UPLOAD_NOW_DESIGN_METHOD_ID,
} from "@/features/product/lib/design-options";
import type { DesignUploadValue } from "@/features/product/components/design-upload";
import { toast } from "sonner";

const resolveDefaultColor = (details: Product) => {
	const colorOptions = details.colors ?? [];
	if (colorOptions.length === 0) {
		return undefined;
	}

	if (details.defaultColorId) {
		const fromDefault = colorOptions.find(color => color.id === details.defaultColorId);
		if (fromDefault) {
			return fromDefault;
		}
	}

	return colorOptions[0];
};

export function useProductPurchase(details: Product) {
	const colorOptions = details.colors ?? [];
	const sizeOptions = details.sizeScale?.options ?? [];
	const customizationGroups = useMemo(
		() => details.optionGroups?.customizations ?? [],
		[details.optionGroups?.customizations],
	);
	const designOptionGroups = useMemo(
		() => details.optionGroups?.designOptions ?? [],
		[details.optionGroups?.designOptions],
	);
	const defaultColor = resolveDefaultColor(details);
	const minQuantity = details.type === "bulk" ? (details.moq ?? 1) : 1;
	const initialMaxQuantity = getStockCeiling(
		details,
		defaultColor?.name,
		defaultColor?.id,
	);

	const [selectedColor, setSelectedColorState] = useState(defaultColor);
	const [selectedSize, setSelectedSize] = useState(() =>
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
	const [quantity, setQuantityState] = useState(() =>
		clampQuantity(
			details.type === "bulk" ? (details.moq ?? 10) : 2,
			minQuantity,
			initialMaxQuantity,
		),
	);
	const [selectedDesignMethod, setSelectedDesignMethod] = useState(
		DEFAULT_DESIGN_METHOD_ID,
	);
	const [designFile, setDesignFile] = useState<DesignUploadValue | null>(null);

	const addItem = useCartStore(state => state.addItem);

	const maxQuantity = getStockCeiling(
		details,
		selectedColor?.name,
		selectedColor?.id,
	);
	const safeQuantity = clampQuantity(quantity, minQuantity, maxQuantity);
	const computedUnitPrice = getComputedUnitPrice(
		details,
		safeQuantity,
		selectedChoices,
	);

	const heroImages = useMemo(() => {
		const productImages = (details.images ?? []).filter(Boolean);
		const colorImage = selectedColor?.primaryImageUrl?.trim();

		if (colorImage) {
			const rest = productImages.filter(url => url !== colorImage);
			const merged = [colorImage, ...rest];
			return merged.length > 0 ? merged : [colorImage];
		}

		return productImages.length > 0 ? productImages : ["/shirts.svg"];
	}, [details.images, selectedColor?.primaryImageUrl]);

	const cartImageUrl =
		selectedColor?.primaryImageUrl ?? details.images[0] ?? "/shirts.svg";

	const setSelectedColor: typeof setSelectedColorState = next => {
		setSelectedColorState(current => {
			const resolved = typeof next === "function" ? next(current) : next;
			if (!resolved) {
				return resolved;
			}

			const nextMax = getStockCeiling(details, resolved.name, resolved.id);
			setQuantityState(currentQty =>
				clampQuantity(currentQty, minQuantity, nextMax),
			);
			return resolved;
		});
	};

	const setQuantity = (next: number | ((current: number) => number)) => {
		setQuantityState(current => {
			const resolved = typeof next === "function" ? next(current) : next;
			return clampQuantity(resolved, minQuantity, maxQuantity);
		});
	};

	const setChoiceForGroup = (groupId: string, choiceId: string, isRequired: boolean) => {
		setSelectedChoices(current => {
			if (!isRequired && current[groupId] === choiceId) {
				const next = { ...current };
				delete next[groupId];
				return next;
			}
			return { ...current, [groupId]: choiceId };
		});
	};

	const requiresDesignUpload =
		selectedDesignMethod === UPLOAD_NOW_DESIGN_METHOD_ID;

	const addToCart = () => {
		if (requiresDesignUpload && !designFile) {
			toast.error("Please upload your design before adding to cart.");
			return;
		}
		addItem({
			product: details,
			quantity: safeQuantity,
			image: cartImageUrl,
			unitPrice: computedUnitPrice,
			options: {
				...(selectedColor
					? {
							color: selectedColor.name,
							colorId: selectedColor.id,
							colorHex: selectedColor.hexValue,
						}
					: {}),
				...(selectedSize
					? {
							size: selectedSize.label,
							sizeOptionId: selectedSize.id,
						}
					: {}),
				choiceSelections: selectedChoices,
				...(selectedDesignMethod
					? { designMethod: selectedDesignMethod }
					: {}),
				...(requiresDesignUpload && designFile
					? {
							designFileUrl: designFile.url,
							designFilePublicId: designFile.publicId,
							designFileName: designFile.fileName,
						}
					: {}),
			},
		});
		toast.success(`${details.name} added to cart.`);
	};

	const optionSelects = useMemo(
		() =>
			customizationGroups.map(group => ({
				id: group.id,
				label: group.name,
				choices: group.choices,
				isRequired: group.isRequired,
			})),
		[customizationGroups],
	);

	return {
		colorOptions,
		sizeOptions,
		customizationGroups,
		designOptionGroups,
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
		quantity: safeQuantity,
		setQuantity,
		minQuantity,
		maxQuantity,
		heroImages,
		cartImageUrl,
		computedUnitPrice,
		addToCart,
	};
}

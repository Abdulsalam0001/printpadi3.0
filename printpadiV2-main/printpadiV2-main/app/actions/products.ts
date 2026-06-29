"use server";

import "server-only";

import { unstable_cache } from "next/cache";
import { requiredEnv } from "@/shared/config/env";
import type { Product } from "@/shared/contracts/domain";
import { normalizeApiOrigin } from "@/shared/lib/api-base-url";

const baseApiUrl = `${normalizeApiOrigin(requiredEnv("BASE_API_URL"))}/api`;
const revalidateSeconds = 120;

type ProductsResponseShape =
	| RawProduct[]
	| {
			success?: boolean;
			data?: {
				products?: RawProduct[];
			};
	  };

type RawProductColor = {
	id?: string;
	name?: string;
	hexValue?: string;
	stockCount?: number;
	primaryImage?: { url?: string } | null;
	images?: Array<{ url?: string }>;
	availability?: {
		status?: string;
		label?: string;
		stockCount?: number;
	};
};

type RawProduct = {
	id?: string | number;
	name?: string;
	description?: string;
	segment?: string;
	category?: string;
	tagNames?: string[];
	summary?: {
		title?: string;
	};
	pricing?: {
		basePrice?: string | number;
		minimumPrice?: string | number;
		maximumPrice?: string | number;
		displayPrice?: string | number;
		displayMinimumPrice?: string | number;
		displayMaximumPrice?: string | number;
		tiers?: RawPriceTier[];
		breakdowns?: RawPriceTier[];
	};
	availability?: {
		label?: string;
		stockCount?: number;
		totalStockCount?: number;
	};
	bulk?: {
		moq?: number;
		pricingTiers?: RawPriceTier[];
		productionTime?: string | null;
		deliveryTime?: string | null;
		supportsSample?: boolean;
		samplePrice?: string | number | null;
		designerFee?: string | number | null;
	} | null;
	optionGroups?: {
		all?: RawOptionGroup[];
		customizations?: RawOptionGroup[];
		designOptions?: RawOptionGroup[];
	};
	sizeScale?: {
		id?: string;
		name?: string;
		defaultOptionId?: string;
		options?: Array<{
			id?: string;
			label?: string;
			position?: number;
		}>;
	};
	preview?: {
		primaryImage?: {
			url?: string;
		} | null;
		sizeScaleName?: string | null;
		colors?: RawProductColor[];
	};
	media?: {
		primaryImage?: { url?: string } | null;
		gallery?: Array<{ url?: string }>;
	};
	variants?: {
		colors?: RawProductColor[];
		sizeScale?: {
			id?: string;
			name?: string;
			defaultOptionId?: string;
			options?: Array<{
				id?: string;
				label?: string;
				position?: number;
			}>;
		};
		defaultColorId?: string;
	};
	images?: string[];
	badges?: string[];
	rating?: number;
	orders?: number;
	moq?: number;
	stock?: number;
	type?: "bulk" | "retail";
	price?: number[];
	origin?: string;
	isCustomizable?: boolean;
};

type RawPriceTier = {
	label?: string;
	name?: string;
	minQty?: number;
	maxQty?: number | null;
	fromQty?: number;
	toQty?: number;
	price?: string | number;
	amount?: string | number;
	unitPrice?: string | number;
	pricePerUnit?: string | number;
	position?: number;
};

type RawOptionGroup = {
	id?: string;
	category?: string;
	name?: string;
	isRequired?: boolean;
	choices?: Array<{
		id?: string;
		label?: string;
		priceAdjustment?: string | number;
		displayPriceAdjustment?: string;
		position?: number;
	}>;
};

const toNumber = (value: string | number | undefined, fallback = 0): number => {
	const parsed = Number(value);
	return Number.isFinite(parsed) ? parsed : fallback;
};

const normalizeAvailabilityLabel = (label?: string): string | undefined => {
	if (!label) {
		return undefined;
	}
	if (label.trim().toLowerCase() === "made to order") {
		return "Custom Order";
	}
	return label;
};

const resolveType = (raw: RawProduct): Product["type"] => {
	if (raw.type === "bulk" || raw.type === "retail") {
		return raw.type;
	}

	const segment = raw.segment?.toUpperCase();
	if (segment === "WHOLESALE" || segment === "BULK") {
		return "bulk";
	}

	return "retail";
};

const normalizeProduct = (raw: RawProduct): Product => {
	const type = resolveType(raw);
	const minPrice = toNumber(
		raw.pricing?.minimumPrice ?? raw.pricing?.displayMinimumPrice,
		0,
	);
	const maxPrice = toNumber(
		raw.pricing?.maximumPrice ??
			raw.pricing?.displayMaximumPrice ??
			raw.pricing?.basePrice ??
			raw.pricing?.displayPrice,
		minPrice,
	);
	const singlePrice = toNumber(
		raw.pricing?.basePrice ?? raw.pricing?.displayPrice,
		minPrice,
	);

	const rawTiers =
		raw.bulk?.pricingTiers ??
		raw.pricing?.tiers ??
		raw.pricing?.breakdowns ??
		[];
	const priceTiers = Array.isArray(rawTiers)
		? rawTiers
				.map(tier => {
					const tierPrice = toNumber(
						tier.price ?? tier.amount ?? tier.unitPrice ?? tier.pricePerUnit,
						NaN,
					);
					if (!Number.isFinite(tierPrice)) {
						return null;
					}
					const minQty = tier.minQty ?? tier.fromQty;
					const maxQty = tier.maxQty ?? tier.toQty;
					const label =
						tier.label ??
						tier.name ??
						(minQty && maxQty
							? `${minQty}-${maxQty} pcs`
							: minQty
								? `${minQty}+ pcs`
								: "Tier");
					return {
						label,
						minQty,
						maxQty,
						price: tierPrice,
					};
				})
				.filter((tier): tier is NonNullable<typeof tier> => tier !== null)
		: [];

	const tierPrices = priceTiers.map(tier => tier.price);
	const tierMinPrice =
		tierPrices.length > 0 ? Math.min(...tierPrices) : minPrice || singlePrice;
	const tierMaxPrice =
		tierPrices.length > 0 ? Math.max(...tierPrices) : maxPrice || singlePrice;
	const computedPrice =
		type === "bulk"
			? [tierMinPrice, tierMaxPrice]
			: [singlePrice || minPrice || maxPrice];
	const basePrice =
		type === "bulk" && singlePrice > 0
			? singlePrice
			: type === "retail"
				? singlePrice || minPrice || maxPrice
				: undefined;

	const galleryUrls = Array.isArray(raw.media?.gallery)
		? raw.media.gallery.map(item => item?.url).filter((url): url is string => Boolean(url))
		: [];
	const primaryImage =
		raw.media?.primaryImage?.url ?? raw.preview?.primaryImage?.url ?? galleryUrls[0];
	const imageList = Array.isArray(raw.images) ? raw.images.filter(Boolean) : [];
	const normalizedImages = [
		...(primaryImage ? [primaryImage] : []),
		...galleryUrls.filter(url => url !== primaryImage),
		...imageList.filter(url => url !== primaryImage),
	];
	const rawColors = raw.variants?.colors ?? raw.preview?.colors;
	const colors = Array.isArray(rawColors)
		? rawColors
				.filter(color => Boolean(color?.hexValue))
				.map(color => {
					const colorImageUrls = Array.isArray(color.images)
						? color.images.map(item => item?.url).filter((url): url is string => Boolean(url))
						: [];
					const primaryImageUrl =
						color.primaryImage?.url ?? colorImageUrls[0] ?? undefined;
					const availabilityStatus =
						color.availability?.status?.toUpperCase() === "OUT_OF_STOCK"
							? "OUT_OF_STOCK"
							: "IN_STOCK";
					const availabilityStockCount = color.availability?.stockCount ?? color.stockCount ?? 0;

					return {
						id: String(color.id ?? ""),
						name: color.name ?? "Color",
						hexValue: color.hexValue ?? "#000000",
						stockCount: color.stockCount,
						primaryImageUrl,
						availability: color.availability
							? {
									status: availabilityStatus as "IN_STOCK" | "OUT_OF_STOCK",
									label:
										color.availability.label ??
										(availabilityStatus === "OUT_OF_STOCK" ? "Out of Stock" : "In Stock"),
									stockCount: availabilityStockCount,
								}
							: undefined,
					};
				})
		: [];
	const defaultColorId = raw.variants?.defaultColorId
		? String(raw.variants.defaultColorId)
		: undefined;
	const sizeScaleSource = raw.variants?.sizeScale ?? raw.sizeScale;
	const sizeScaleOptions = Array.isArray(sizeScaleSource?.options)
		? sizeScaleSource.options
				.filter(option => Boolean(option?.id) && Boolean(option?.label))
				.map(option => ({
					id: String(option.id),
					label: String(option.label),
					position: option.position,
				}))
		: [];

	const mapOptionGroups = (groups: RawOptionGroup[] | undefined) =>
		Array.isArray(groups)
			? groups
					.filter(group => Boolean(group?.id) && Boolean(group?.name))
					.map(group => ({
						id: String(group.id),
						name: String(group.name),
						isRequired: Boolean(group.isRequired),
						choices: Array.isArray(group.choices)
							? group.choices
									.filter(choice => Boolean(choice?.id) && Boolean(choice?.label))
									.map(choice => ({
										id: String(choice.id),
										label: String(choice.label),
										priceAdjustment: toNumber(choice.priceAdjustment, 0),
										displayPriceAdjustment: choice.displayPriceAdjustment,
										position: choice.position,
									}))
							: [],
					}))
			: [];

	const allGroups = raw.optionGroups?.all ?? [];
	const derivedCustomizations =
		(raw.optionGroups?.customizations ?? []).length > 0
			? raw.optionGroups?.customizations
			: allGroups.filter(
					group => group.category?.toUpperCase() === "CUSTOMIZATION",
				);
	const derivedDesignOptions =
		(raw.optionGroups?.designOptions ?? []).length > 0
			? raw.optionGroups?.designOptions
			: allGroups.filter(group => group.category?.toUpperCase() === "DESIGN");

	const stock = raw.stock ?? raw.availability?.stockCount ?? raw.availability?.totalStockCount;
	const totalStockCount = raw.availability?.totalStockCount;
	const moq = raw.bulk?.moq ?? raw.moq ?? 10;
	const bulkDetails =
		type === "bulk"
			? {
					productionTime: raw.bulk?.productionTime ?? null,
					deliveryTime: raw.bulk?.deliveryTime ?? null,
					supportsSample: Boolean(raw.bulk?.supportsSample),
					samplePrice: raw.bulk?.supportsSample
						? toNumber(raw.bulk?.samplePrice ?? undefined, NaN) || null
						: null,
					designerFee:
						raw.bulk?.designerFee != null
							? toNumber(raw.bulk.designerFee, NaN) || null
							: null,
				}
			: undefined;

	return {
		id: String(raw.id ?? ""),
		name: raw.name ?? raw.summary?.title ?? "Untitled Product",
		description: raw.description,
		images: normalizedImages,
		badges: Array.isArray(raw.badges) ? raw.badges : [],
		rating: toNumber(raw.rating, 0),
		orders: toNumber(raw.orders, 0),
		type,
		moq: type === "bulk" ? moq : undefined,
		stock: type === "retail" ? toNumber(stock, 0) : undefined,
		totalStockCount:
			type === "retail" ? toNumber(totalStockCount, toNumber(stock, 0)) : undefined,
		price: computedPrice.filter(price => Number.isFinite(price)),
		basePrice,
		priceTiers,
		category: raw.category ?? "general",
		tagNames: Array.isArray(raw.tagNames) ? raw.tagNames : [],
		origin: raw.origin,
		isCustomizable:
			type === "bulk"
				? raw.isCustomizable !== false
				: Boolean(raw.isCustomizable),
		availabilityLabel: normalizeAvailabilityLabel(raw.availability?.label),
		sizeScaleName: raw.preview?.sizeScaleName ?? undefined,
		defaultColorId,
		colors,
		bulkDetails,
		sizeScale:
			sizeScaleOptions.length > 0
				? {
						id: String(sizeScaleSource?.id ?? ""),
						name:
							sizeScaleSource?.name ?? raw.preview?.sizeScaleName ?? "Size",
						defaultOptionId: sizeScaleSource?.defaultOptionId,
						options: sizeScaleOptions,
					}
				: undefined,
		optionGroups: {
			customizations: mapOptionGroups(derivedCustomizations),
			designOptions: mapOptionGroups(derivedDesignOptions),
		},
	};
};

const extractProducts = (payload: ProductsResponseShape): Product[] => {
	if (Array.isArray(payload)) {
		return payload.map(normalizeProduct);
	}

	if (!payload || typeof payload !== "object") {
		return [];
	}

	const products = payload.data?.products;
	return Array.isArray(products) ? products.map(normalizeProduct) : [];
};

const fetchProductsFromEndpoint = async (endpoint: string): Promise<Product[]> => {
	const response = await fetch(`${baseApiUrl}${endpoint}`, {
		headers: { "Content-Type": "application/json" },
		next: { revalidate: revalidateSeconds },
	});

	if (!response.ok) {
		return [];
	}

	const json = (await response.json()) as ProductsResponseShape;
	return extractProducts(json);
};

export const fetchAllProductsAction = unstable_cache(
	async () => fetchProductsFromEndpoint("/products"),
	["products:all"],
	{ revalidate: revalidateSeconds },
);

export const fetchRetailProductsAction = unstable_cache(
	async () => fetchProductsFromEndpoint("/products/retail"),
	["products:retail"],
	{ revalidate: revalidateSeconds },
);

export const fetchBulkProductsAction = unstable_cache(
	async () => fetchProductsFromEndpoint("/products/bulk"),
	["products:bulk"],
	{ revalidate: revalidateSeconds },
);

export const fetchChinaProductsAction = unstable_cache(
	async () => fetchProductsFromEndpoint("/products?origin=CHINA"),
	["products:china"],
	{ revalidate: revalidateSeconds },
);

function buildProductsListQuery(params: {
	q?: string;
	tag?: string;
	origin?: string;
}): string {
	const q = (params.q ?? "").trim();
	const tag = (params.tag ?? "").trim();
	const origin = (params.origin ?? "").trim();
	const search = new URLSearchParams();
	if (q) {
		search.set("q", q);
	}
	if (tag) {
		search.set("tag", tag);
	}
	if (origin) {
		search.set("origin", origin);
	}
	const qs = search.toString();
	return qs ? `?${qs}` : "";
}

export async function fetchProductsSearchAction(params: {
	q?: string;
	tag?: string;
}): Promise<Product[]> {
	return fetchProductsFromEndpoint(`/products${buildProductsListQuery(params)}`);
}

export async function fetchProductsByTagSlugAction(slug: string): Promise<Product[]> {
	const trimmed = slug.trim();
	if (!trimmed) {
		return [];
	}
	return fetchProductsSearchAction({ tag: trimmed });
}

const extractProductDetail = (payload: unknown): Product | null => {
	if (!payload || typeof payload !== "object") {
		return null;
	}

	const envelope = payload as {
		status?: string;
		success?: boolean;
		data?: RawProduct;
	};

	const ok = envelope.status === "success" || envelope.success === true;
	if (!ok || !envelope.data || typeof envelope.data !== "object") {
		return null;
	}

	if (Array.isArray(envelope.data)) {
		return null;
	}

	return normalizeProduct(envelope.data);
};

export async function fetchProductByIdAction(productId: string): Promise<Product | null> {
	const id = productId.trim();
	if (!id) {
		return null;
	}

	try {
		const response = await fetch(`${baseApiUrl}/products/${encodeURIComponent(id)}`, {
			headers: { Accept: "application/json", "Content-Type": "application/json" },
			next: { revalidate: revalidateSeconds },
		});

		if (!response.ok) {
			return null;
		}

		const json = await response.json();
		return extractProductDetail(json);
	} catch {
		return null;
	}
}

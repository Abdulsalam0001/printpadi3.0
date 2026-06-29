/**
 * True when `origin` indicates sourcing outside Nigeria (e.g. China).
 * Missing or blank origin is treated as domestic so legacy products keep cart behavior.
 */
export const isInternationalProductOrigin = (origin?: string): boolean => {
	if (!origin?.trim()) {
		return false;
	}
	const normalized = origin.trim().toLowerCase();
	const isNigeria =
		normalized === "nigeria" ||
		normalized === "ng" ||
		normalized === "naija" ||
		normalized.includes("nigeria");
	return !isNigeria;
};

const isChinaProductOrigin = (origin?: string): boolean => {
	if (!origin?.trim()) {
		return false;
	}
	const normalized = origin.trim().toLowerCase();
	return normalized === "china" || normalized === "cn" || normalized.includes("china");
};

/** Secondary card flags: only China is international; everything else defaults to Nigeria. */
export const getProductOriginFlagSrc = (origin?: string): string =>
	isChinaProductOrigin(origin) ? "/china.svg" : "/nigeria.svg";

export const getProductOriginFlagAlt = (origin?: string): string =>
	isChinaProductOrigin(origin)
		? "Product sourced from China"
		: "Product sourced from Nigeria";

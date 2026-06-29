import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function formatNaira(value: number): string {
	const safeValue = Number.isFinite(value) ? value : 0;
	return new Intl.NumberFormat("en-NG", {
		maximumFractionDigits: 0,
	}).format(safeValue);
}

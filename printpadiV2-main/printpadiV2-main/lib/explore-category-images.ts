/**
 * Deterministic artwork for Explore tiles until TagOption exposes image URLs from the API.
 * Uses existing public SVGs so screenshots stay stable without extra binary assets.
 */
const POOL = [
	"/lifestyle.svg",
	"/shirts.svg",
	"/china.svg",
	"/icons/services/curate-event.svg",
	"/icons/services/request-quote.svg",
	"/icons/services/ai-design.svg",
] as const;

export function exploreImageForSlug(slug: string): string {
	let h = 0;
	for (let i = 0; i < slug.length; i++) {
		h = (h * 31 + slug.charCodeAt(i)) | 0;
	}
	const idx = Math.abs(h) % POOL.length;
	return POOL[idx]!;
}

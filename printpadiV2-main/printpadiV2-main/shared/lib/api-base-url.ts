/**
 * API origin only: scheme + host + optional port. No path, no trailing slash, no `/api` suffix.
 * Accepts env values like `http://localhost:3000` or `http://localhost:3000/api` so callers can append `/api/...` once.
 */
export function normalizeApiOrigin(raw: string): string {
	let s = raw.trim().replace(/\/+$/, "");
	// Strip one or more trailing `/api` segments (e.g. …/api/api → origin only).
	while (/\/api$/i.test(s)) {
		s = s.replace(/\/api$/i, "");
	}
	return s;
}

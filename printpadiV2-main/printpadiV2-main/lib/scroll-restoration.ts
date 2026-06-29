const SCROLL_PREFIX = "pp-scroll:";
const RESTORE_FLAG = "pp-should-restore-scroll";

export function getScrollStorageKey(pathname: string, search = ""): string {
	return `${SCROLL_PREFIX}${pathname}${search}`;
}

/** Call before navigating to a product (or other detail) page. */
export function saveScrollPositionForReturn(): void {
	if (typeof window === "undefined") {
		return;
	}
	const key = getScrollStorageKey(window.location.pathname, window.location.search);
	sessionStorage.setItem(key, String(window.scrollY));
}

/** Call from a back button so the previous page knows to restore scroll. */
export function markScrollRestorePending(): void {
	if (typeof window === "undefined") {
		return;
	}
	sessionStorage.setItem(RESTORE_FLAG, "1");
}

export function consumeScrollRestore(pathname: string, search = ""): number | null {
	if (typeof window === "undefined") {
		return null;
	}
	if (sessionStorage.getItem(RESTORE_FLAG) !== "1") {
		return null;
	}
	sessionStorage.removeItem(RESTORE_FLAG);

	const key = getScrollStorageKey(pathname, search);
	const raw = sessionStorage.getItem(key);
	sessionStorage.removeItem(key);
	if (!raw) {
		return null;
	}
	const y = Number.parseInt(raw, 10);
	return Number.isFinite(y) ? y : null;
}

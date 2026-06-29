import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
	consumeScrollRestore,
	getScrollStorageKey,
	markScrollRestorePending,
	saveScrollPositionForReturn,
} from "@/lib/scroll-restoration";

describe("scroll restoration", () => {
	const storage = new Map<string, string>();

	beforeEach(() => {
		storage.clear();
		vi.stubGlobal("sessionStorage", {
			getItem: (key: string) => storage.get(key) ?? null,
			setItem: (key: string, value: string) => {
				storage.set(key, value);
			},
			removeItem: (key: string) => {
				storage.delete(key);
			},
		});
		vi.stubGlobal("window", {
			location: { pathname: "/search", search: "?q=shirt" },
			scrollY: 420,
		});
	});

	afterEach(() => {
		vi.unstubAllGlobals();
	});

	it("builds a stable storage key from path and query", () => {
		expect(getScrollStorageKey("/search", "?q=shirt")).toBe("pp-scroll:/search?q=shirt");
		expect(getScrollStorageKey("/", "")).toBe("pp-scroll:/");
	});

	it("saves scroll position for the current page", () => {
		saveScrollPositionForReturn();
		expect(storage.get("pp-scroll:/search?q=shirt")).toBe("420");
	});

	it("restores scroll only when the back flag is set", () => {
		saveScrollPositionForReturn();
		expect(consumeScrollRestore("/search", "?q=shirt")).toBeNull();

		markScrollRestorePending();
		expect(consumeScrollRestore("/search", "?q=shirt")).toBe(420);
		expect(storage.has("pp-scroll:/search?q=shirt")).toBe(false);
		expect(storage.has("pp-should-restore-scroll")).toBe(false);
	});

	it("does not restore when no saved position exists", () => {
		markScrollRestorePending();
		expect(consumeScrollRestore("/", "")).toBeNull();
	});
});

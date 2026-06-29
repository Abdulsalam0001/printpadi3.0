import { describe, expect, it } from "vitest";
import { isSubpageTopNavRoute } from "./navigation";

describe("isSubpageTopNavRoute", () => {
	it("returns false for home", () => {
		expect(isSubpageTopNavRoute("/")).toBe(false);
	});

	it("returns false for unrelated routes", () => {
		expect(isSubpageTopNavRoute("/cart")).toBe(false);
		expect(isSubpageTopNavRoute("/explore")).toBe(false);
		expect(isSubpageTopNavRoute("/profile")).toBe(false);
	});

	it("returns true for subpage top-nav routes", () => {
		expect(isSubpageTopNavRoute("/search")).toBe(true);
		expect(isSubpageTopNavRoute("/product/abc-123")).toBe(true);
		expect(isSubpageTopNavRoute("/service/request-quote")).toBe(true);
		expect(isSubpageTopNavRoute("/service/source-china")).toBe(true);
		expect(isSubpageTopNavRoute("/service/source-china/request-quote")).toBe(true);
		expect(isSubpageTopNavRoute("/cart/summary")).toBe(true);
	});
});

describe("padiOffers", () => {
	it("includes signages and display category", async () => {
		const { padiOffers } = await import("./navigation");
		const signages = padiOffers.find(
			offer => offer.name === "signages and display",
		);
		expect(signages).toEqual({
			name: "signages and display",
			link: "/search?tag=signages-and-display",
		});
	});
});

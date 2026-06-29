import { describe, expect, it } from "vitest";
import {
	getProductOriginFlagAlt,
	getProductOriginFlagSrc,
	isInternationalProductOrigin,
} from "@/lib/product-origin";

describe("product origin helpers", () => {
	it("treats nigeria and missing origins as domestic", () => {
		expect(isInternationalProductOrigin(undefined)).toBe(false);
		expect(isInternationalProductOrigin("")).toBe(false);
		expect(isInternationalProductOrigin("NIGERIA")).toBe(false);
		expect(isInternationalProductOrigin("nigeria")).toBe(false);
	});

	it("treats china origins as international", () => {
		expect(isInternationalProductOrigin("CHINA")).toBe(true);
		expect(isInternationalProductOrigin("china")).toBe(true);
	});

	it("maps flag src with nigeria as default fallback", () => {
		expect(getProductOriginFlagSrc(undefined)).toBe("/nigeria.svg");
		expect(getProductOriginFlagSrc("")).toBe("/nigeria.svg");
		expect(getProductOriginFlagSrc("NIGERIA")).toBe("/nigeria.svg");
		expect(getProductOriginFlagSrc("CHINA")).toBe("/china.svg");
		expect(getProductOriginFlagSrc("UK")).toBe("/nigeria.svg");
	});

	it("maps accessible alt text by origin", () => {
		expect(getProductOriginFlagAlt("NIGERIA")).toBe("Product sourced from Nigeria");
		expect(getProductOriginFlagAlt(undefined)).toBe("Product sourced from Nigeria");
		expect(getProductOriginFlagAlt("CHINA")).toBe("Product sourced from China");
	});
});

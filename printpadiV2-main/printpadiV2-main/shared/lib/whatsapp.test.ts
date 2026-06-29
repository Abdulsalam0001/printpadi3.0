import { describe, expect, it } from "vitest";
import {
	buildWhatsAppCustomQuoteMessage,
	buildWhatsAppOrderMessage,
	buildWhatsAppQuoteRequestMessage,
	buildWhatsAppUrl,
	normalizeWhatsAppPhone,
} from "@/shared/lib/whatsapp";

const baseQuoteInput = {
	fullName: "Jane Doe",
	phone: "08012345678",
	email: "jane@example.com",
	productCategory: "Corporate T-Shirts",
	productDescription: "Cotton crew neck",
	quantity: "100",
};

describe("whatsapp helpers", () => {
	it("normalizes phone digits", () => {
		expect(normalizeWhatsAppPhone("+234 801 234 5678")).toBe("2348012345678");
	});

	it("builds wa.me URL when phone is present", () => {
		const url = buildWhatsAppUrl("2348012345678", "Hello");
		expect(url).toBe("https://wa.me/2348012345678?text=Hello");
	});

	it("returns null URL when phone is empty", () => {
		expect(buildWhatsAppUrl("", "Hello")).toBeNull();
	});

	it("builds quote request message without reference", () => {
		const message = buildWhatsAppQuoteRequestMessage(baseQuoteInput);
		expect(message).toContain("request a custom quote (China sourcing)");
		expect(message).toContain("Full name: Jane Doe");
		expect(message).toContain("Phone: 08012345678");
		expect(message).toContain("Quantity needed: 100");
		expect(message).not.toContain("Reference image:");
	});

	it("builds quote request message with reference name and url", () => {
		const message = buildWhatsAppQuoteRequestMessage({
			...baseQuoteInput,
			referenceFileName: "mockup.png",
			referenceFileUrl: "https://res.cloudinary.com/demo/image/upload/mockup.png",
		});
		expect(message).toContain(
			"Reference image: mockup.png\nhttps://res.cloudinary.com/demo/image/upload/mockup.png",
		);
	});

	it("builds quote request message with reference url only", () => {
		const message = buildWhatsAppQuoteRequestMessage({
			...baseQuoteInput,
			referenceFileUrl: "https://res.cloudinary.com/demo/image/upload/mockup.png",
		});
		expect(message).toContain(
			"Reference image: https://res.cloudinary.com/demo/image/upload/mockup.png",
		);
		expect(message).not.toContain("mockup.png\n");
	});

	it("builds custom quote message with artwork choice", () => {
		const message = buildWhatsAppCustomQuoteMessage({
			...baseQuoteInput,
			artworkDesign: "Yes, I have artwork",
		});
		expect(message).toContain("request a custom quote.");
		expect(message).not.toContain("China sourcing");
		expect(message).toContain("Artwork & Design: Yes, I have artwork");
		expect(message).not.toContain("Reference image:");
	});

	it("builds custom quote message for design help", () => {
		const message = buildWhatsAppCustomQuoteMessage({
			...baseQuoteInput,
			artworkDesign: "Need design help",
		});
		expect(message).toContain("Artwork & Design: Need design help");
	});

	it("builds bulk order message without regressing existing fields", () => {
		const message = buildWhatsAppOrderMessage({
			productName: "Tee",
			quantity: 50,
			unitPriceLabel: "2,500",
			customizationLines: ["Logo print"],
			productUrl: "https://printpadi.com/product/1",
			productType: "bulk",
			internationalSourcing: false,
			moqLine: "MOQ: 10 pcs.",
		});
		expect(message).toContain("bulk order");
		expect(message).toContain("MOQ: 10 pcs.");
		expect(message).toContain("- Logo print");
	});
});

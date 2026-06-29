import type { EventStyleDto } from "@/lib/event-styles";

export const DEFAULT_EVENT_STYLES: EventStyleDto[] = [
	{
		id: "default-elegant-luxurious",
		name: "Elegant & Luxurious",
		slug: "elegant-luxurious",
		description: "Premium materials, gold accents",
		position: 0,
	},
	{
		id: "default-modern-minimalist",
		name: "Modern & Minimalist",
		slug: "modern-minimalist",
		description: "clean designs, simple colors",
		position: 1,
	},
	{
		id: "default-vibrant-colorful",
		name: "Vibrant & Colorful",
		slug: "vibrant-colorful",
		description: "bold colors, fun designs",
		position: 2,
	},
	{
		id: "default-traditional-classic",
		name: "Traditional & Classic",
		slug: "traditional-classic",
		description: "timeless designs",
		position: 3,
	},
	{
		id: "default-eco-friendly",
		name: "Eco-Friendly",
		slug: "eco-friendly",
		description: "sustainable materials",
		position: 4,
	},
];

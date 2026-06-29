import type { EventTypeDto } from "@/lib/event-types";

export type { EventTypeDto };

export const DEFAULT_EVENT_TYPES: EventTypeDto[] = [
	{
		id: "default-wedding",
		name: "Wedding",
		slug: "wedding",
		description: "Perfect for your special day",
		imagePath: "/wedding-event.svg",
		icon: "💒",
		position: 0,
	},
	{
		id: "default-birthday",
		name: "Birthday",
		slug: "birthday",
		description: "Celebrate another year",
		imagePath: "/birthday-event.svg",
		icon: "🎂",
		position: 1,
	},
	{
		id: "default-corporate",
		name: "Corporate",
		slug: "corporate",
		description: "Professional events & conferences",
		imagePath: "/cooperate-event.svg",
		icon: "💼",
		position: 2,
	},
	{
		id: "default-get-together",
		name: "Get Together",
		slug: "get-together",
		description: "Casual gatherings with friends",
		imagePath: "/gettogether-event.svg",
		icon: "🎉",
		position: 3,
	},
	{
		id: "default-concert",
		name: "Concert",
		slug: "concert",
		description: "Music events & festivals",
		imagePath: "/concert-event.svg",
		icon: "🎵",
		position: 4,
	},
];

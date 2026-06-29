export type PlaceholderReview = {
	id: string;
	author: string;
	verified: boolean;
	relativeTime: string;
	rating: number;
	body: string;
};

export const PLACEHOLDER_REVIEWS: PlaceholderReview[] = [
	{
		id: "1",
		author: "Chioma A.",
		verified: true,
		relativeTime: "2 weeks ago",
		rating: 5,
		body: "Excellent quality! The print came out exactly as I designed. Fast delivery too.",
	},
	{
		id: "2",
		author: "Tunde O.",
		verified: true,
		relativeTime: "1 month ago",
		rating: 5,
		body: "Great for our company event. Everyone loved the shirts. Will order again.",
	},
	{
		id: "3",
		author: "Amara N.",
		verified: true,
		relativeTime: "3 weeks ago",
		rating: 4,
		body: "Good quality material. Sizing was accurate. Only minor delay in shipping.",
	},
];

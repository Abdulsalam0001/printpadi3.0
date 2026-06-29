import { cn } from "@/lib/utils";

export function ProductStarRating({
	rating,
	className,
}: {
	rating: number;
	className?: string;
}) {
	const clamped = Math.min(5, Math.max(0, rating));
	const fullStars = Math.floor(clamped);
	const hasHalf = clamped - fullStars >= 0.25 && clamped - fullStars < 0.75;
	const emptyStars = 5 - fullStars - (hasHalf ? 1 : 0);

	return (
		<div className={cn("flex items-center gap-0.5", className)} aria-hidden>
			{Array.from({ length: fullStars }).map((_, i) => (
				<span key={`full-${i}`} className="text-[#FBBF24] text-[12px]">
					★
				</span>
			))}
			{hasHalf ? (
				<span className="text-[12px] text-[#FBBF24] opacity-70">★</span>
			) : null}
			{Array.from({ length: emptyStars }).map((_, i) => (
				<span key={`empty-${i}`} className="text-[12px] text-[#D1D5DB]">
					★
				</span>
			))}
		</div>
	);
}

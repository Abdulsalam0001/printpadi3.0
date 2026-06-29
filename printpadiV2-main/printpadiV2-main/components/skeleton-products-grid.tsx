"use client";

import { BentoGrid } from "./ui/bento-grid";
import { Skeleton } from "./ui/skeleton";

const SkeletonProductsGrid = () => {
	return (
		<div>
			<BentoGrid className="grid grid-col-2 gap-3.5">
				<Skeleton className="w-full rounded-[15.13px] h-84.75" />
				<Skeleton className="w-full rounded-[15.13px] h-84.75" />
				<Skeleton className="w-full rounded-[15.13px] h-84.75" />
				<Skeleton className="w-full rounded-[15.13px] h-84.75" />
			</BentoGrid>
		</div>
	);
};

export default SkeletonProductsGrid;

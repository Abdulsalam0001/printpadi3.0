import { BentoGrid } from "./ui/bento-grid";
import { cn } from "@/lib/utils";
import { ProductCard } from "./product-card";
import type { Product } from "@/shared/contracts/domain";

const ProductsGrid = ({ products }: { products: Product[] }) => {
	return (
		<BentoGrid className="grid grid-col-2 gap-3.5">
			{products.map(product => (
				// <BentoCard key={list.name} {...list} />
				<div
					key={product.id}
					className={cn(
						"group relative  flex flex-col justify-between overflow-hidden rounded-xl",
						// {
						// 	"col-span-1 row-span-2": list.type == "ad",
						// },
					)}
				>
					<ProductCard details={product} />
				</div>
			))}
		</BentoGrid>
	);
};

export default ProductsGrid;

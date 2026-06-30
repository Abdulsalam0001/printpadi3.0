// ============================================================
// PrintPadi – components/products-grid.tsx
// Exact port of components/products-grid.tsx from the Next.js project.
// ============================================================

import { BentoGrid } from './ui/bento-grid';
import { cn } from '@/lib/utils';
import { ProductCard } from './product-card';
import type { Product } from '@/shared/contracts/domain';

const ProductsGrid = ({ products }: { products: Product[] }) => {
  return (
    <BentoGrid className="grid grid-col-2 gap-3.5">
      {products.map(product => (
        <div
          key={product.id}
          className={cn(
            'group relative  flex flex-col justify-between overflow-hidden rounded-xl',
          )}
        >
          <ProductCard details={product} />
        </div>
      ))}
    </BentoGrid>
  );
};

export default ProductsGrid;

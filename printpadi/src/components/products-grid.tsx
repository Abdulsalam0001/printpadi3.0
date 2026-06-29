import { cn } from "@/lib/utils";
import type { Product } from "@/models/domain";
import { useHistory } from "react-router-dom";

const ProductsGrid = ({ products }: { products: Product[] }) => {
  const history = useHistory();

  const handleProductClick = (productId: string) => {
    history.push(`/product/${productId}`);
  };

  return (
    <div className={cn("grid gap-3.5", "grid-cols-2 md:grid-cols-3 lg:grid-cols-4")}>
      {products.map((product) => (
        <div
          key={product.id}
          onClick={() => handleProductClick(product.id)}
          style={{
            cursor: 'pointer',
            padding: '12px',
            border: '1px solid #eee',
            borderRadius: '8px',
            transition: 'transform 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.02)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          {product.images?.[0] && (
            <img
              src={product.images[0]}
              alt={product.name}
              style={{
                width: '100%',
                height: '200px',
                objectFit: 'cover',
                borderRadius: '8px',
                marginBottom: '8px',
              }}
            />
          )}
          <h3 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '4px' }}>
            {product.name}
          </h3>
          <p style={{ fontSize: '12px', color: '#666', marginBottom: '8px' }}>
            ₦{typeof product.price?.[0] === 'number' ? product.price[0].toLocaleString() : product.price?.[0]}
          </p>
        </div>
      ))}
    </div>
  );
};

export default ProductsGrid;


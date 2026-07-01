import React from 'react';

interface ProductCardProps {
  product: any;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <div style={{ padding: '12px', border: '1px solid #eee', borderRadius: '8px' }}>
      {product.images?.[0] && (
        <img src={product.images[0]} alt={product.name} style={{ width: '100%', borderRadius: '8px', marginBottom: '8px' }} />
      )}
      <h3 style={{ fontSize: '14px', fontWeight: '600' }}>{product.name}</h3>
      <p style={{ fontSize: '12px', color: '#666' }}>₦{product.price?.[0]?.toLocaleString()}</p>
    </div>
  );
};

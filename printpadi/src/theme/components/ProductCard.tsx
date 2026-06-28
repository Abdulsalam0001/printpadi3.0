// ============================================================
// PrintPadi – ProductCard Component
// Exact port of components/product-card.tsx
// Supports variation="primary" (2-col grid) and "secondary" (deal strip)
// ============================================================

import React, { useState } from 'react';
import { useHistory } from 'react-router';
import { formatNaira, cn } from '../lib/utils';
import { useFavoritesStore } from '../store/favoritesStore';
import type { Product } from '../models/domain';

interface ProductCardProps {
  product: Product;
  variation?: 'primary' | 'secondary';
  onAddCart?: (productId: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  variation = 'primary',
  onAddCart,
}) => {
  const history = useHistory();
  const [isFav, setIsFav] = useState(false);
  const toggleFav = useFavoritesStore(s => s.toggleFavorite);

  const handleFavClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFav(!isFav);
    await toggleFav(product.id);
  };

  const handleCardClick = () => {
    history.push(`/product/${product.id}`);
  };

  const handleAddCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddCart?.(product.id);
  };

  // Price display logic
  const prices = product.price || [0];
  const minPrice = Math.min(...prices.filter(p => p > 0));
  const maxPrice = Math.max(...prices.filter(p => p > 0));
  const displayPrice = product.type === 'bulk' 
    ? (product.basePrice || minPrice) 
    : minPrice;

  // Stock display
  const stock = product.totalStockCount ?? product.stock ?? 0;
  const stockClass = stock <= 10 ? 'text-red-600' : stock <= 50 ? 'text-amber-500' : 'text-green-600';
  const stockLabel = product.type === 'retail' ? `${stock} pcs` : `${product.moq||10} moq`;

  if (variation === 'secondary') {
    return (
      <div className="product-card-sec" onClick={handleCardClick}>
        <div className="product-card-sec__img">
          <img src={product.images[0]} alt={product.name} loading="lazy" />
          <div className="product-card-sec__overlay" onClick={e => e.stopPropagation()}>
            <div>
              {product.isCustomizable && (
                <span className="customizable-badge customizable-badge--sm">Customizable</span>
              )}
            </div>
            <button className="heart-btn heart-btn--sec" onClick={handleFavClick}>
              <svg viewBox="0 0 24 24" fill={isFav ? '#e11d48' : 'none'} stroke={isFav ? '#e11d48' : '#808080'} strokeWidth="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </button>
          </div>
        </div>
        <div className="product-card-sec__info">
          <div className="product-card-sec__name-row">
            <h3 className="product-card-sec__name">{product.name}</h3>
            <img 
              className="product-card-sec__flag" 
              src={product.origin === 'CN' ? '/flags/china.svg' : '/flags/nigeria.svg'} 
              alt={product.origin} 
              loading="lazy" 
            />
          </div>
          <div className="product-card-sec__price-row">
            <span className="product-card-sec__price">₦{formatNaira(displayPrice)}</span>
            {product.type === 'bulk' && (
              <span className="product-card-sec__moq">(MOQ: {product.moq||10} Pcs)</span>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Primary variant (2-col grid)
  return (
    <div className="product-card-pri" onClick={handleCardClick}>
      <div className="product-card-pri__img">
        <img src={product.images[0]} alt={product.name} loading="lazy" />
        <div className="product-card-pri__overlay" onClick={e => e.stopPropagation()}>
          <div>
            {product.isCustomizable && (
              <span className="customizable-badge customizable-badge--md">Customizable</span>
            )}
          </div>
          <button className="heart-btn heart-btn--pri" onClick={handleFavClick}>
            <svg viewBox="0 0 24 24" fill={isFav ? '#e11d48' : 'none'} stroke={isFav ? '#e11d48' : '#808080'} strokeWidth="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </button>
        </div>
      </div>
      <div className="product-card-pri__info">
        <h3 className="product-card-pri__name">{product.name}</h3>
        <p className={cn('product-card-pri__stock', stockClass)}>{stockLabel}</p>
        <div className="product-card-pri__bottom">
          <span className="product-card-pri__price">₦{formatNaira(displayPrice)}</span>
          <button className="add-cart-btn" onClick={handleAddCart}>
            <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;

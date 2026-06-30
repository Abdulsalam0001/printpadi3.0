// ============================================================
// PrintPadi – lib/products.ts
// Exact port of lib/products.ts from the Next.js project.
// Re-exports the Product type and ships the same dummy/fallback
// product data used while wiring up the real API.
// ============================================================

import type { Product as ProductContract } from '@/shared/contracts/domain';
export type Product = ProductContract;

// dummy data from products

export const products: ProductContract[] = [
  {
    id: '1',
    rating: 4.5,
    images: ['/card tets.jpg'],
    name: '\tPremium Business Cards - Matte Finish',
    badges: ['customizable'],
    orders: 2.5,
    type: 'bulk',
    moq: 10,
    price: [800, 1000],
    category: 'card',
    origin: 'china',
  },
  {
    id: '2',
    rating: 4.5,
    images: ['/mat.jpg'],
    name: '\tPremium Mat',
    badges: ['customizable'],
    orders: 2.5,
    type: 'retail',
    stock: 10,
    price: [800],
    category: 'mat',
    origin: 'china',
  },
  {
    id: '5',
    rating: 4.5,
    images: ['/shirts.svg'],
    name: '\tPremium Mat',
    badges: ['customizable'],
    orders: 2.5,
    type: 'retail',
    stock: 10,
    price: [800],
    category: 'mat',
    origin: 'china',
  },
  {
    id: '3',
    rating: 4.5,
    images: ['/cups test.jpg'],
    name: '\tPremium Cups',
    badges: ['star seller', 'customizable'],
    orders: 4.5,
    type: 'retail',
    stock: 10,
    price: [800],
    category: 'cup',
    origin: 'china',
  },
];

export const bulkProducts: ProductContract[] = [
  {
    id: '1',
    rating: 4.5,
    images: ['/card tets.jpg'],
    name: '\tPremium Business Cards - Matte Finish',
    badges: ['customizable'],
    orders: 2.5,
    type: 'bulk',
    moq: 10,
    price: [750, 850],
    category: 'card',
    origin: 'china',
  },
  {
    id: '2',
    rating: 4.5,
    images: ['/cups test.jpg'],
    name: 'Premium Business Cards - Matte Finish',
    badges: ['customizable'],
    orders: 2.5,
    type: 'bulk',
    moq: 10,
    price: [750, 850],
    category: 'card',
    origin: 'china',
  },
  {
    id: '3',
    rating: 4.5,
    images: ['/card tets.jpg'],
    name: 'Premium Business Cards - Matte Finish',
    badges: ['star seller', 'customizable'],
    orders: 4.5,
    type: 'bulk',
    moq: 10,
    price: [750, 850],
    category: 'card',
    origin: 'china',
  },
];
export const retailProducts: ProductContract[] = [
  {
    id: '1',
    rating: 4.5,
    images: ['/shirts.svg'],
    name: '\tPremium Business Cards - Matte Finish',
    badges: ['customizable'],
    orders: 2.5,
    type: 'retail',
    stock: 10,
    price: [800],
    category: 'mat',
    origin: 'china',
  },
  {
    id: '2',
    rating: 4.5,
    images: ['/mat.jpg'],
    name: '\tPremium Business Cards - Matte Finish',
    badges: ['customizable'],
    orders: 2.5,
    type: 'retail',
    stock: 10,
    price: [800],
    category: 'mat',
    origin: 'china',
  },
  {
    id: '3',
    rating: 4.5,
    images: ['/cups test.jpg'],
    name: '\tPremium Business Cards - Matte Finish',
    badges: ['star seller', 'customizable'],
    orders: 4.5,
    type: 'retail',
    stock: 10,
    price: [800],
    category: 'mat',
    origin: 'china',
  },
];

import { IonContent, IonPage } from '@ionic/react';
import { useEffect, useState } from 'react';
import { Carousel } from '../components/Carousel';
import { ProductCard } from '../components/ProductCard';
import { ContainerWithGradient } from '../components/ContainerWithGradient';
import type { Product } from '../models/domain';

// Mock product data — replace with API call in Step 7
const MOCK_PRODUCTS: Product[] = [
  {
    id: 'p1', name: 'Custom Business Cards', type: 'bulk', price: [3500, 7000],
    basePrice: 3500, moq: 100, stock: 500, totalStockCount: 500,
    images: ['https://placehold.co/400x400/E6E7E9/808080?text=Business+Cards'],
    origin: 'NG', category: 'business', tags: ['business'], isCustomizable: true,
    description: 'Premium matte business cards', rating: 4.5, orders: 120, badges: []
  },
  {
    id: 'p2', name: 'Wedding Invitation Cards', type: 'retail', price: [1200],
    stock: 45, totalStockCount: 45,
    images: ['https://placehold.co/400x400/f5e6ff/9810FA?text=Wedding'],
    origin: 'NG', category: 'wedding', tags: ['wedding'], isCustomizable: true,
    description: 'Elegant wedding cards', rating: 4.8, orders: 89, badges: []
  },
  {
    id: 'p3', name: 'Branded T-Shirts', type: 'bulk', price: [4500, 8000],
    basePrice: 4500, moq: 50, stock: 200, totalStockCount: 200,
    images: ['https://placehold.co/400x400/1a1a2e/ffffff?text=T-Shirts'],
    origin: 'CN', category: 'clothing', tags: ['gifts', 'events'], isCustomizable: true,
    description: 'High-quality branded t-shirts', rating: 4.6, orders: 156, badges: []
  },
  {
    id: 'p4', name: 'Custom Mugs', type: 'retail', price: [2800],
    stock: 8, totalStockCount: 8,
    images: ['https://placehold.co/400x400/fff3e0/E65100?text=Mugs'],
    origin: 'NG', category: 'gifts', tags: ['gifts'], isCustomizable: false,
    description: 'Ceramic mugs', rating: 4.4, orders: 45, badges: []
  },
  {
    id: 'p5', name: 'Event Flyers', type: 'bulk', price: [800, 2000],
    basePrice: 800, moq: 200, stock: 1000, totalStockCount: 1000,
    images: ['https://placehold.co/400x400/e8f5e9/2e7d32?text=Flyers'],
    origin: 'NG', category: 'events', tags: ['events'], isCustomizable: true,
    description: 'Full-colour A5 flyers', rating: 4.7, orders: 203, badges: []
  },
  {
    id: 'p6', name: 'Roll-up Banners', type: 'bulk', price: [15000, 25000],
    basePrice: 15000, moq: 5, stock: 100, totalStockCount: 100,
    images: ['https://placehold.co/400x400/e3f2fd/1565C0?text=Banners'],
    origin: 'NG', category: 'signage', tags: ['signages-and-display'], isCustomizable: true,
    description: 'Professional display banners', rating: 4.9, orders: 78, badges: []
  },
];

const CAROUSEL_IMAGES = [
  'https://placehold.co/400x115/1a1a2e/ffffff?text=PrintPadi+Deals',
  'https://placehold.co/400x115/2d1b69/ffffff?text=Custom+Printing',
  'https://placehold.co/400x115/0f3460/ffffff?text=Gift+Shop',
];

export default function Home() {
  const [products] = useState<Product[]>(MOCK_PRODUCTS);

  const retailProducts = products.filter(p => p.type === 'retail').slice(0, 3);
  const bulkProducts = products.filter(p => p.type === 'bulk').slice(0, 3);

  return (
    <IonPage>
      <IonContent fullscreen>
        <div style={{ paddingBottom: '80px' }}>
          {/* Carousel */}
          <div style={{ padding: '0 16px', marginTop: '10px' }}>
            <Carousel images={CAROUSEL_IMAGES}>
              <div style={{ maxWidth: '162px' }}>
                <h2 style={{ fontSize: '8px', fontWeight: 600, color: '#fff' }}>
                  Grab Up to 50% Off On Your First Bulk Purchase
                </h2>
                <button 
                  style={{
                    display: 'inline-block',
                    marginTop: '6px',
                    background: '#101010',
                    color: '#fff',
                    fontSize: '7.95px',
                    padding: '4px 10px',
                    borderRadius: '20px',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  shop now
                </button>
              </div>
            </Carousel>
          </div>

          {/* Gift shop deals */}
          <div style={{ marginTop: '40px' }}>
            <ContainerWithGradient
              title="gift shop deals"
              description="gift for everyone- retail or bulk, customized or not"
            >
              <div className="deals-row">
                {retailProducts.map(p => (
                  <div key={p.id} className="deal-card-wrap">
                    <ProductCard product={p} variation="secondary" />
                  </div>
                ))}
              </div>
            </ContainerWithGradient>
          </div>

          {/* Custom printing deals */}
          <div>
            <ContainerWithGradient
              title="custom printing deals"
              description="your ideas, your prints, with printpadi"
            >
              <div className="deals-row">
                {bulkProducts.map(p => (
                  <div key={p.id} className="deal-card-wrap">
                    <ProductCard product={p} variation="secondary" />
                  </div>
                ))}
              </div>
            </ContainerWithGradient>
          </div>

          {/* Explore latest */}
          <div style={{ padding: '0 16px', marginTop: '40px', marginBottom: '55px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '44px' }}>
              <h2 style={{ fontSize: '14px', fontWeight: 400, textTransform: 'capitalize' }}>
                explore latest printing &amp; branding
              </h2>
              <a href="/explore" style={{ color: '#9810FA', textDecoration: 'none', fontSize: '12px', fontWeight: 500 }}>
                View All
              </a>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px 0', justifyItems: 'center' }}>
              {[
                { name: 'new in packaging', img: 'https://placehold.co/175x182/E6E7E9/808080?text=Packaging' },
                { name: 'new in bags', img: 'https://placehold.co/175x182/E6E7E9/808080?text=Bags' },
                { name: 'new in clothing', img: 'https://placehold.co/175x182/E6E7E9/808080?text=Clothing' },
                { name: 'new in stickers & labels', img: 'https://placehold.co/175x182/E6E7E9/808080?text=Stickers' },
                { name: 'new in signage & posters', img: 'https://placehold.co/175x182/E6E7E9/808080?text=Signage' },
                { name: 'new in home & gifts', img: 'https://placehold.co/175x182/E6E7E9/808080?text=Gifts' },
              ].map(item => (
                <a 
                  key={item.name} 
                  href="/search" 
                  style={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    gap: '14px',
                    textDecoration: 'none',
                    color: 'inherit'
                  }}
                >
                  <img 
                    src={item.img} 
                    alt={item.name}
                    style={{ width: '175px', height: '182px', borderRadius: '8px', objectFit: 'cover' }}
                  />
                  <h4 style={{ fontSize: '12px', fontWeight: 500, textTransform: 'capitalize' }}>
                    {item.name}
                  </h4>
                </a>
              ))}
            </div>
          </div>

          {/* All products grid (2-col) */}
          <div style={{ padding: '0 16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h2 style={{ fontSize: '14px', fontWeight: 600 }}>explore products</h2>
              <a href="/explore" style={{ color: '#9810FA', textDecoration: 'none', fontSize: '12px', fontWeight: 500 }}>
                View All
              </a>
            </div>
            <div className="products-grid">
              {products.map(p => (
                <ProductCard key={p.id} product={p} variation="primary" />
              ))}
            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
}

// ============================================================
// PrintPadi – Home page
// Exact port of app/page.tsx from the Next.js project.
// (server component data-fetch → client-side useEffect fetch
// via the ported productsApi normalization layer)
// ============================================================

import { IonPage, IonContent } from '@ionic/react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { Button } from '@/components/button';
import { Carousel } from '@/components/image-display';
import { ContainerWithGradient } from '@/components/container';
import ImageLoaderWithCloudinary from '@/components/image-loader';
import ProductsGrid from '@/components/products-grid';
import { ProductCard } from '@/components/product-card';

import { exploreLatest, carouselImages } from '@/lib/homeData';
import {
  fetchAllProductsAction,
  fetchBulkProductsAction,
  fetchRetailProductsAction,
} from '@/lib/productsApi';
import type { Product } from '@/models/domain';

/** Horizontal deal strip: three full cards in row width; extra items scroll. */
const homeDealsRowClassName =
  'mt-3.75 -mx-4 flex items-start gap-3.75 overflow-x-auto overscroll-x-contain scroll-smooth snap-x snap-mandatory px-4 hide-scrollbar';
/** flex-basis matches gap-3.75 (0.9375rem): (100% − 2×gap) / 3 */
const homeDealsCardClassName =
  'shrink-0 snap-start w-[calc((100%-2*0.9375rem)/3)] flex-[0_0_calc((100%-2*0.9375rem)/3)]';

const Home: React.FC = () => {
  const [retailProducts, setRetailProducts] = useState<Product[]>([]);
  const [bulkProducts, setBulkProducts] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);

  useEffect(() => {
    let cancelled = false;

    const loadProducts = async () => {
      const [retail, bulk, all] = await Promise.all([
        fetchRetailProductsAction(),
        fetchBulkProductsAction(),
        fetchAllProductsAction(),
      ]);
      if (cancelled) return;
      setRetailProducts(retail);
      setBulkProducts(bulk);
      setAllProducts(all);
    };

    void loadProducts();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <IonPage>
      <IonContent fullscreen>
        <div className="flex min-h-screen font-bricolage-grotesque items-center justify-center mt-2.5">
          <main className="min-h-screen w-full">
            <div className="px-4">
              <Carousel images={carouselImages}>
                <div className="max-w-40.5">
                  <h2 className="font-semibold text-xs text-white">
                    Grab Up to 50% Off On Your First Bulk Purchase
                  </h2>
                  <Link to="/explore">
                    <Button className="text-[7.95px]">shop now</Button>
                  </Link>
                </div>
              </Carousel>
            </div>

            <div className="mt-10">
              <ContainerWithGradient
                description="gift for everyone- retail or bulk, customized or not"
                linkTo="/explore"
                title="gift shop deals"
              >
                <div className={homeDealsRowClassName}>
                  {retailProducts.slice(0, 3).map(product => (
                    <div key={product.id} className={homeDealsCardClassName}>
                      <ProductCard details={product} variation="secondary" />
                    </div>
                  ))}
                </div>
              </ContainerWithGradient>
            </div>

            <div>
              <ContainerWithGradient
                description="your ideas, your prints, with printpadi"
                linkTo="/explore"
                title="custom printing deals"
              >
                <div className={homeDealsRowClassName}>
                  {bulkProducts.slice(0, 3).map(product => (
                    <div key={product.id} className={homeDealsCardClassName}>
                      <ProductCard details={product} variation="secondary" />
                    </div>
                  ))}
                </div>
              </ContainerWithGradient>
            </div>

            <div className="px-4 mt-4">
              <div className="flex items-center justify-between">
                <h2 className="capitalize">explore latest printing & branding</h2>
                <Link to="/explore" className="text-active-link font-sans font-medium text-xs">
                  View All
                </Link>
              </div>
              <div className="mt-11 grid grid-cols-2 justify-items-center justify-between gap-y-7.5 gap-x-auto">
                {exploreLatest.map(item => (
                  <Link to={item.link} key={item.name}>
                    <div className="flex flex-col space-y-3.5">
                      <ImageLoaderWithCloudinary width={175} height={182} src={item.image} />
                      <h4 className="capitalize font-medium text-xs">{item.name}</h4>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            <div className="mt-19.5 mb-13.75 px-4">
              <div className="flex items-center justify-between mb-5.75">
                <h2 className="capitalize font-semibold">explore products</h2>
                <Link to="/explore" className="text-active-link font-sans font-medium text-xs">
                  View All
                </Link>
              </div>
              <ProductsGrid products={allProducts} />
            </div>
          </main>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Home;

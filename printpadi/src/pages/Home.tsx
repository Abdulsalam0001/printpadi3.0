import {
  IonPage,
  IonContent,
} from "@ionic/react";
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

import { Button } from "@/components/button";
import { Carousel } from "@/components/image-display";
import { ContainerWithGradient } from "@/components/container";
import ImageLoaderWithCloudinary from "@/components/image-loader";
import ProductsGrid from "@/components/products-grid";
import { ProductCard } from "@/components/product-card";

import { exploreLatest, carouselImages } from "@/lib/homeData";
import type { Product } from "@/models/domain";

const Home: React.FC = () => {
  const history = useHistory();
  const [retailProducts, setRetailProducts] = useState<Product[]>([]);
  const [bulkProducts, setBulkProducts] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const baseUrl = import.meta.env.VITE_API_BASE_URL || '';
        
        const [retail, bulk, all] = await Promise.all([
          fetch(`${baseUrl}/api/products/retail`)
            .then(res => res.json())
            .then(data => Array.isArray(data) ? data : data.data?.products || []),
          fetch(`${baseUrl}/api/products/bulk`)
            .then(res => res.json())
            .then(data => Array.isArray(data) ? data : data.data?.products || []),
          fetch(`${baseUrl}/api/products`)
            .then(res => res.json())
            .then(data => Array.isArray(data) ? data : data.data?.products || []),
        ]);

        setRetailProducts(retail);
        setBulkProducts(bulk);
        setAllProducts(all);
      } catch (err) {
        console.error('Failed to load products:', err);
        setError('Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  return (
    <IonPage>
      <IonContent fullscreen>

        {/* HERO CAROUSEL */}
        <div className="ion-padding">
          <Carousel images={carouselImages}>
            <div style={{ maxWidth: "160px" }}>
              <h2
                style={{
                  color: "#fff",
                  fontSize: "12px",
                  fontWeight: 600,
                }}
              >
                Grab Up to 50% Off On Your First Bulk Purchase
              </h2>

              <Button onClick={() => history.push('/explore')}>Shop Now</Button>
            </div>
          </Carousel>
        </div>

        {/* GIFT SHOP DEALS */}
        <ContainerWithGradient
          title="gift shop deals"
          description="gift for everyone- retail or bulk, customized or not"
          linkTo="/explore"
        >
          <div
            style={{
              display: "flex",
              gap: "12px",
              overflowX: "auto",
              padding: "16px",
            }}
          >
            {retailProducts.slice(0, 3).map((product: any) => (
              <div
                key={product.id}
                style={{
                  minWidth: "33%",
                  cursor: "pointer",
                }}
                onClick={() => history.push(`/product/${product.id}`)}
              >
                <ProductCard
                  details={product}
                  variation="secondary"
                />
              </div>
            ))}
          </div>
        </ContainerWithGradient>

        {/* CUSTOM PRINTING DEALS */}
        <ContainerWithGradient
          title="custom printing deals"
          description="your ideas, your prints, with printpadi"
          linkTo="/explore"
        >
          <div
            style={{
              display: "flex",
              gap: "12px",
              overflowX: "auto",
              padding: "16px",
            }}
          >
            {bulkProducts.slice(0, 3).map((product: any) => (
              <div
                key={product.id}
                style={{
                  minWidth: "33%",
                  cursor: "pointer",
                }}
                onClick={() => history.push(`/product/${product.id}`)}
              >
                <ProductCard
                  details={product}
                  variation="secondary"
                />
              </div>
            ))}
          </div>
        </ContainerWithGradient>

        {/* EXPLORE LATEST */}
        <div className="ion-padding">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <h2>Explore Latest Printing & Branding</h2>

            <button
              onClick={() => history.push('/explore')}
              style={{
                background: "none",
                border: "none",
                color: "var(--ion-color-primary)",
                cursor: "pointer",
              }}
            >
              View All
            </button>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "12px",
              marginTop: "16px",
            }}
          >
            {exploreLatest.map((item) => (
              <div
                key={item.name}
                onClick={() => history.push(item.link)}
                style={{
                  cursor: "pointer",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                  }}
                >
                  <ImageLoaderWithCloudinary
                    src={item.image}
                    width={175}
                    height={182}
                  />

                  <h4>{item.name}</h4>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* PRODUCTS */}
        <div className="ion-padding ion-margin-top">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "20px",
            }}
          >
            <h2>Explore Products</h2>

            <button
              onClick={() => history.push('/explore')}
              style={{
                background: "none",
                border: "none",
                color: "var(--ion-color-primary)",
                cursor: "pointer",
              }}
            >
              View All
            </button>
          </div>

          <ProductsGrid products={allProducts} />
        </div>

      </IonContent>
    </IonPage>
  );
};

export default Home;
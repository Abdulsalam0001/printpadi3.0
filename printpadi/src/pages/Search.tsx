import {
  IonPage,
  IonContent,
  IonSearchbar,
} from "@ionic/react";
import { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import ProductsGrid from "@/components/products-grid";
import type { Product } from "@/models/domain";

const Search: React.FC = () => {
  const history = useHistory();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Parse URL search params
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get('q') || '';
    const tag = params.get('tag') || '';
    
    setSearchQuery(q || tag);
    loadProducts(q, tag);
  }, [location.search]);

  const loadProducts = async (q: string, tag: string) => {
    try {
      setLoading(true);
      setError(null);

      const baseUrl = import.meta.env.VITE_API_BASE_URL || '';
      const searchParams = new URLSearchParams();
      
      if (q.trim()) {
        searchParams.set('q', q);
      }
      if (tag.trim()) {
        searchParams.set('tag', tag);
      }

      const endpoint = searchParams.toString() 
        ? `/api/products?${searchParams.toString()}`
        : '/api/products';

      const response = await fetch(`${baseUrl}${endpoint}`);
      
      if (!response.ok) {
        throw new Error('Failed to load products');
      }

      const data = await response.json();
      const productList = Array.isArray(data) ? data : data.data?.products || [];
      setProducts(productList);
    } catch (err) {
      console.error('Failed to load products:', err);
      setError('Failed to load products');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (newQuery: string) => {
    if (newQuery.trim()) {
      history.push(`/search?q=${encodeURIComponent(newQuery)}`);
    }
  };

  return (
    <IonPage>
      <IonContent fullscreen>
        <div style={{ padding: "16px" }}>
          {/* Search Bar */}
          <IonSearchbar
            value={searchQuery}
            onIonChange={(e) => setSearchQuery(e.detail.value || '')}
            onIonBlur={() => {
              if (searchQuery.trim()) {
                handleSearch(searchQuery);
              }
            }}
            placeholder="Search products..."
            style={{
              paddingLeft: 0,
              paddingRight: 0,
              paddingTop: "8px",
              paddingBottom: "8px",
            }}
          />

          {/* Results */}
          {loading ? (
            <div style={{ textAlign: "center", padding: "40px 20px" }}>
              <p>Loading products...</p>
            </div>
          ) : error ? (
            <div style={{ textAlign: "center", padding: "40px 20px" }}>
              <p style={{ color: "#999" }}>{error}</p>
            </div>
          ) : products.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px 20px" }}>
              <p style={{ color: "#999" }}>No products found</p>
            </div>
          ) : (
            <>
              <p style={{
                color: "#666",
                fontSize: "14px",
                marginTop: "16px",
                marginBottom: "16px",
              }}>
                Found {products.length} product{products.length !== 1 ? 's' : ''}
              </p>
              <ProductsGrid products={products} />
            </>
          )}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Search;


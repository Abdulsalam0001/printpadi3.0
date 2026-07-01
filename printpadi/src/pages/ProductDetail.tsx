import {
  IonPage,
  IonContent,
  IonButton,
} from "@ionic/react";
import { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import type { Product } from "@/models/domain";
import { useCartStore } from "@/store/cartStore";

const ProductDetail: React.FC = () => {
  const history = useHistory();
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore((s) => s.addItem);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        setError(null);

        const baseUrl = import.meta.env.VITE_API_BASE_URL || '';
        const response = await fetch(`${baseUrl}/api/products/${id}`);

        if (!response.ok) {
          throw new Error('Failed to load product');
        }

        const data = await response.json();
        const productData = data.data || data;
        setProduct(productData);

        // Set default color and size
        if (productData.colors && productData.colors.length > 0) {
          setSelectedColor(productData.colors[0].id);
        }
        if (productData.sizeScale?.options && productData.sizeScale.options.length > 0) {
          setSelectedSize(productData.sizeScale.options[0].id);
        }
      } catch (err) {
        console.error('Failed to load product:', err);
        setError('Failed to load product details');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadProduct();
    }
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      addItem({
        product,
        quantity,
        options: {
          colorId: selectedColor || undefined,
          sizeOptionId: selectedSize || undefined,
        },
        unitPrice: (product.price[0] || 0),
      });
      history.push('/cart');
    }
  };

  if (loading) {
    return (
      <IonPage>
        <IonContent>
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <p>Loading product...</p>
          </div>
        </IonContent>
      </IonPage>
    );
  }

  if (error || !product) {
    return (
      <IonPage>
        <IonContent>
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <p>{error || 'Product not found'}</p>
            <IonButton onClick={() => history.push('/explore')}>
              Back to Explore
            </IonButton>
          </div>
        </IonContent>
      </IonPage>
    );
  }

  return (
    <IonPage>
      <IonContent fullscreen>
        <div style={{ padding: '16px' }}>
          {/* Product Image */}
          {product.images && product.images.length > 0 && (
            <img
              src={product.images[0]}
              alt={product.name}
              style={{
                width: '100%',
                height: '300px',
                objectFit: 'cover',
                borderRadius: '8px',
                marginBottom: '20px',
              }}
            />
          )}

          {/* Product Name */}
          <h1 style={{ fontSize: '24px', fontWeight: '600', margin: '0 0 12px 0' }}>
            {product.name}
          </h1>

          {/* Rating and Orders */}
          <p style={{ fontSize: '14px', color: '#666', margin: '0 0 16px 0' }}>
            {product.rating ? `⭐ ${product.rating} rating` : ''}
            {product.orders ? ` • ${product.orders} orders` : ''}
          </p>

          {/* Price */}
          <h2 style={{
            fontSize: '20px',
            fontWeight: '600',
            color: '#333',
            margin: '0 0 16px 0',
          }}>
            ₦{(product.price[0] || 0).toLocaleString()}
            {product.price.length > 1 && (
              <span style={{ fontSize: '14px', color: '#666', marginLeft: '8px' }}>
                - ₦{product.price[product.price.length - 1].toLocaleString()}
              </span>
            )}
          </h2>

          {/* Description */}
          {product.description && (
            <p style={{ fontSize: '14px', color: '#666', marginBottom: '20px' }}>
              {product.description}
            </p>
          )}

          {/* Colors */}
          {product.colors && product.colors.length > 0 && (
            <div style={{ marginBottom: '20px' }}>
              <label style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px', display: 'block' }}>
                Color
              </label>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {product.colors.map((color) => (
                  <button
                    key={color.id}
                    onClick={() => setSelectedColor(color.id)}
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      backgroundColor: color.hexValue,
                      border: selectedColor === color.id ? '3px solid #000' : '2px solid #ccc',
                      cursor: 'pointer',
                    }}
                    title={color.name}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px', display: 'block' }}>
              Quantity
            </label>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              width: 'fit-content',
            }}>
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '4px',
                  border: '1px solid #ddd',
                  backgroundColor: '#fff',
                  cursor: 'pointer',
                  fontSize: '18px',
                }}
              >
                −
              </button>
              <span style={{ fontSize: '16px', fontWeight: '600', minWidth: '40px', textAlign: 'center' }}>
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '4px',
                  border: '1px solid #ddd',
                  backgroundColor: '#fff',
                  cursor: 'pointer',
                  fontSize: '18px',
                }}
              >
                +
              </button>
            </div>
          </div>

          {/* Add to Cart Button */}
          <IonButton expand="block" onClick={handleAddToCart}>
            Add to Cart
          </IonButton>
          <IonButton expand="block" fill="outline" onClick={() => history.push('/explore')}>
            Continue Shopping
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default ProductDetail;

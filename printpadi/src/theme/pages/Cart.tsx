import { IonContent, IonPage } from '@ionic/react';
import { useState } from 'react';
import { useCartStore } from '../store/cartStore';
import { formatNaira } from '../lib/utils';

export default function Cart() {
  const [tab, setTab] = useState<'cart' | 'ongoing' | 'completed'>('cart');
  const { cart, subtotal, removeItem, incrementItem, decrementItem } = useCartStore();
  const sub = subtotal();

  return (
    <IonPage>
      <IonContent fullscreen>
        <div style={{ padding: '43px 16px 0' }}>
          {/* Tabs */}
          <div className="cart-tabs">
            <button
              className={`cart-tab-btn ${tab === 'cart' ? 'cart-tab-btn--active' : ''}`}
              onClick={() => setTab('cart')}
            >
              My Cart
            </button>
            <button
              className={`cart-tab-btn ${tab === 'ongoing' ? 'cart-tab-btn--active' : ''}`}
              onClick={() => setTab('ongoing')}
            >
              Ongoing
            </button>
            <button
              className={`cart-tab-btn ${tab === 'completed' ? 'cart-tab-btn--active' : ''}`}
              onClick={() => setTab('completed')}
            >
              Completed
            </button>
          </div>

          {/* Cart Tab */}
          {tab === 'cart' && (
            <div>
              {cart.items.length === 0 ? (
                <div className="empty-cart">
                  <p>Your cart is empty. Add products from home or product pages.</p>
                </div>
              ) : (
                <>
                  <div id="cart-items-list" style={{ marginBottom: '16px' }}>
                    {cart.items.map(item => (
                      <div key={item.id} className="cart-item-card">
                        <img src={item.image} alt={item.name} />
                        <div className="cart-item__info">
                          <div className="cart-item__top">
                            <span className="cart-item__name">{item.name}</span>
                            <button 
                              className="trash-btn"
                              onClick={() => removeItem(item.id)}
                            >
                              🗑️
                            </button>
                          </div>
                          <div className="qty-price-row">
                            <div>
                              <p className="unit-price-label">{item.quantity} pcs × ₦{formatNaira(item.unitPrice.amount)}</p>
                              <p className="item-total-price">₦{formatNaira(item.quantity * item.unitPrice.amount)}</p>
                            </div>
                            <div className="qty-controls">
                              <button onClick={() => decrementItem(item.id)}>−</button>
                              <span className="qty-value">{item.quantity}</span>
                              <button onClick={() => incrementItem(item.id)}>+</button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="cart-subtotal">
                    <span className="cart-subtotal__label">Subtotal</span>
                    <strong className="cart-subtotal__value">₦{formatNaira(sub.amount)}</strong>
                  </div>
                  <a href="/cart/summary" style={{ textDecoration: 'none' }}>
                    <button className="checkout-btn">checkout</button>
                  </a>
                </>
              )}
            </div>
          )}

          {/* Ongoing Tab */}
          {tab === 'ongoing' && (
            <div className="order-card">
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div>
                  <div className="order-id">ORD-2024-1234</div>
                  <div className="order-amount">₦200,000</div>
                </div>
                <span className="status-badge-blue">In Transit</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
                <div>
                  <div style={{ fontSize: '10px', color: '#808080' }}>Total</div>
                  <div style={{ fontSize: '16px', fontWeight: 700 }}>₦200,000</div>
                </div>
                <button className="track-order-btn">Track Order</button>
              </div>
            </div>
          )}

          {/* Completed Tab */}
          {tab === 'completed' && (
            <p style={{ textAlign: 'center', padding: '40px 0', color: '#808080', fontSize: '14px' }}>
              No completed orders yet.
            </p>
          )}
        </div>
      </IonContent>
    </IonPage>
  );
}

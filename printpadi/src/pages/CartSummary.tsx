import React, { useMemo } from "react";
import {
  IonPage,
  IonContent,
  IonButton,
} from "@ionic/react";
import { useHistory } from "react-router-dom";
import { useCartStore } from "@/store/cartStore";

const CartSummary: React.FC = () => {
  const history = useHistory();
  const cartItems = useCartStore((s) => s.cart.items);
  const [shippingCost, setShippingCost] = React.useState(0);

  const totalPrice = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + item.unitPrice.amount * item.quantity, 0);
  }, [cartItems]);

  React.useEffect(() => {
    // Calculate shipping based on location
    // For now, a simple flat rate
    setShippingCost(2500);
  }, [cartItems]);

  const handlePlaceOrder = () => {
    // Navigate to checkout
    history.push("/checkout");
  };

  const handleContinueShopping = () => {
    history.push("/explore");
  };

  return (
    <IonPage>
      <IonContent fullscreen>
        <div style={{ padding: "16px" }}>
          <h1 style={{ fontSize: "24px", fontWeight: "600", marginBottom: "20px" }}>
            Order Summary
          </h1>

          {/* Order Items */}
          <div style={{ marginBottom: "20px" }}>
            <h2 style={{ fontSize: "16px", fontWeight: "600", marginBottom: "12px" }}>
              Order Items
            </h2>
            {cartItems.map((item, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "12px 0",
                  borderBottom: "1px solid #e0e0e0",
                }}
              >
                <div>
                  <p style={{ fontSize: "14px", fontWeight: "500", margin: 0 }}>
                    {item.name}
                  </p>
                  <p style={{ fontSize: "12px", color: "#666", margin: "4px 0 0 0" }}>
                    Qty: {item.quantity}
                  </p>
                </div>
                <p style={{ fontSize: "14px", fontWeight: "600", margin: 0 }}>
                  ₦{(item.unitPrice.amount * item.quantity).toLocaleString()}
                </p>
              </div>
            ))}
          </div>

          {/* Cost Breakdown */}
          <div
            style={{
              padding: "16px",
              backgroundColor: "#f9f9f9",
              borderRadius: "8px",
              marginBottom: "20px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "12px",
              }}
            >
              <span>Subtotal:</span>
              <span>₦{totalPrice.toLocaleString()}</span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "12px",
              }}
            >
              <span>Shipping:</span>
              <span>₦{shippingCost.toLocaleString()}</span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: "16px",
                fontWeight: "600",
                paddingTop: "12px",
                borderTop: "1px solid #d0d0d0",
              }}
            >
              <span>Total:</span>
              <span>₦{(totalPrice + shippingCost).toLocaleString()}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <IonButton expand="block" onClick={handlePlaceOrder}>
            Place Order
          </IonButton>
          <IonButton expand="block" fill="outline" onClick={handleContinueShopping}>
            Continue Shopping
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default CartSummary;

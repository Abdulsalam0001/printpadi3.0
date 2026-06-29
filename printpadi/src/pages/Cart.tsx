import {
  IonPage,
  IonContent,
  IonButton,
} from "@ionic/react";
import { useHistory } from "react-router-dom";
import { useMemo } from "react";
import { useCartStore } from "@/store/cartStore";

const Cart: React.FC = () => {
  const history = useHistory();
  const cartItems = useCartStore((s) => s.cart.items);

  const totalPrice = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + item.unitPrice.amount * item.quantity, 0);
  }, [cartItems]);

  const handleCheckout = () => {
    if (cartItems.length > 0) {
      history.push("/cart/summary");
    }
  };

  const handleContinueShopping = () => {
    history.push("/explore");
  };

  return (
    <IonPage>
      <IonContent fullscreen>
        <div style={{ padding: "16px" }}>
          <h1 style={{ fontSize: "24px", fontWeight: "600", marginBottom: "20px" }}>
            My Cart
          </h1>

          {cartItems.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "40px 20px",
                display: "flex",
                flexDirection: "column",
                gap: "20px",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  width: "100px",
                  height: "100px",
                  borderRadius: "50%",
                  backgroundColor: "#f0f0f0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "40px",
                }}
              >
                🛒
              </div>
              <p style={{ color: "#999", fontSize: "16px" }}>
                Your cart is empty
              </p>
              <p style={{ color: "#666", fontSize: "14px" }}>
                Start shopping to add items to your cart
              </p>
              <IonButton
                onClick={handleContinueShopping}
                style={{
                  marginTop: "20px",
                }}
              >
                Continue Shopping
              </IonButton>
            </div>
          ) : (
            <div style={{ paddingBottom: "100px" }}>
              {/* Cart Items List */}
              <div>
                {cartItems.map((item, index) => (
                  <div
                    key={index}
                    style={{
                      display: "flex",
                      gap: "12px",
                      padding: "12px",
                      borderBottom: "1px solid #e0e0e0",
                      marginBottom: "12px",
                    }}
                  >
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.name}
                        style={{
                          width: "80px",
                          height: "80px",
                          borderRadius: "8px",
                          objectFit: "cover",
                        }}
                      />
                    )}
                    <div style={{ flex: 1 }}>
                      <h3 style={{ fontSize: "14px", fontWeight: "600", margin: 0 }}>
                        {item.name}
                      </h3>
                      <p style={{ fontSize: "12px", color: "#666", margin: "4px 0" }}>
                        Quantity: {item.quantity}
                      </p>
                      <p style={{ fontSize: "14px", fontWeight: "600", margin: "4px 0" }}>
                        ₦{(item.unitPrice.amount * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Subtotal */}
              <div
                style={{
                  padding: "16px",
                  backgroundColor: "#f9f9f9",
                  borderRadius: "8px",
                  marginTop: "20px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "8px",
                  }}
                >
                  <span>Subtotal:</span>
                  <span>₦{totalPrice.toLocaleString()}</span>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "8px",
                    fontSize: "12px",
                    color: "#666",
                  }}
                >
                  <span>Shipping:</span>
                  <span>Calculated at checkout</span>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: "16px",
                    fontWeight: "600",
                    paddingTop: "12px",
                    borderTop: "1px solid #e0e0e0",
                  }}
                >
                  <span>Total:</span>
                  <span>₦{totalPrice.toLocaleString()}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <IonButton
                expand="block"
                onClick={handleCheckout}
                style={{
                  marginTop: "20px",
                }}
              >
                Proceed to Checkout
              </IonButton>
            </div>
          )}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Cart;


import {
  IonPage,
  IonContent,
  IonButton,
} from "@ionic/react";
import { useHistory } from "react-router-dom";

const Design: React.FC = () => {
  const history = useHistory();

  return (
    <IonPage>
      <IonContent fullscreen>
        <div style={{ padding: "16px" }}>
          <h1 style={{ fontSize: "24px", fontWeight: "600", marginBottom: "20px" }}>
            Design Services
          </h1>

          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {/* Curate Event */}
            <div
              style={{
                padding: "16px",
                border: "1px solid #e0e0e0",
                borderRadius: "8px",
                cursor: "pointer",
              }}
              onClick={() => history.push("/service/curate-event")}
            >
              <h3 style={{ fontSize: "16px", fontWeight: "600", margin: "0 0 8px 0" }}>
                Curate Event
              </h3>
              <p style={{ fontSize: "14px", color: "#666", margin: 0 }}>
                Create and manage custom events with branded items
              </p>
            </div>

            {/* Request Quote */}
            <div
              style={{
                padding: "16px",
                border: "1px solid #e0e0e0",
                borderRadius: "8px",
                cursor: "pointer",
              }}
              onClick={() => history.push("/service/request-quote")}
            >
              <h3 style={{ fontSize: "16px", fontWeight: "600", margin: "0 0 8px 0" }}>
                Request Quote
              </h3>
              <p style={{ fontSize: "14px", color: "#666", margin: 0 }}>
                Get a custom quote for your bulk printing needs
              </p>
            </div>

            {/* Source from China */}
            <div
              style={{
                padding: "16px",
                border: "1px solid #e0e0e0",
                borderRadius: "8px",
                cursor: "pointer",
              }}
              onClick={() => history.push("/service/source-china")}
            >
              <h3 style={{ fontSize: "16px", fontWeight: "600", margin: "0 0 8px 0" }}>
                Source from China
              </h3>
              <p style={{ fontSize: "14px", color: "#666", margin: 0 }}>
                Browse products sourced directly from China
              </p>
            </div>

            {/* Hire Designer */}
            <div
              style={{
                padding: "16px",
                border: "1px solid #e0e0e0",
                borderRadius: "8px",
                cursor: "pointer",
              }}
              onClick={() => history.push("/service/hire-designer")}
            >
              <h3 style={{ fontSize: "16px", fontWeight: "600", margin: "0 0 8px 0" }}>
                Hire Designer
              </h3>
              <p style={{ fontSize: "14px", color: "#666", margin: 0 }}>
                Connect with professional designers for custom work
              </p>
            </div>

            {/* Shop Gifts AI */}
            <div
              style={{
                padding: "16px",
                border: "1px solid #e0e0e0",
                borderRadius: "8px",
                cursor: "pointer",
              }}
              onClick={() => history.push("/service/shop-gifts")}
            >
              <h3 style={{ fontSize: "16px", fontWeight: "600", margin: "0 0 8px 0" }}>
                Shop Gifts with AI
              </h3>
              <p style={{ fontSize: "14px", color: "#666", margin: 0 }}>
                Discover personalized gift recommendations
              </p>
            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Design;

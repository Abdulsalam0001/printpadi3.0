import { IonPage, IonContent, IonButton } from "@ionic/react";
import { useHistory } from "react-router-dom";

const SourceChina: React.FC = () => {
  const history = useHistory();
  return (
    <IonPage>
      <IonContent fullscreen>
        <div style={{ padding: "16px" }}>
          <button
            onClick={() => history.goBack()}
            style={{
              background: "none",
              border: "none",
              fontSize: "24px",
              cursor: "pointer",
              marginBottom: "16px",
            }}
          >
            ←
          </button>
          <h1 style={{ fontSize: "24px", fontWeight: "600", marginBottom: "20px" }}>
            Source from China
          </h1>
          <p style={{ color: "#666", marginBottom: "20px" }}>
            Access wholesale products sourced from China
          </p>
          <IonButton expand="block">
            Browse Products
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default SourceChina;

import { IonPage, IonContent, IonButton } from "@ionic/react";
import { useHistory } from "react-router-dom";

const HireDesigner: React.FC = () => {
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
            Hire Designer
          </h1>
          <p style={{ color: "#666", marginBottom: "20px" }}>
            Connect with professional designers for custom work
          </p>
          <IonButton expand="block">
            Find Designers
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default HireDesigner;

import { IonPage, IonContent, IonButton } from "@ionic/react";
import { useHistory } from "react-router-dom";

const CurateEvent: React.FC = () => {
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
            Curate Event
          </h1>
          <p style={{ color: "#666", marginBottom: "20px" }}>
            Create and customize branded items for your events
          </p>
          <IonButton expand="block">
            Start Creating
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default CurateEvent;

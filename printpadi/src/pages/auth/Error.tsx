import { IonPage, IonContent, IonButton } from "@ionic/react";
import { useHistory } from "react-router-dom";

const Error: React.FC = () => {
  const history = useHistory();
  
  return (
    <IonPage>
      <IonContent fullscreen>
        <div style={{
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          textAlign: "center",
        }}>
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>⚠️</div>
          <h1 style={{ fontSize: "24px", fontWeight: "600", marginBottom: "8px" }}>
            Authentication Error
          </h1>
          <p style={{ color: "#666", marginBottom: "32px" }}>
            There was an issue with your authentication. Please try again.
          </p>
          <IonButton onClick={() => history.push("/auth/login")}>
            Back to Login
          </IonButton>
          <IonButton fill="outline" onClick={() => history.push("/home")}>
            Go Home
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Error;

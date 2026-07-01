import {
  IonPage,
  IonContent,
  IonButton,
} from "@ionic/react";
import { useHistory } from "react-router-dom";
import { useState, useEffect } from "react";

const Profile: React.FC = () => {
  const history = useHistory();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Try to fetch user profile
    const loadProfile = async () => {
      try {
        const baseUrl = import.meta.env.VITE_API_BASE_URL || '';
        const response = await fetch(`${baseUrl}/api/auth/me`, {
          credentials: 'include',
        });

        if (response.ok) {
          const data = await response.json();
          setUser(data);
        }
      } catch (err) {
        console.error('Failed to load profile:', err);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleLogout = () => {
    // Clear auth and redirect to login
    history.push("/auth/login");
  };

  return (
    <IonPage>
      <IonContent fullscreen>
        <div style={{ padding: "16px" }}>
          <h1 style={{ fontSize: "24px", fontWeight: "600", marginBottom: "20px" }}>
            Profile
          </h1>

          {!user ? (
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
              <p style={{ color: "#666", fontSize: "16px" }}>
                Please login to view your profile
              </p>
              <IonButton onClick={() => history.push("/auth/login")}>
                Login
              </IonButton>
            </div>
          ) : (
            <div>
              <div
                style={{
                  padding: "16px",
                  backgroundColor: "#f9f9f9",
                  borderRadius: "8px",
                  marginBottom: "20px",
                }}
              >
                <div style={{ marginBottom: "12px" }}>
                  <label style={{ fontSize: "12px", color: "#666" }}>Name</label>
                  <p style={{ fontSize: "16px", fontWeight: "600", margin: "4px 0" }}>
                    {user.name || "User"}
                  </p>
                </div>
                <div style={{ marginBottom: "12px" }}>
                  <label style={{ fontSize: "12px", color: "#666" }}>Email</label>
                  <p style={{ fontSize: "16px", fontWeight: "600", margin: "4px 0" }}>
                    {user.email || "Not provided"}
                  </p>
                </div>
              </div>

              <IonButton expand="block" onClick={handleLogout} color="danger">
                Logout
              </IonButton>
            </div>
          )}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Profile;

import { IonPage, IonContent, IonButton } from "@ionic/react";
import { useHistory } from "react-router-dom";
import { useState } from "react";

const Login: React.FC = () => {
  const history = useHistory();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      setLoading(true);
      setError("");

      const baseUrl = import.meta.env.VITE_API_BASE_URL || '';
      const response = await fetch(`${baseUrl}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      // Redirect to home on success
      history.push("/home");
    } catch (err) {
      setError('Failed to login. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <IonPage>
      <IonContent fullscreen>
        <div style={{
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          minHeight: "100vh",
        }}>
          <h1 style={{ fontSize: "28px", fontWeight: "600", marginBottom: "8px", textAlign: "center" }}>
            Welcome to PrintPadi
          </h1>
          <p style={{ textAlign: "center", color: "#666", marginBottom: "32px" }}>
            Sign in to your account
          </p>

          {error && (
            <div style={{
              backgroundColor: "#fee",
              color: "#c00",
              padding: "12px",
              borderRadius: "4px",
              marginBottom: "16px",
            }}>
              {error}
            </div>
          )}

          <div style={{ marginBottom: "16px" }}>
            <label style={{ fontSize: "14px", fontWeight: "600", display: "block", marginBottom: "8px" }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              style={{
                width: "100%",
                padding: "12px",
                border: "1px solid #ddd",
                borderRadius: "4px",
                fontSize: "14px",
                boxSizing: "border-box",
              }}
            />
          </div>

          <div style={{ marginBottom: "24px" }}>
            <label style={{ fontSize: "14px", fontWeight: "600", display: "block", marginBottom: "8px" }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              style={{
                width: "100%",
                padding: "12px",
                border: "1px solid #ddd",
                borderRadius: "4px",
                fontSize: "14px",
                boxSizing: "border-box",
              }}
            />
          </div>

          <IonButton
            expand="block"
            onClick={handleLogin}
            disabled={loading || !email || !password}
          >
            {loading ? "Signing in..." : "Sign In"}
          </IonButton>

          <p style={{ textAlign: "center", marginTop: "16px", color: "#666" }}>
            Don't have an account?{" "}
            <button
              onClick={() => history.push("/auth/signup")}
              style={{
                background: "none",
                border: "none",
                color: "#333",
                cursor: "pointer",
                textDecoration: "underline",
              }}
            >
              Sign up
            </button>
          </p>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Login;

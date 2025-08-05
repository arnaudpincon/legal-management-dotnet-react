import React, { useState } from "react";
import { authService, LoginRequest } from "../services/authService";

interface LoginProps {
  onLoginSuccess: () => void;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [credentials, setCredentials] = useState<LoginRequest>({
    username: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await authService.login(credentials);
      onLoginSuccess();
    } catch (error: any) {
      setError(error.response?.data || "Login error");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#f5f5f5",
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          padding: "40px",
          borderRadius: "10px",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          width: "400px",
        }}
      >
        <h2
          style={{ textAlign: "center", marginBottom: "30px", color: "#333" }}
        >
          🏛️ Legal App - Connexion
        </h2>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "20px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                fontWeight: "bold",
              }}
            >
              Nom d'utilisateur :
            </label>
            <input
              type="text"
              name="username"
              value={credentials.username}
              onChange={handleChange}
              required
              style={{
                width: "100%",
                padding: "12px",
                border: "1px solid #ddd",
                borderRadius: "5px",
                fontSize: "16px",
              }}
              placeholder="admin or lawyer"
            />
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                fontWeight: "bold",
              }}
            >
              Mot de passe :
            </label>
            <input
              type="password"
              name="password"
              value={credentials.password}
              onChange={handleChange}
              required
              style={{
                width: "100%",
                padding: "12px",
                border: "1px solid #ddd",
                borderRadius: "5px",
                fontSize: "16px",
              }}
              placeholder="password123 or lawyer123"
            />
          </div>

          {error && (
            <div
              style={{
                color: "red",
                marginBottom: "20px",
                padding: "10px",
                backgroundColor: "#ffe6e6",
                borderRadius: "5px",
              }}
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "12px",
              backgroundColor: loading ? "#ccc" : "#007bff",
              color: "white",
              border: "none",
              borderRadius: "5px",
              fontSize: "16px",
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Connexion..." : "Se connecter"}
          </button>
        </form>

        <div style={{ marginTop: "20px", fontSize: "14px", color: "#666" }}>
          <p>
            <strong>Test accounts :</strong>
          </p>
          <p>• admin / password123</p>
          <p>• lawyer / lawyer123</p>
        </div>
      </div>
    </div>
  );
};

export default Login;

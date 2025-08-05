// src/App.tsx
import React, { useState, useEffect } from "react";
import { ApolloProvider } from "@apollo/client";
import { apolloClient } from "./services/apolloClient";
import ClientList from "./components/ClientList";
import Login from "./components/Login";
import "./App.css";

// Types pour l'auth (on garde simple pour l'instant)
interface User {
  username: string;
  role: string;
  token: string;
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    // check token in localStorage
    const token = localStorage.getItem("authToken");
    const userData = localStorage.getItem("userData");

    if (token && userData) {
      setCurrentUser(JSON.parse(userData));
      setIsAuthenticated(true);
    }
  }, []);

  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    setIsAuthenticated(true);
    localStorage.setItem("authToken", user.token);
    localStorage.setItem("userData", JSON.stringify(user));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");
  };

  if (!isAuthenticated) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <ApolloProvider client={apolloClient}>
      <div style={{ padding: "20px", fontFamily: "Arial" }}>
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "30px",
            padding: "10px 0",
            borderBottom: "2px solid #007bff",
          }}
        >
          <h1>🏛️ Legal App - GraphQL Version</h1>
          <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
            <span>
              Connecté: <strong>{currentUser?.username}</strong> (
              {currentUser?.role})
            </span>
            <button
              onClick={handleLogout}
              style={{
                padding: "8px 16px",
                backgroundColor: "#dc3545",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Déconnexion
            </button>
          </div>
        </div>
        <ClientList />
      </div>
    </ApolloProvider>
  );
}

export default App;

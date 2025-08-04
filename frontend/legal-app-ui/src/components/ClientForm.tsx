import React, { useState, useEffect } from "react";
import {
  CreateClientRequest,
  UpdateClientRequest,
  Client,
} from "../services/apiService";

interface ClientFormProps {
  client?: Client; // if editing, pass the client object
  onSubmit: (data: CreateClientRequest | UpdateClientRequest) => Promise<void>;
  onCancel: () => void;
  loading: boolean;
}

const ClientForm: React.FC<ClientFormProps> = ({
  client,
  onSubmit,
  onCancel,
  loading,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    companyName: "",
  });

  const [errors, setErrors] = useState<string[]>([]);

  // Prefill form with existing client data if editing
  useEffect(() => {
    if (client) {
      setFormData({
        name: client.name,
        email: client.email,
        companyName: client.companyName,
      });
    }
  }, [client]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setErrors([]); // Clear errors on change
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors([]);

    // Validate form data from client side
    const newErrors: string[] = [];
    if (!formData.name.trim()) newErrors.push("Le nom est obligatoire");
    if (!formData.email.trim()) newErrors.push("L'email est obligatoire");
    if (!formData.email.includes("@")) newErrors.push("Email invalide");

    if (newErrors.length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await onSubmit(formData);
    } catch (error: any) {
      const errorMsg = error.response?.data || "Erreur lors de la sauvegarde";
      setErrors([errorMsg]);
    }
  };

  const isEditing = !!client;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          padding: "30px",
          borderRadius: "10px",
          width: "500px",
          maxHeight: "80vh",
          overflow: "auto",
        }}
      >
        <h2 style={{ marginBottom: "20px" }}>
          {isEditing ? "✏️ Modifier le client" : "➕ Nouveau client"}
        </h2>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "15px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "5px",
                fontWeight: "bold",
              }}
            >
              Nom * :
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "10px",
                border: "1px solid #ddd",
                borderRadius: "5px",
                fontSize: "16px",
              }}
              placeholder="Jean Dupont"
            />
          </div>

          <div style={{ marginBottom: "15px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "5px",
                fontWeight: "bold",
              }}
            >
              Email * :
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "10px",
                border: "1px solid #ddd",
                borderRadius: "5px",
                fontSize: "16px",
              }}
              placeholder="jean@example.com"
            />
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "5px",
                fontWeight: "bold",
              }}
            >
              Société :
            </label>
            <input
              type="text"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "10px",
                border: "1px solid #ddd",
                borderRadius: "5px",
                fontSize: "16px",
              }}
              placeholder="Dupont SARL"
            />
          </div>

          {errors.length > 0 && (
            <div
              style={{
                color: "red",
                marginBottom: "20px",
                padding: "10px",
                backgroundColor: "#ffe6e6",
                borderRadius: "5px",
              }}
            >
              {errors.map((error, index) => (
                <div key={index}>• {error}</div>
              ))}
            </div>
          )}

          <div
            style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}
          >
            <button
              type="button"
              onClick={onCancel}
              disabled={loading}
              style={{
                padding: "10px 20px",
                backgroundColor: "#6c757d",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: loading ? "not-allowed" : "pointer",
              }}
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: "10px 20px",
                backgroundColor: loading
                  ? "#ccc"
                  : isEditing
                  ? "#ffc107"
                  : "#28a745",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: loading ? "not-allowed" : "pointer",
              }}
            >
              {loading ? "Enregistrement..." : isEditing ? "Modifier" : "Créer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ClientForm;

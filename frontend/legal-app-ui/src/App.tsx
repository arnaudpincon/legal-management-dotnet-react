import React, { useState, useEffect } from "react";
import {
  clientService,
  Client,
  Case,
  CreateClientRequest,
  UpdateClientRequest,
} from "./services/apiService";
import { authService } from "./services/authService";
import Login from "./components/Login";
import ClientForm from "./components/ClientForm";
import "./App.css";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [clients, setClients] = useState<Client[]>([]);
  const [cases, setCases] = useState<Case[]>([]);
  const [selectedClient, setSelectedClient] = useState<string>("");
  const [loading, setLoading] = useState(false);

  // États pour le CRUD
  const [showForm, setShowForm] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | undefined>();
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      loadClients();
    }
  }, [isAuthenticated]);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    authService.logout();
    setIsAuthenticated(false);
    setClients([]);
    setCases([]);
    setSelectedClient("");
    setShowForm(false);
    setEditingClient(undefined);
  };

  const loadClients = async () => {
    try {
      setLoading(true);
      const response = await clientService.getAll();
      setClients(response.data);
    } catch (error: any) {
      console.error("Erreur API:", error);
      if (error.response?.status === 401) {
        handleLogout();
      }
    } finally {
      setLoading(false);
    }
  };

  const loadCases = async (clientId: number, clientName: string) => {
    try {
      const response = await clientService.getCases(clientId);
      setCases(response.data);
      setSelectedClient(clientName);
    } catch (error: any) {
      console.error("Erreur API:", error);
      if (error.response?.status === 401) {
        handleLogout();
      }
    }
  };

  // CRUD Operations
  const handleCreateClient = async (data: CreateClientRequest) => {
    setFormLoading(true);
    try {
      await clientService.create(data);
      await loadClients(); // Refresh la liste
      setShowForm(false);
    } finally {
      setFormLoading(false);
    }
  };

  const handleUpdateClient = async (data: UpdateClientRequest) => {
    if (!editingClient) return;

    setFormLoading(true);
    try {
      await clientService.update(editingClient.id, data);
      await loadClients(); // Refresh la liste
      setShowForm(false);
      setEditingClient(undefined);
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteClient = async (client: Client) => {
    if (
      !window.confirm(`Êtes-vous sûr de vouloir supprimer ${client.name} ?`)
    ) {
      return;
    }

    try {
      await clientService.delete(client.id);
      await loadClients(); // Refresh la liste

      // If the deleted client was selected, clear the selection
      if (selectedClient === client.name) {
        setSelectedClient("");
        setCases([]);
      }
    } catch (error: any) {
      console.error("Erreur suppression:", error);
      alert("Erreur lors de la suppression");
    }
  };

  const openCreateForm = () => {
    setEditingClient(undefined);
    setShowForm(true);
  };

  const openEditForm = (client: Client) => {
    setEditingClient(client);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingClient(undefined);
  };

  if (!isAuthenticated) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  const currentUser = authService.getCurrentUser();

  return (
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
        <h1>🏛️ Legal App - CRUD Complete</h1>
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

      {/* Section Clients */}
      <div style={{ marginBottom: "30px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <h2>👥 Clients ({clients.length})</h2>
          <button
            onClick={openCreateForm}
            style={{
              padding: "10px 20px",
              backgroundColor: "#28a745",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              fontSize: "16px",
            }}
          >
            ➕ Nouveau Client
          </button>
        </div>

        {loading ? (
          <p>Chargement...</p>
        ) : clients.length === 0 ? (
          <p>Aucun client trouvé. Créez-en un !</p>
        ) : (
          <div>
            {clients.map((client) => (
              <div
                key={client.id}
                style={{
                  border: "2px solid #007bff",
                  borderRadius: "8px",
                  padding: "15px",
                  margin: "10px 0",
                  backgroundColor: "#f8f9fa",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div
                  style={{ cursor: "pointer", flex: 1 }}
                  onClick={() => loadCases(client.id, client.name)}
                >
                  <h3 style={{ margin: "0 0 5px 0", color: "#007bff" }}>
                    {client.name}
                  </h3>
                  <p style={{ margin: "5px 0", fontWeight: "bold" }}>
                    {client.companyName}
                  </p>
                  <small style={{ color: "#666" }}>{client.email}</small>
                </div>

                <div style={{ display: "flex", gap: "10px" }}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openEditForm(client);
                    }}
                    style={{
                      padding: "5px 10px",
                      backgroundColor: "#ffc107",
                      color: "white",
                      border: "none",
                      borderRadius: "3px",
                      cursor: "pointer",
                    }}
                  >
                    ✏️ Modifier
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteClient(client);
                    }}
                    style={{
                      padding: "5px 10px",
                      backgroundColor: "#dc3545",
                      color: "white",
                      border: "none",
                      borderRadius: "3px",
                      cursor: "pointer",
                    }}
                  >
                    🗑️ Supprimer
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Section Dossiers */}
      {selectedClient && (
        <div>
          <h2>📁 Dossiers de {selectedClient}</h2>
          {cases.length === 0 ? (
            <p>Aucun dossier trouvé</p>
          ) : (
            <div>
              {cases.map((case_) => (
                <div
                  key={case_.id}
                  style={{
                    border: "1px solid #28a745",
                    borderRadius: "5px",
                    padding: "12px",
                    margin: "8px 0",
                    backgroundColor: "#f1f8f4",
                  }}
                >
                  <h4 style={{ margin: "0 0 8px 0", color: "#28a745" }}>
                    {case_.title}
                  </h4>
                  <p style={{ margin: "8px 0" }}>{case_.description}</p>
                  <span
                    style={{
                      padding: "4px 8px",
                      backgroundColor: "#007bff",
                      color: "white",
                      borderRadius: "4px",
                      fontSize: "12px",
                    }}
                  >
                    {case_.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Modal Formulaire */}
      {showForm && (
        <ClientForm
          client={editingClient}
          onSubmit={editingClient ? handleUpdateClient : handleCreateClient}
          onCancel={closeForm}
          loading={formLoading}
        />
      )}
    </div>
  );
}

export default App;

// src/components/ClientList.tsx
import React, { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import {
  GET_CLIENTS,
  GET_CLIENT_CASES,
  CREATE_CLIENT,
  UPDATE_CLIENT,
  DELETE_CLIENT,
  Client,
  Case,
  CreateClientInput,
  UpdateClientInput,
} from "../graphql/queries";
import ClientForm from "./ClientForm";

const ClientList: React.FC = () => {
  // Apollo hooks
  const { data, loading, error, refetch } = useQuery(GET_CLIENTS);
  const [createClientMutation] = useMutation(CREATE_CLIENT);
  const [updateClientMutation] = useMutation(UPDATE_CLIENT);
  const [deleteClientMutation] = useMutation(DELETE_CLIENT);

  // États locaux
  const [cases, setCases] = useState<Case[]>([]);
  const [selectedClient, setSelectedClient] = useState<string>("");
  const [showForm, setShowForm] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | undefined>();
  const [formLoading, setFormLoading] = useState(false);
  const [casesLoading, setCasesLoading] = useState(false);

  // Charger les cases d'un client (on utilise une query directe pour simplifier)
  const loadCases = async (clientId: number, clientName: string) => {
    setCasesLoading(true);
    try {
      const response = await fetch("http://localhost:5264/graphql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify({
          query: `
            query GetClientCases($clientId: Int!) {
              clientCases(clientId: $clientId) {
                id
                title
                description
                status
                createdAt
              }
            }
          `,
          variables: { clientId },
        }),
      });

      const result = await response.json();
      setCases(result.data?.clientCases || []);
      setSelectedClient(clientName);
    } catch (error) {
      console.error("Erreur lors du chargement des cases:", error);
    } finally {
      setCasesLoading(false);
    }
  };

  // CRUD Operations avec GraphQL
  const handleCreateClient = async (data: CreateClientInput) => {
    setFormLoading(true);
    try {
      await createClientMutation({
        variables: { input: data },
        refetchQueries: [{ query: GET_CLIENTS }],
      });
      setShowForm(false);
    } catch (error) {
      console.error("Erreur création:", error);
      alert("Erreur lors de la création");
    } finally {
      setFormLoading(false);
    }
  };

  const handleUpdateClient = async (data: CreateClientInput) => {
    if (!editingClient) return;

    setFormLoading(true);
    try {
      await updateClientMutation({
        variables: {
          input: {
            id: editingClient.id,
            name: data.name,
            email: data.email,
            companyName: data.companyName,
          },
        },
        refetchQueries: [{ query: GET_CLIENTS }],
      });
      setShowForm(false);
      setEditingClient(undefined);
    } catch (error) {
      console.error("Erreur modification:", error);
      alert("Erreur lors de la modification");
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
      await deleteClientMutation({
        variables: { id: client.id },
        refetchQueries: [{ query: GET_CLIENTS }],
      });

      // Si le client supprimé était sélectionné, on vide la sélection
      if (selectedClient === client.name) {
        setSelectedClient("");
        setCases([]);
      }
    } catch (error) {
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

  // Gestion du loading et des erreurs
  if (loading) return <p>Chargement des clients...</p>;
  if (error) return <p>Erreur: {error.message}</p>;

  const clients: Client[] = data?.clients || [];

  return (
    <div>
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
          <h2>👥 Clients GraphQL ({clients.length})</h2>
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

        {clients.length === 0 ? (
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
          {casesLoading ? (
            <p>Chargement des dossiers...</p>
          ) : cases.length === 0 ? (
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
};

export default ClientList;

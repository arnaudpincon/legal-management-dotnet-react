import axios from "axios";
import { authService } from "./authService";

const API_BASE = "http://localhost:5275/api";

const apiClient = axios.create({
  baseURL: API_BASE,
});

apiClient.interceptors.request.use((config) => {
  const token = authService.getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface Client {
  id: number;
  name: string;
  email: string;
  companyName: string;
  createdAt: string;
  isActive: boolean;
}

export interface Case {
  id: number;
  title: string;
  description: string;
  clientId: number;
  status: string;
}

// DTOs for requests
export interface CreateClientRequest {
  name: string;
  email: string;
  companyName: string;
}

export interface UpdateClientRequest {
  name: string;
  email: string;
  companyName: string;
}

export const clientService = {
  getAll: () => apiClient.get<Client[]>("/clients"),
  getById: (id: number) => apiClient.get<Client>(`/clients/${id}`),
  getCases: (id: number) => apiClient.get<Case[]>(`/clients/${id}/cases`),

  create: (client: CreateClientRequest) =>
    apiClient.post<Client>("/clients", client),

  update: (id: number, client: UpdateClientRequest) =>
    apiClient.put<Client>(`/clients/${id}`, client),

  delete: (id: number) => apiClient.delete(`/clients/${id}`),
};

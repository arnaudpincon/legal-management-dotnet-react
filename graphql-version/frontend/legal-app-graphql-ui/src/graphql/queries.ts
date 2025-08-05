import { gql } from "@apollo/client";

export const GET_CLIENTS = gql`
  query GetClients {
    clients {
      id
      name
      email
      companyName
      createdAt
      isActive
    }
  }
`;

export const GET_CLIENT = gql`
  query GetClient($id: Int!) {
    client(id: $id) {
      id
      name
      email
      companyName
      createdAt
      isActive
    }
  }
`;

export const GET_CLIENT_CASES = gql`
  query GetClientCases($clientId: Int!) {
    clientCases(clientId: $clientId) {
      id
      title
      description
      status
      createdAt
      client {
        id
        name
      }
    }
  }
`;

// MUTATIONS
export const CREATE_CLIENT = gql`
  mutation CreateClient($input: CreateClientInput!) {
    createClient(input: $input) {
      id
      name
      email
      companyName
      createdAt
      isActive
    }
  }
`;

export const UPDATE_CLIENT = gql`
  mutation UpdateClient($input: UpdateClientInput!) {
    updateClient(input: $input) {
      id
      name
      email
      companyName
      createdAt
      isActive
    }
  }
`;

export const DELETE_CLIENT = gql`
  mutation DeleteClient($id: Int!) {
    deleteClient(id: $id)
  }
`;

// TYPES TypeScript (on les créera automatiquement plus tard)
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
  status: string;
  createdAt: string;
  client?: Client;
}

export interface CreateClientInput {
  name: string;
  email: string;
  companyName: string;
}

export interface UpdateClientInput {
  id: number;
  name: string;
  email: string;
  companyName: string;
}

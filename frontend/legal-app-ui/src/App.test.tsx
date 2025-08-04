import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import App from "./App";

// Mock services
jest.mock("./services/authService", () => ({
  authService: {
    isAuthenticated: jest.fn(() => false),
    getCurrentUser: jest.fn(() => null),
    getAuthToken: jest.fn(() => null),
  },
}));

jest.mock("./services/apiService");

test("renders login form when not authenticated", () => {
  render(<App />);

  // Check if the login form is displayed
  expect(screen.getByText("🏛️ Legal App - Connexion")).toBeInTheDocument();
  expect(screen.getByText("Nom d'utilisateur :")).toBeInTheDocument();
  expect(screen.getByText("Mot de passe :")).toBeInTheDocument();
  expect(screen.getByText("Se connecter")).toBeInTheDocument();
});

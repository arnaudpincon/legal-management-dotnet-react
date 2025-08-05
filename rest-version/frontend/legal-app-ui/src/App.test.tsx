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
  expect(screen.getByText("🏛️ Legal App - Login")).toBeInTheDocument();
  expect(screen.getByText("Username :")).toBeInTheDocument();
  expect(screen.getByText("Login :")).toBeInTheDocument();
  expect(screen.getByText("Logging in...")).toBeInTheDocument();
});

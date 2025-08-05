import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import ClientForm from "../ClientForm";

describe("ClientForm", () => {
  const mockOnSubmit = jest.fn();
  const mockOnCancel = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render create form when no client provided", () => {
    render(
      <ClientForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        loading={false}
      />
    );

    expect(screen.getByText("➕ Nouveau client")).toBeInTheDocument();
    expect(screen.getByText("Créer")).toBeInTheDocument();
  });

  it("should call onCancel when cancel button clicked", () => {
    render(
      <ClientForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        loading={false}
      />
    );

    fireEvent.click(screen.getByText("Annuler"));
    expect(mockOnCancel).toHaveBeenCalledTimes(1);
  });

  it("should disable buttons when loading", () => {
    render(
      <ClientForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        loading={true}
      />
    );

    expect(screen.getByText("Enregistrement...")).toBeDisabled();
    expect(screen.getByText("Annuler")).toBeDisabled();
  });
});

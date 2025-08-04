import { clientService } from "../apiService";

// Mock axios plus simplement
jest.mock("axios", () => ({
  create: jest.fn(() => ({
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
    interceptors: {
      request: { use: jest.fn() },
    },
  })),
}));

// Mock authService
jest.mock("../authService", () => ({
  authService: {
    getAuthToken: jest.fn(() => "fake-token"),
  },
}));

describe("clientService", () => {
  it("should exist", () => {
    expect(clientService).toBeDefined();
    expect(clientService.getAll).toBeDefined();
    expect(clientService.create).toBeDefined();
  });
});

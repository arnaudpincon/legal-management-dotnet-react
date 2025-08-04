import axios from "axios";

const API_BASE = "http://localhost:5275/api";

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  username: string;
  role: string;
}

export interface User {
  username: string;
  role: string;
  token: string;
}

class AuthService {
  private currentUser: User | null = null;

  async login(credentials: LoginRequest): Promise<User> {
    const response = await axios.post<LoginResponse>(
      `${API_BASE}/auth/login`,
      credentials
    );
    const user: User = {
      username: response.data.username,
      role: response.data.role,
      token: response.data.token,
    };

    this.currentUser = user;
    return user;
  }

  logout(): void {
    this.currentUser = null;
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }

  isAuthenticated(): boolean {
    return this.currentUser !== null;
  }

  getAuthToken(): string | null {
    return this.currentUser?.token || null;
  }
}

export const authService = new AuthService();

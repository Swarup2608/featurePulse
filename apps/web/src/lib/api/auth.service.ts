import { apiClient } from "./api-client";
import type { AuthOrganization, AuthUser } from "@/types/auth.types";

interface AuthResponse { user: AuthUser; organization: AuthOrganization; }
interface LoginInput { email: string; password: string; }
interface RegisterInput { name: string; email: string; password: string; organizationName: string; }

export const authService = {
  async register(data: RegisterInput): Promise<AuthResponse> {
    return apiClient.post<AuthResponse>("/auth/register", data);
  },
  async login(data: LoginInput): Promise<AuthResponse> {
    return apiClient.post<AuthResponse>("/auth/login", data);
  },
  async getMe(): Promise<AuthResponse> {
    return apiClient.get<AuthResponse>("/auth/me");
  },
  async logout(): Promise<void> {
    await apiClient.post<void>("/auth/logout");
  },
  async refresh(): Promise<void> {
    await apiClient.post<void>("/auth/refresh");
  },
};
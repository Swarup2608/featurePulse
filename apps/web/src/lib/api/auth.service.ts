import { apiClient } from "./api-client";
import type { AuthResponse, CurrentUserResponse, LoginInput, RegisterInput } from "@/types/auth.types";

export const authService = {
  register(data: RegisterInput) {
    return apiClient.post<AuthResponse>("/auth/register", data);
  },
  login(data: LoginInput) {
    return apiClient.post<AuthResponse>("/auth/login", data);
  },
  getMe() {
    return apiClient.get<CurrentUserResponse>("/auth/me");
  },
  refreshAccessToken() {
    return apiClient.post<Record<string, never>>("/auth/refresh");
  },
  logout() {
    return apiClient.post<Record<string, never>>("/auth/logout");
  },
};
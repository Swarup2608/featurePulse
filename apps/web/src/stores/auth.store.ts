import { create } from "zustand";
import type { Organization, User } from "@/types/auth.types";

interface AuthState {
  user: User | null;
  organization: Organization | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isInitializing: boolean;
  setAuth: (user: User, organization: Organization, accessToken: string) => void;
  updateAccessToken: (accessToken: string) => void;
  clearAuth: () => void;
  setInitializing: (isInitializing: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  organization: null,
  accessToken: null,
  isAuthenticated: false,
  isInitializing: true,
  setAuth: (user, organization, accessToken) => set({ user, organization, accessToken, isAuthenticated: true, isInitializing: false }),
  updateAccessToken: (accessToken) => set({ accessToken, isAuthenticated: true }),
  clearAuth: () => set({ user: null, organization: null, accessToken: null, isAuthenticated: false, isInitializing: false }),
  setInitializing: (isInitializing) => set({ isInitializing }),
}));
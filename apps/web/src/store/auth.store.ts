import { create } from "zustand";
import type { AuthOrganization, AuthState, AuthUser } from "@/types/auth.types";

interface AuthStore extends AuthState {
  setAuth: (user: AuthUser, organization: AuthOrganization) => void;
  setUser: (user: AuthUser) => void;
  setLoading: (isLoading: boolean) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  organization: null,
  isAuthenticated: false,
  isLoading: true,
  setAuth: (user, organization) => set({ user, organization, isAuthenticated: true, isLoading: false }),
  setUser: (user) => set({ user }),
  setLoading: (isLoading) => set({ isLoading }),
  clearAuth: () => set({ user: null, organization: null, isAuthenticated: false, isLoading: false }),
}));
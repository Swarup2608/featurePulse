"use client";

import { useEffect } from "react";
import { authService } from "@/lib/api/auth.service";
import { ApiError } from "@/lib/api/api-error";
import { useAuthStore } from "@/store/auth.store";
import { SessionLoadingScreen } from "./session-loading-screen";

export function SessionInitializer({
  children,
}: {
  children: React.ReactNode;
}) {
  const setAuth = useAuthStore((state) => state.setAuth);
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const isLoading = useAuthStore((state) => state.isLoading);

  useEffect(() => {
    const initializeSession = async () => {
      try {
        // First attempt: existing access token
        const authData = await authService.getMe();
        setAuth(authData.user, authData.organization);
      } catch (error) {
        // Only attempt token refresh for authentication failures
        if (error instanceof ApiError && error.status === 401) {
          try {
            // Refresh token is sent automatically as an HttpOnly cookie
            await authService.refresh();
            // New access token cookie should now exist
            const authData = await authService.getMe();
            setAuth(authData.user, authData.organization);
          } catch {
            // Refresh token is also invalid or expired
            clearAuth();
          }
          return;
        }
        // Server/network errors should not trigger token refresh
        clearAuth();
      }
    };
    initializeSession();
  }, [setAuth, clearAuth]);

  if (isLoading) return <SessionLoadingScreen />;
  return <>{children}</>;
}

"use client";

import { useEffect } from "react";
import { authService } from "@/lib/api/auth.service";
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
        // First attempt: Check whether the access token is valid.
        const authData = await authService.getMe();
        setAuth(authData.user, authData.organization);
      } catch {
        try {
          // Access token may have expired. Attempt to refresh it using the HttpOnly refresh token cookie.
          await authService.refresh();
          // The backend creates a new access token cookie.
          const authData = await authService.getMe();
          setAuth(authData.user, authData.organization);
        } catch {
          // No valid session exists.
          clearAuth();
        }
      }
    };
    initializeSession();
  }, [setAuth, clearAuth]);

  if (isLoading) return <SessionLoadingScreen />;
  return <>{children}</>;
}

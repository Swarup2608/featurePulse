import { API_BASE_URL } from "./config";
import { ApiError } from "./api-error";
import type { ApiErrorResponse, ApiRequestOptions, ApiSuccessResponse } from "./api.types";

const SAFE_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);

// Double-submit CSRF token, delivered by GET /csrf and held in memory only.
let csrfToken: string | null = null;
let csrfInflight: Promise<string> | null = null;

async function fetchCsrfToken(): Promise<string> {
  const response = await fetch(`${API_BASE_URL}/csrf`, { credentials: "include" });
  const data = await response.json().catch(() => null);
  const token = (data as ApiSuccessResponse<{ csrfToken: string }> | null)?.data?.csrfToken;
  if (!token) throw new ApiError("Failed to obtain CSRF token", response.status);
  csrfToken = token;
  return token;
}

function ensureCsrfToken(): Promise<string> {
  if (csrfToken) return Promise.resolve(csrfToken);
  if (!csrfInflight) {
    csrfInflight = fetchCsrfToken().finally(() => {
      csrfInflight = null;
    });
  }
  return csrfInflight;
}

export const apiClient = {
  async request<T>(endpoint: string, options: ApiRequestOptions = {}): Promise<T> {
    const { body, headers, ...requestOptions } = options;
    const method = (requestOptions.method ?? "GET").toUpperCase();
    const needsCsrf = !SAFE_METHODS.has(method);

    const send = async (): Promise<Response> => {
      const requestHeaders: Record<string, string> = {
        "Content-Type": "application/json",
        ...(headers as Record<string, string> | undefined),
      };
      if (needsCsrf) requestHeaders["X-CSRF-Token"] = await ensureCsrfToken();

      return fetch(`${API_BASE_URL}${endpoint}`, {
        ...requestOptions,
        credentials: "include",
        headers: requestHeaders,
        ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
      });
    };

    let response = await send();

    // A 403 on a state-changing call usually means a stale/absent CSRF token —
    // refresh it once and retry.
    if (response.status === 403 && needsCsrf) {
      csrfToken = null;
      response = await send();
    }

    const responseData = response.status === 204 ? null : await response.json().catch(() => null);
    if (!response.ok) {
      const errorData = responseData as ApiErrorResponse | null;
      throw new ApiError(errorData?.message || "Something went wrong", response.status, errorData?.errors);
    }
    // A 204 has no body to unwrap — nothing was parsed above, so return null
    // directly rather than reading `.data` off of it.
    if (responseData === null) return null as T;
    return (responseData as ApiSuccessResponse<T>).data;
  },
  get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: "GET" });
  },
  post<T>(endpoint: string, body?: unknown): Promise<T> {
    return this.request<T>(endpoint, { method: "POST", body });
  },
  patch<T>(endpoint: string, body?: unknown): Promise<T> {
    return this.request<T>(endpoint, { method: "PATCH", body });
  },
  delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: "DELETE" });
  },
};

import { API_BASE_URL } from "./config";
import { ApiError } from "./api-error";
import type { ApiErrorResponse, ApiRequestOptions, ApiSuccessResponse } from "./api.types";

export const apiClient = {
  async request<T>(endpoint: string, options: ApiRequestOptions = {}): Promise<T> {
    const { body, headers, ...requestOptions } = options;
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...requestOptions,
      credentials: "include",
      headers: { "Content-Type": "application/json", ...headers },
      ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
    });
    const responseData = response.status === 204 ? null : await response.json().catch(() => null);
    if (!response.ok) {
      const errorData = responseData as ApiErrorResponse | null;
      throw new ApiError(errorData?.message || "Something went wrong", response.status, errorData?.errors);
    }
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
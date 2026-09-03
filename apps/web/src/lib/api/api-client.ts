import { API_BASE_URL } from "./config";
import { ApiError } from "./api-error";

import type { ApiErrorResponse, ApiRequestOptions, ApiSuccessResponse, } from "./api.types";

export const apiClient = {
  async request<T>( endpoint: string, options: ApiRequestOptions = {} ): Promise<T> {
    const { body, token, headers, ...requestOptions } = options;

    const response = await fetch(
      `${API_BASE_URL}${endpoint}`,
      { ...requestOptions,
        headers: {
          "Content-Type": "application/json", ...(token ? {  Authorization: `Bearer ${token}` } : {}),
          ...headers,
        },
        ...(body !== undefined ? {  body: JSON.stringify(body) } : {}),
      }
    );

    const responseData = await response.json().catch(() => null);

    if (!response.ok) {
      const errorData = responseData as ApiErrorResponse | null;
      throw new ApiError( errorData?.message || "Something went wrong", response.status, errorData?.errors );
    }

    const data = responseData as ApiSuccessResponse<T>;

    return data.data;
  },

  get<T>( endpoint: string, token?: string | null ) {
    return this.request<T>(endpoint, {
      method: "GET",
      token,
    });
  },

  post<T>( endpoint: string, body?: unknown, token?: string | null ) {
    return this.request<T>(endpoint, {
      method: "POST",
      body,
      token,
    });
  },

  patch<T>( endpoint: string, body?: unknown, token?: string | null ) {
    return this.request<T>(endpoint, {
      method: "PATCH",
      body,
      token,
    });
  },

  delete<T>( endpoint: string, token?: string | null ) {
    return this.request<T>(endpoint, {
      method: "DELETE",
      token,
    });
  },
};
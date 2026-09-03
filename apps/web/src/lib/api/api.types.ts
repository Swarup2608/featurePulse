export interface ApiSuccessResponse<T> {
  success: true;
  message?: string;
  data: T;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
}

export interface ApiRequestOptions
  extends Omit<RequestInit, "body"> {
  body?: unknown;
  token?: string | null;
}
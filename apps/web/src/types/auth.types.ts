export interface User {
  _id: string;
  name: string;
  email: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Organization {
  _id: string;
  name: string;
  slug?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
  organizationName: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  organization: Organization;
  accessToken: string;
}

export interface CurrentUserResponse {
  user: User;
}

export interface RefreshTokenResponse {
  accessToken: string;
}
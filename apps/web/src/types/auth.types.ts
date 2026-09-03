export interface User { id: string; name: string; email: string; createdAt?: string; updatedAt?: string; }
export interface Organization { id: string; name: string; slug?: string; createdAt?: string; updatedAt?: string; }
export interface RegisterInput { name: string; email: string; password: string; organizationName: string; }
export interface LoginInput { email: string; password: string; }
export interface AuthResponse { user: User; organization: Organization; }
export interface CurrentUserResponse { user: User; }
export interface AuthUser { id: string; name: string; email: string; }
export interface AuthOrganization { id: string; name: string; slug: string; }
export interface AuthState { user: AuthUser | null; organization: AuthOrganization | null; isAuthenticated: boolean; isLoading: boolean; }
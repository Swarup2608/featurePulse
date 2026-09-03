export enum ApiKeyStatus {
  ACTIVE = "ACTIVE",
  REVOKED = "REVOKED",
}

export interface ApiKey {
  _id: string;
  name: string;
  keyPrefix: string;
  status: ApiKeyStatus;
  lastUsedAt?: string;
  expiresAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateApiKeyResponse {
  apiKey: string;
  apiKeyData: ApiKey;
}

export interface ApiKeysResponse {
  apiKeys: ApiKey[];
}

export interface CreateApiKeyInput {
  name: string;
}

export interface UpdateApiKeyInput {
  name?: string;
}

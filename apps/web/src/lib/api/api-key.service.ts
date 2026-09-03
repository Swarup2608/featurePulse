import { apiClient } from "./api-client";
import type { ApiKey, CreateApiKeyInput, CreateApiKeyResponse, ApiKeysResponse } from "@/types/api-key.types";

export const apiKeyService = {
  async getApiKeys(organizationId: string, projectId: string, sourceId: string): Promise<ApiKey[]> {
    const response = await apiClient.get<ApiKeysResponse>(
      `/organizations/${organizationId}/projects/${projectId}/event-sources/${sourceId}/api-keys`,
    );
    return response.apiKeys;
  },

  async createApiKey(organizationId: string, projectId: string, sourceId: string, data: CreateApiKeyInput): Promise<CreateApiKeyResponse> {
    return apiClient.post<CreateApiKeyResponse>(
      `/organizations/${organizationId}/projects/${projectId}/event-sources/${sourceId}/api-keys`,
      data,
    );
  },

  async revokeApiKey(organizationId: string, projectId: string, sourceId: string, keyId: string): Promise<ApiKey> {
    return apiClient.patch<ApiKey>(
      `/organizations/${organizationId}/projects/${projectId}/event-sources/${sourceId}/api-keys/${keyId}/revoke`,
      {},
    );
  },
};

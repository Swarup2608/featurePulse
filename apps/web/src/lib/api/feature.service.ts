import { apiClient } from "./api-client";
import type { Feature, CreateFeatureInput, UpdateFeatureInput, FeaturesResponse } from "@/types/feature.types";

export const featureService = {
  async getFeatures(organizationId: string, projectId: string, page: number = 1, limit: number = 10): Promise<FeaturesResponse> {
    return apiClient.get<FeaturesResponse>(`/organizations/${organizationId}/projects/${projectId}/features?page=${page}&limit=${limit}`);
  },

  async getFeatureById(organizationId: string, projectId: string, featureId: string): Promise<Feature> {
    const response = await apiClient.get<{ feature: Feature }>(`/organizations/${organizationId}/projects/${projectId}/features/${featureId}`);
    return response.feature;
  },

  async createFeature(organizationId: string, projectId: string, data: CreateFeatureInput): Promise<Feature> {
    const response = await apiClient.post<{ feature: Feature }>(`/organizations/${organizationId}/projects/${projectId}/features`, data);
    return response.feature;
  },

  async updateFeature(organizationId: string, projectId: string, featureId: string, data: UpdateFeatureInput): Promise<Feature> {
    const response = await apiClient.patch<{ feature: Feature }>(`/organizations/${organizationId}/projects/${projectId}/features/${featureId}`, data);
    return response.feature;
  },

  async archiveFeature(organizationId: string, projectId: string, featureId: string): Promise<Feature> {
    const response = await apiClient.patch<{ feature: Feature }>(`/organizations/${organizationId}/projects/${projectId}/features/${featureId}/archive`);
    return response.feature;
  },
};

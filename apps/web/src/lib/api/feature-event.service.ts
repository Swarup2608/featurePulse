import { apiClient } from "./api-client";
import type { FeatureEvent, FeatureEventsResponse, AddEventToFeatureInput } from "@/types/feature-event.types";

export const featureEventService = {
  async getFeatureEvents(organizationId: string, projectId: string, featureId: string): Promise<FeatureEvent[]> {
    const response = await apiClient.get<FeatureEventsResponse>(
      `/organizations/${organizationId}/projects/${projectId}/features/${featureId}/events`,
    );
    return response.events;
  },

  async addEventToFeature(organizationId: string, projectId: string, featureId: string, data: AddEventToFeatureInput): Promise<FeatureEvent> {
    return apiClient.post<FeatureEvent>(
      `/organizations/${organizationId}/projects/${projectId}/features/${featureId}/events`,
      data,
    );
  },

  async removeEventFromFeature(organizationId: string, projectId: string, featureId: string, eventId: string): Promise<void> {
    await apiClient.delete(
      `/organizations/${organizationId}/projects/${projectId}/features/${featureId}/events/${eventId}`,
    );
  },
};

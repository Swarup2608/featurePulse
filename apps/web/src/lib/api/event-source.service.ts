import { apiClient } from "./api-client";
import type { EventSource, CreateEventSourceInput, UpdateEventSourceInput, EventSourcesResponse } from "@/types/event-source.types";

export const eventSourceService = {
  async getEventSources(organizationId: string, projectId: string, page: number = 1, limit: number = 10): Promise<EventSourcesResponse> {
    return apiClient.get<EventSourcesResponse>(`/organizations/${organizationId}/projects/${projectId}/event-sources?page=${page}&limit=${limit}`);
  },

  async getEventSourceById(organizationId: string, projectId: string, sourceId: string): Promise<EventSource> {
    const response = await apiClient.get<{ eventSource: EventSource }>(`/organizations/${organizationId}/projects/${projectId}/event-sources/${sourceId}`);
    return response.eventSource;
  },

  async createEventSource(organizationId: string, projectId: string, data: CreateEventSourceInput): Promise<EventSource> {
    const response = await apiClient.post<{ eventSource: EventSource }>(`/organizations/${organizationId}/projects/${projectId}/event-sources`, data);
    return response.eventSource;
  },

  async updateEventSource(organizationId: string, projectId: string, sourceId: string, data: UpdateEventSourceInput): Promise<EventSource> {
    const response = await apiClient.patch<{ eventSource: EventSource }>(`/organizations/${organizationId}/projects/${projectId}/event-sources/${sourceId}`, data);
    return response.eventSource;
  },
};

import { apiClient } from "./api-client";
import type { EventDefinition, CreateEventInput, UpdateEventInput, EventsResponse } from "@/types/event.types";

export const eventService = {
  async getEvents(organizationId: string, projectId: string, page: number = 1, limit: number = 10): Promise<EventsResponse> {
    return apiClient.get<EventsResponse>(`/organizations/${organizationId}/projects/${projectId}/events?page=${page}&limit=${limit}`);
  },

  async getEventById(organizationId: string, projectId: string, eventId: string): Promise<EventDefinition> {
    const response = await apiClient.get<{ event: EventDefinition }>(`/organizations/${organizationId}/projects/${projectId}/events/${eventId}`);
    return response.event;
  },

  async createEvent(organizationId: string, projectId: string, data: CreateEventInput): Promise<EventDefinition> {
    const response = await apiClient.post<{ event: EventDefinition }>(`/organizations/${organizationId}/projects/${projectId}/events`, data);
    return response.event;
  },

  async updateEvent(organizationId: string, projectId: string, eventId: string, data: UpdateEventInput): Promise<EventDefinition> {
    const response = await apiClient.patch<{ event: EventDefinition }>(`/organizations/${organizationId}/projects/${projectId}/events/${eventId}`, data);
    return response.event;
  },
};

import type { EventDefinition } from "./event.types";

export interface FeatureEvent {
  _id: string;
  organizationId: string;
  projectId: string;
  featureId: string;
  eventId: EventDefinition;
  createdAt: string;
  updatedAt: string;
}

export interface FeatureEventsResponse {
  events: FeatureEvent[];
}

export interface AddEventToFeatureInput {
  eventId: string;
}

export enum EventSourceType {
  WEB = "WEB",
  MOBILE = "MOBILE",
  BACKEND = "BACKEND",
  OTHER = "OTHER",
}

export enum EventSourceEnvironment {
  DEVELOPMENT = "DEVELOPMENT",
  STAGING = "STAGING",
  PRODUCTION = "PRODUCTION",
}

export interface EventSource {
  _id: string;
  name: string;
  slug: string;
  type: EventSourceType;
  environment: EventSourceEnvironment;
  organizationId: string;
  projectId: string;
  createdBy: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface EventSourcePagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface EventSourcesResponse {
  eventSources: EventSource[];
  pagination: EventSourcePagination;
}

export interface CreateEventSourceInput {
  name: string;
  type: EventSourceType;
  environment: EventSourceEnvironment;
}

export interface UpdateEventSourceInput {
  name?: string;
  environment?: EventSourceEnvironment;
  isActive?: boolean;
}

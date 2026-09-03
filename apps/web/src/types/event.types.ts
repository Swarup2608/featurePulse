export interface EventDefinition {
  _id: string;
  name: string;
  displayName: string;
  description?: string;
  organizationId: string;
  projectId: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface EventPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface EventsResponse {
  events: EventDefinition[];
  pagination: EventPagination;
}

export interface CreateEventInput {
  name: string;
  displayName: string;
  description?: string;
}

export interface UpdateEventInput {
  displayName?: string;
  description?: string;
}

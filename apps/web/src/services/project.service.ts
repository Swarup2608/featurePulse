import { apiClient } from "@/lib/api/api-client";

import type {
  CreateProjectInput,
  Project,
  ProjectsResponse,
} from "@/types/project.types";

export const projectService = {
  getAll(organizationId: string) {
    return apiClient.get<ProjectsResponse>(
      `/organizations/${organizationId}/projects`,
    );
  },

  getById(organizationId: string, projectId: string) {
    return apiClient.get<{ project: Project }>(
      `/organizations/${organizationId}/projects/${projectId}`,
    );
  },

  create(organizationId: string, data: CreateProjectInput) {
    return apiClient.post<{ project: Project }>(
      `/organizations/${organizationId}/projects`,
      data,
    );
  },
};
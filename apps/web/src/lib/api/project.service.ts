import { apiClient } from "./api-client";
import type { CreateProjectInput, Project, UpdateProjectInput } from "@/types/project.types";

export const projectService = {
  getAll(organizationId: string) {
    return apiClient.get<Project[]>(`/organizations/${organizationId}/projects`);
  },
  create(organizationId: string, data: CreateProjectInput) {
    return apiClient.post<Project>(`/organizations/${organizationId}/projects`, data);
  },
  getById(organizationId: string, projectId: string) {
    return apiClient.get<Project>(`/organizations/${organizationId}/projects/${projectId}`);
  },
  update(organizationId: string, projectId: string, data: UpdateProjectInput) {
    return apiClient.patch<Project>(`/organizations/${organizationId}/projects/${projectId}`, data);
  },
  delete(organizationId: string, projectId: string) {
    return apiClient.delete<void>(`/organizations/${organizationId}/projects/${projectId}`);
  },
};
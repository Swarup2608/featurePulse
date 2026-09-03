import { apiClient } from "./api-client";
import type { CreateProjectInput, Project, ProjectsResponse, UpdateProjectInput } from "@/types/project.types";

export const projectService = {
  async getProjects(organizationId: string, page = 1, limit = 10): Promise<ProjectsResponse> {
    return apiClient.get<ProjectsResponse>(`/organizations/${organizationId}/projects?page=${page}&limit=${limit}`);
  },
  async getProjectById(organizationId: string, projectId: string): Promise<Project> {
    const response = await apiClient.get<{ project: Project }>(`/organizations/${organizationId}/projects/${projectId}`);
    return response.project;
  },
  async createProject(organizationId: string, data: CreateProjectInput): Promise<Project> {
    const response = await apiClient.post<{ project: Project }>(`/organizations/${organizationId}/projects`, data);
    return response.project;
  },
  async updateProject(organizationId: string, projectId: string, data: UpdateProjectInput): Promise<Project> {
    const response = await apiClient.patch<{ project: Project }>(`/organizations/${organizationId}/projects/${projectId}`, data);
    return response.project;
  },
  async deleteProject(organizationId: string, projectId: string): Promise<void> {
    await apiClient.delete(`/organizations/${organizationId}/projects/${projectId}`);
  },
};
import { apiClient } from "./api-client";
import type { CreateProjectInput, Project, UpdateProjectInput } from "@/types/project.types";

interface ApiResponse<T> { success: boolean; message?: string; data: T; }
interface ProjectResponse { project: Project; }
interface ProjectsResponse { projects: Project[]; }

export const projectService = {
  async getAll(organizationId: string): Promise<Project[]> {
    const response = await apiClient.get<ApiResponse<ProjectsResponse>>(`/organizations/${organizationId}/projects`);
    return response.data.projects;
  },
  async create(organizationId: string, data: CreateProjectInput): Promise<Project> {
    const response = await apiClient.post<ApiResponse<ProjectResponse>>(`/organizations/${organizationId}/projects`, data);
    return response.data.project;
  },
  async getById(organizationId: string, projectId: string): Promise<Project> {
    const response = await apiClient.get<ApiResponse<ProjectResponse>>(`/organizations/${organizationId}/projects/${projectId}`);
    return response.data.project;
  },
  async update(organizationId: string, projectId: string, data: UpdateProjectInput): Promise<Project> {
    const response = await apiClient.patch<ApiResponse<ProjectResponse>>(`/organizations/${organizationId}/projects/${projectId}`, data);
    return response.data.project;
  },
  async delete(organizationId: string, projectId: string): Promise<void> {
    await apiClient.delete(`/organizations/${organizationId}/projects/${projectId}`);
  },
};
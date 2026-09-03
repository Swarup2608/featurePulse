export type ProjectStatus = "ACTIVE" | "ARCHIVED";

export interface Project {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  organizationId: string;
  createdBy: string;
  status: ProjectStatus;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectsResponse {
  projects: Project[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface CreateProjectInput {
  name: string;
  description?: string;
}

export interface UpdateProjectInput {
  name?: string;
  description?: string;
  status?: ProjectStatus;
}
import { z } from "zod";
import { ProjectStatus } from "./project.types";

export const createProjectSchema = z.object({
  name: z.string().trim().min(2, "Project name must be at least 2 characters").max(100, "Project name cannot exceed 100 characters"),
  description: z.string().trim().max(500, "Description cannot exceed 500 characters").optional(),
});

export const updateProjectSchema = z.object({
  name: z.string().trim().min(2, "Project name must be at least 2 characters").max(100, "Project name cannot exceed 100 characters").optional(),
  description: z.string().trim().max(500, "Description cannot exceed 500 characters").optional(),
  status: z.enum(ProjectStatus).transform((status): ProjectStatus => status).optional(),
});

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;

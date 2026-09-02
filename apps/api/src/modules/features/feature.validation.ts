import { z } from "zod";

export const createFeatureSchema = z.object({
  name: z.string().trim().min(2, "Feature name must be at least 2 characters").max(100, "Feature name cannot exceed 100 characters"),
  description: z.string().trim().max(500, "Description cannot exceed 500 characters").optional(),
});

export const updateFeatureSchema = z.object({
  name: z.string().trim().min(2, "Feature name must be at least 2 characters").max(100, "Feature name cannot exceed 100 characters").optional(),
  description: z.string().trim().max(500, "Description cannot exceed 500 characters").optional(),
  status: z.enum(["DRAFT", "ACTIVE", "RELEASED", "ARCHIVED"]).optional(),
});

export type CreateFeatureInput = z.infer<typeof createFeatureSchema>;
export type UpdateFeatureInput = z.infer<typeof updateFeatureSchema>;
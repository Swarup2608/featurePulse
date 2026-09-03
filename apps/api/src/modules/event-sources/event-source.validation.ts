import { z } from "zod";

export const createEventSourceSchema = z.object({
  name: z.string().trim().min(2, "Source name must be at least 2 characters").max(100, "Source name cannot exceed 100 characters"),
  type: z.enum(["WEB", "MOBILE", "BACKEND", "OTHER"]),
  environment: z.enum(["DEVELOPMENT", "STAGING", "PRODUCTION"]),
});

export const updateEventSourceSchema = z.object({
  name: z.string().trim().min(2).max(100).optional(),
  type: z.enum(["WEB", "MOBILE", "BACKEND", "OTHER"]).optional(),
  environment: z.enum(["DEVELOPMENT", "STAGING", "PRODUCTION"]).optional(),
  isActive: z.boolean().optional(),
});

export type CreateEventSourceInput = z.infer<typeof createEventSourceSchema>;
export type UpdateEventSourceInput = z.infer<typeof updateEventSourceSchema>;
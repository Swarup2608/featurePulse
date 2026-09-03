import { z } from "zod";

const eventNameRegex = /^[a-z][a-z0-9_]*$/;

export const createEventDefinitionSchema = z.object({
  name: z.string().trim().min(2).max(100).regex(eventNameRegex, "Event name must use lowercase snake_case"),
  displayName: z.string().trim().min(2).max(150),
  description: z.string().trim().max(500).optional(),
});

export const updateEventDefinitionSchema = z.object({
  displayName: z.string().trim().min(2).max(150).optional(),
  description: z.string().trim().max(500).optional(),
});

export type CreateEventDefinitionInput = z.infer<typeof createEventDefinitionSchema>;
export type UpdateEventDefinitionInput = z.infer<typeof updateEventDefinitionSchema>;
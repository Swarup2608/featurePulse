import { Request, Response } from "express";
import { AppError } from "../../utils/AppError";
import { asyncHandler } from "../../utils/asyncHandler";
import { validateParams } from "../../utils/validateParams";
import { createEventDefinition, getEventDefinitions, getEventDefinitionById, updateEventDefinition } from "./event.service";
import { createEventDefinitionSchema, updateEventDefinitionSchema } from "./event.validation";

export const createEventController = asyncHandler(async (req: Request, res: Response) => {
  if (!req.userId) throw new AppError("Authentication required", 401);
  const { organizationId, projectId } = validateParams(req.params, ["organizationId", "projectId"]);
  const validatedData = createEventDefinitionSchema.parse(req.body);
  const event = await createEventDefinition(organizationId, projectId, validatedData, req.userId);
  res.status(201).json({
    success: true,
    message: "Event definition created successfully",
    data: { event },
  });
});

export const getAllController = asyncHandler(async (req: Request, res: Response) => {
  const { organizationId, projectId } = validateParams(req.params, ["organizationId", "projectId"]);
  const page = Math.max(1, Number(req.query.page as string) || 1);
  const limit = Math.max(1, Number(req.query.limit as string) || 10);
  const result = await getEventDefinitions(organizationId, projectId, page, limit);
  res.status(200).json({
    success: true,
    data: result,
  });
});

export const getEventByIdController = asyncHandler(async (req: Request, res: Response) => {
  const { organizationId, projectId, eventId } = validateParams(req.params, ["organizationId", "projectId", "eventId"]);
  const event = await getEventDefinitionById(organizationId, projectId, eventId);
  res.status(200).json({
    success: true,
    data: { event },
  });
});

export const updateEventController = asyncHandler(async (req: Request, res: Response) => {
  if (!req.userId) throw new AppError("Authentication required", 401);
  const { organizationId, projectId, eventId } = validateParams(req.params, ["organizationId", "projectId", "eventId"]);
  const validatedData = updateEventDefinitionSchema.parse(req.body);
  const event = await updateEventDefinition(organizationId, projectId, eventId, validatedData, req.userId);
  res.status(200).json({
    success: true,
    message: "Event definition updated successfully",
    data: { event },
  });
});
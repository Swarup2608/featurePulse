import { Request, Response } from "express";
import { AppError } from "../../utils/AppError";
import { asyncHandler } from "../../utils/asyncHandler";
import { validateParams } from "../../utils/validateParams";
import { createEventSource, getEventSourceById, getEventSources, updateEventSource } from "./event-source.service";
import { createEventSourceSchema, updateEventSourceSchema } from "./event-source.validation";

export const createController = asyncHandler(async (req: Request, res: Response) => {
  if (!req.userId) throw new AppError("Authentication required", 401);
  const { organizationId, projectId } = validateParams(req.params, ["organizationId", "projectId"]);
  const validatedData = createEventSourceSchema.parse(req.body);
  const eventSource = await createEventSource(organizationId, projectId, req.userId, validatedData);
  res.status(201).json({
    success: true,
    message: "Event source created successfully",
    data: { eventSource },
  });
});

export const getAllController = asyncHandler(async (req: Request, res: Response) => {
  const { organizationId, projectId } = validateParams(req.params, ["organizationId", "projectId"]);
  const eventSources = await getEventSources(organizationId, projectId);
  res.status(200).json({
    success: true,
    data: { eventSources },
  });
});

export const getByIdController = asyncHandler(async (req: Request, res: Response) => {
  const { organizationId, projectId, eventSourceId } = validateParams(req.params, ["organizationId", "projectId", "eventSourceId"]);
  const eventSource = await getEventSourceById(organizationId, projectId, eventSourceId);
  res.status(200).json({
    success: true,
    data: { eventSource },
  });
});

export const updateController = asyncHandler(async (req: Request, res: Response) => {
  const { organizationId, projectId, eventSourceId } = validateParams(req.params, ["organizationId", "projectId", "eventSourceId"]);
  const validatedData = updateEventSourceSchema.parse(req.body);
  const eventSource = await updateEventSource(organizationId, projectId, eventSourceId, validatedData);
  res.status(200).json({
    success: true,
    message: "Event source updated successfully",
    data: { eventSource },
  });
});
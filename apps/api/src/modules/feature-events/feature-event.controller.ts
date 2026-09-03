import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { validateParams } from "../../utils/validateParams";
import { addEventToFeature, getFeatureEvents, removeEventFromFeature } from "./feature-event.service";

export const addEventController = asyncHandler(async (req: Request, res: Response) => {
  const { organizationId, projectId, featureId } = validateParams(req.params, ["organizationId", "projectId", "featureId"]);
  const { eventId } = req.body;
  const mapping = await addEventToFeature(organizationId, projectId, featureId, eventId);
  res.status(201).json({
    success: true,
    message: "Event mapped to feature successfully",
    data: { mapping },
  });
});

export const getEventsController = asyncHandler(async (req: Request, res: Response) => {
  const { organizationId, projectId, featureId } = validateParams(req.params, ["organizationId", "projectId", "featureId"]);
  const mappings = await getFeatureEvents(organizationId, projectId, featureId);
  res.status(200).json({
    success: true,
    data: { 
        events: mappings 
    },
  });
});

export const removeEventController = asyncHandler(async (req: Request, res: Response) => {
  const { organizationId, projectId, featureId, eventId } = validateParams(req.params, ["organizationId", "projectId", "featureId", "eventId"]);
  await removeEventFromFeature(organizationId, projectId, featureId, eventId);
  res.status(200).json({
    success: true,
    message: "Event removed from feature successfully",
  });
});
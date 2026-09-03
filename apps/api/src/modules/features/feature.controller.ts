import { Request, Response } from "express";
import { AppError } from "../../utils/AppError";
import { asyncHandler } from "../../utils/asyncHandler";
import { validateParams } from "../../utils/validateParams";
import { archiveFeature, createFeature, getFeatureById, getFeatures, updateFeature } from "./feature.service";
import { createFeatureSchema, updateFeatureSchema } from "./feature.validation";

export const createController = asyncHandler(async (req: Request, res: Response) => {
  if (!req.userId) throw new AppError("User not authenticated", 401);
  const { organizationId, projectId } = validateParams(req.params, ["organizationId", "projectId"]);
  const validatedData = createFeatureSchema.parse(req.body);
  const feature = await createFeature(organizationId, projectId, req.userId, validatedData);
  res.status(201).json({
    success: true,
    message: "Feature successfully created!",
    data: { feature },
  });
});

export const getAllController = asyncHandler(async (req: Request, res: Response) => {
  const { organizationId, projectId } = validateParams(req.params, ["organizationId", "projectId"]);
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 10));
  const result = await getFeatures(organizationId, projectId, page, limit);
  res.status(200).json({
    success: true,
    data: result,
  });
});

export const getByIdController = asyncHandler(async (req: Request, res: Response) => {
  const { organizationId, projectId, featureId } = validateParams(req.params, ["organizationId", "projectId", "featureId"]);
  const feature = await getFeatureById(organizationId, projectId, featureId);
  res.status(200).json({
    success: true,
    data: { feature },
  });
});

export const updateController = asyncHandler(async (req: Request, res: Response) => {
  const { organizationId, projectId, featureId } = validateParams(req.params, ["organizationId", "projectId", "featureId"]);
  const validatedData = updateFeatureSchema.parse(req.body);
  const feature = await updateFeature(organizationId, projectId, featureId, validatedData);
  res.status(200).json({
    success: true,
    message: "Feature updated successfully",
    data: { feature },
  });
});

export const archiveController = asyncHandler(async (req: Request, res: Response) => {
  const { organizationId, projectId, featureId } = validateParams(req.params, ["organizationId", "projectId", "featureId"]);
  const feature = await archiveFeature(organizationId, projectId, featureId);
  res.status(200).json({
    success: true,
    message: "Feature archived successfully",
    data: { feature },
  });
});
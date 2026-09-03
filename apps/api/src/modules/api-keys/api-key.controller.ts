import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { validateParams } from "../../utils/validateParams";
import { createApiKey, getApiKeys, revokeApiKey } from "./api-key.service";
import { createApiKeySchema } from "./api-key.validation";

export const createController = asyncHandler(async (req: Request, res: Response) => {
  if (!req.userId) throw new Error("Authentication required");
  const { organizationId, projectId, eventSourceId } = validateParams(req.params, ["organizationId", "projectId", "eventSourceId"]);
  const { name } = createApiKeySchema.parse(req.body);
  const result = await createApiKey(organizationId, projectId, eventSourceId, req.userId, name);
  res.status(201).json({
    success: true,
    message: "API key created successfully. Save it now because it will not be shown again.",
    data: result,
  });
});

export const getAllController = asyncHandler(async (req: Request, res: Response) => {
  const { organizationId, projectId, eventSourceId } = validateParams(req.params, ["organizationId", "projectId", "eventSourceId"]);
  const apiKeys = await getApiKeys(organizationId, projectId, eventSourceId);
  res.status(200).json({
    success: true,
    data: { apiKeys },
  });
});

export const revokeController = asyncHandler(async (req: Request, res: Response) => {
  const { organizationId, projectId, eventSourceId, apiKeyId } = validateParams(req.params, ["organizationId", "projectId", "eventSourceId", "apiKeyId"]);
  const apiKey = await revokeApiKey(organizationId, projectId, eventSourceId, apiKeyId);
  res.status(200).json({
    success: true,
    message: "API key revoked successfully",
    data: { apiKey },
  });
});
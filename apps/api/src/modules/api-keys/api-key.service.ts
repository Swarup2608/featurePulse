import crypto from "crypto";
import { Types } from "mongoose";
import { AppError } from "../../utils/AppError";
import { EventSource } from "../event-sources/event-source.model";
import { ApiKey } from "./api-key.model";
import { ApiKeyStatus } from "./api-key.types";

const generateApiKey = () => `fp_live_${crypto.randomBytes(32).toString("hex")}`;

const hashApiKey = (apiKey: string): string => crypto.createHash("sha256").update(apiKey).digest("hex");

const getApiKeyPrefix = (apiKey: string): string => apiKey.slice(0, 16);

export const createApiKey = async (organizationId: string, projectId: string, eventSourceId: string, userId: string, name: string) => {
  if (!Types.ObjectId.isValid(eventSourceId)) throw new AppError("Invalid event source ID", 400);
  const eventSource = await EventSource.findOne({ _id: eventSourceId, organizationId, projectId });
  if (!eventSource) throw new AppError("Event source not found", 404);
  const apiKey = generateApiKey();
  const keyHash = hashApiKey(apiKey);
  const keyPrefix = getApiKeyPrefix(apiKey);
  const createdApiKey = await ApiKey.create({
    name,
    keyHash,
    keyPrefix,
    organizationId,
    projectId,
    eventSourceId,
    status: ApiKeyStatus.ACTIVE,
    createdBy: userId,
  });
  return { apiKey, apiKeyData: createdApiKey };
};

export const getApiKeys = async (organizationId: string, projectId: string, eventSourceId: string) => {
  return ApiKey.find({ organizationId, projectId, eventSourceId }).select("-keyHash").sort({ createdAt: -1 });
};

export const revokeApiKey = async (organizationId: string, projectId: string, eventSourceId: string, apiKeyId: string) => {
  if (!Types.ObjectId.isValid(apiKeyId)) throw new AppError("Invalid API key ID", 400);
  const apiKey = await ApiKey.findOne({ _id: apiKeyId, organizationId, projectId, eventSourceId }).select("+keyHash");
  if (!apiKey) throw new AppError("API key not found", 404);
  if (apiKey.status === ApiKeyStatus.REVOKED) throw new AppError("API key is already revoked", 400);
  apiKey.status = ApiKeyStatus.REVOKED;
  await apiKey.save();
  return apiKey;
};
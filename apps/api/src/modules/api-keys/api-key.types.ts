import { Types } from "mongoose";

export enum ApiKeyStatus {
  ACTIVE = "ACTIVE",
  REVOKED = "REVOKED",
}

export interface ApiKeyDocument {
  name: string;

  keyHash: string;
  keyPrefix: string;

  organizationId: Types.ObjectId;
  projectId: Types.ObjectId;
  eventSourceId: Types.ObjectId;

  status: ApiKeyStatus;

  lastUsedAt?: Date;
  expiresAt?: Date;

  createdBy: Types.ObjectId;

  createdAt: Date;
  updatedAt: Date;
}
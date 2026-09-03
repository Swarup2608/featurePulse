import { Types } from "mongoose";

export enum EventSourceType {
  WEB = "WEB",
  MOBILE = "MOBILE",
  BACKEND = "BACKEND",
  OTHER = "OTHER",
}

export enum EventSourceEnvironment {
  DEVELOPMENT = "DEVELOPMENT",
  STAGING = "STAGING",
  PRODUCTION = "PRODUCTION",
}

export interface EventSourceDocument {
  name: string;
  slug: string;

  type: EventSourceType;

  environment: EventSourceEnvironment;

  organizationId: Types.ObjectId;
  projectId: Types.ObjectId;

  createdBy: Types.ObjectId;

  isActive: boolean;

  createdAt: Date;
  updatedAt: Date;
}
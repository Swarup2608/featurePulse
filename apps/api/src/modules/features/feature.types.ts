import { Types } from "mongoose";

export enum FeatureStatus {
  DRAFT = "DRAFT",
  ACTIVE = "ACTIVE",
  RELEASED = "RELEASED",
  ARCHIVED = "ARCHIVED",
}

export interface FeatureDocument {
  name: string;
  slug: string;
  description?: string;

  organizationId: Types.ObjectId;
  projectId: Types.ObjectId;
  createdBy: Types.ObjectId;

  status: FeatureStatus;
  releasedAt?: Date;

  createdAt: Date;
  updatedAt: Date;
}
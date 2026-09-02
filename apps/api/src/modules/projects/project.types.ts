import { Types } from "mongoose";

export enum ProjectStatus {
  ACTIVE = "ACTIVE",
  ARCHIVED = "ARCHIVED",
}

export interface ProjectDocument {
  name: string;
  slug: string;
  description?: string;
  organizationId: Types.ObjectId;
  createdBy: Types.ObjectId;
  status: ProjectStatus;
  createdAt: Date;
  updatedAt: Date;
}
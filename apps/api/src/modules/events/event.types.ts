import { Types } from "mongoose";

export interface EventDefinitionDocument {
  name: string;
  displayName: string;
  description?: string;

  organizationId: Types.ObjectId;
  projectId: Types.ObjectId;

  createdBy: Types.ObjectId;

  createdAt: Date;
  updatedAt: Date;
}
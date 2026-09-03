import { Types } from "mongoose";

export interface FeatureEventDocument {
  organizationId: Types.ObjectId;
  projectId: Types.ObjectId;

  featureId: Types.ObjectId;
  eventId: Types.ObjectId;

  createdAt: Date;
  updatedAt: Date;
}
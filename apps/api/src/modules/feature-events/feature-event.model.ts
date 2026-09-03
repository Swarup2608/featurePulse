import { model, Schema } from "mongoose";
import { FeatureEventDocument } from "./feature-event.types";

const featureEventSchema = new Schema<FeatureEventDocument>({
  organizationId: { type: Schema.Types.ObjectId, ref: "Organization", required: true },
  projectId: { type: Schema.Types.ObjectId, ref: "Project", required: true },
  featureId: { type: Schema.Types.ObjectId, ref: "Feature", required: true },
  eventId: { type: Schema.Types.ObjectId, ref: "EventDefinition", required: true },
}, { timestamps: true });

featureEventSchema.index({ featureId: 1, eventId: 1 }, { unique: true });
featureEventSchema.index({ organizationId: 1, projectId: 1, featureId: 1 });

export const FeatureEvent = model<FeatureEventDocument>( "FeatureEvent", featureEventSchema );
import { Types } from "mongoose";
import { AppError } from "../../utils/AppError";
import { Feature } from "../features/feature.model";
import { EventDefinition } from "../events/event.model";
import { FeatureEvent } from "./feature-event.model";

export const addEventToFeature = async (organizationId: string, projectId: string, featureId: string, eventId: string) => {
  if (!Types.ObjectId.isValid(featureId) || !Types.ObjectId.isValid(eventId)) throw new AppError("Invalid feature or event ID", 400);
  const [feature, event] = await Promise.all([
    Feature.findOne({ _id: featureId, organizationId, projectId }),
    EventDefinition.findOne({ _id: eventId, organizationId, projectId }),
  ]);
  if (!feature) throw new AppError("Feature not found", 404);
  if (!event) throw new AppError("Event definition not found", 404);
  const existingMapping = await FeatureEvent.findOne({ featureId, eventId });
  if (existingMapping) throw new AppError("This event is already mapped to the feature", 409);
  return FeatureEvent.create({ organizationId, projectId, featureId, eventId });
};

export const getFeatureEvents = async (organizationId: string, projectId: string, featureId: string) => {
  if (!Types.ObjectId.isValid(featureId)) throw new AppError("Invalid feature ID", 400);
  const feature = await Feature.findOne({ _id: featureId, organizationId, projectId });
  if (!feature) throw new AppError("Feature not found", 404);
  return FeatureEvent.find({ organizationId, projectId, featureId }).populate("eventId");
};

export const removeEventFromFeature = async (organizationId: string, projectId: string, featureId: string, eventId: string) => {
  const mapping = await FeatureEvent.findOneAndDelete({ organizationId, projectId, featureId, eventId });
  if (!mapping) throw new AppError("Feature event mapping not found", 404);
  return mapping;
};
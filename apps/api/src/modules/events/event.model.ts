import { model, Schema } from "mongoose";
import { EventDefinitionDocument } from "./event.types";

const eventDefinitionSchema = new Schema<EventDefinitionDocument>({
  name: { type: String, required: true, trim: true, lowercase: true, minlength: 2, maxlength: 100 },
  displayName: { type: String, required: true, trim: true, minlength: 2, maxlength: 150 },
  description: { type: String, trim: true, maxlength: 500 },
  organizationId: { type: Schema.Types.ObjectId, ref: "Organization", required: true },
  projectId: { type: Schema.Types.ObjectId, ref: "Project", required: true },
  createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
}, { timestamps: true });

eventDefinitionSchema.index({ projectId: 1, name: 1 }, { unique: true });
eventDefinitionSchema.index({ organizationId: 1, projectId: 1, createdAt: -1 });

export const EventDefinition = model<EventDefinitionDocument>( "EventDefinition", eventDefinitionSchema );
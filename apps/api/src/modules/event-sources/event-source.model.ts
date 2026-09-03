import { model, Schema } from "mongoose";
import { EventSourceDocument, EventSourceEnvironment, EventSourceType } from "./event-source.types";

const eventSourceSchema = new Schema<EventSourceDocument>({
  name: { type: String, required: true, trim: true, minlength: 2, maxlength: 100 },
  slug: { type: String, required: true, trim: true, lowercase: true },
  type: { type: String, enum: Object.values(EventSourceType), required: true },
  environment: { type: String, enum: Object.values(EventSourceEnvironment), required: true },
  organizationId: { type: Schema.Types.ObjectId, ref: "Organization", required: true },
  projectId: { type: Schema.Types.ObjectId, ref: "Project", required: true },
  createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

eventSourceSchema.index({ projectId: 1, slug: 1 }, { unique: true });
eventSourceSchema.index({ organizationId: 1, projectId: 1, createdAt: -1 });

export const EventSource = model<EventSourceDocument>( "EventSource", eventSourceSchema );
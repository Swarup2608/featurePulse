import { model, Schema } from "mongoose";
import { ApiKeyDocument, ApiKeyStatus } from "./api-key.types";

const apiKeySchema = new Schema<ApiKeyDocument>({
  name: { type: String, required: true, trim: true, minlength: 2, maxlength: 100 },
  keyHash: { type: String, required: true, unique: true, select: false },
  keyPrefix: { type: String, required: true, index: true },
  organizationId: { type: Schema.Types.ObjectId, ref: "Organization", required: true, index: true },
  projectId: { type: Schema.Types.ObjectId, ref: "Project", required: true, index: true },
  eventSourceId: { type: Schema.Types.ObjectId, ref: "EventSource", required: true, index: true },
  status: { type: String, enum: Object.values(ApiKeyStatus), default: ApiKeyStatus.ACTIVE },
  lastUsedAt: { type: Date },
  expiresAt: { type: Date },
  createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
}, { timestamps: true });

apiKeySchema.index({ eventSourceId: 1, status: 1 });
apiKeySchema.index({ organizationId: 1, projectId: 1 });

export const ApiKey = model<ApiKeyDocument>("ApiKey", apiKeySchema);
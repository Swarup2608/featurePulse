import {
  model,
  Schema,
} from "mongoose";

import {
  FeatureDocument,
  FeatureStatus,
} from "./feature.types";

const featureSchema = new Schema<FeatureDocument>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },

    slug: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    description: {
      type: String,
      trim: true,
      maxlength: 500,
    },

    organizationId: {
      type: Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
      index: true,
    },

    projectId: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: true,
      index: true,
    },

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    status: {
      type: String,
      enum: Object.values(FeatureStatus),
      default: FeatureStatus.DRAFT,
    },

    releasedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

featureSchema.index(
  {
    projectId: 1,
    slug: 1,
  },
  {
    unique: true,
  }
);

featureSchema.index({
  organizationId: 1,
  projectId: 1,
  createdAt: -1,
});

export const Feature = model<FeatureDocument>(
  "Feature",
  featureSchema
);
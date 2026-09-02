import { model, Schema } from "mongoose";

import { ProjectDocument, ProjectStatus } from "./project.types";

const projectSchema = new Schema<ProjectDocument>({
    name: {type: String, required: true, trim: true, minLength: 2, maxlength: 100},
    slug: {type: String, required: true, trim: true, lowercase: true},
    description: {type: String, trim: true, maxlength: 500},
    organizationId: {type: Schema.Types.ObjectId, ref: "Organization", required: true, index: true},
    createdBy:  {type: Schema.Types.ObjectId, ref: "User",required: true},
    status: {type: String, enum: Object.values(ProjectStatus), default: ProjectStatus.ACTIVE}
},{
    timestamps: true
});

projectSchema.index(
  { organizationId: 1, slug: 1, },
  { unique: true, }
);
projectSchema.index({ organizationId: 1, createdAt: -1, });

export const Project = model<ProjectDocument>( "Project", projectSchema );
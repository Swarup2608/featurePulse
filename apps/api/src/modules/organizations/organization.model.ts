import { Model, Schema, model } from "mongoose";
import { IOrganization } from "./organization.types";

const organizationSchema = new Schema<IOrganization>({
    name: { type: String, required: true, trim: true, minlength: 2, maxlength: 100 }, 
    
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true }, 
    
    ownerId: { type: Schema.Types.ObjectId, ref: "User", required: true }
  },
  {
    timestamps: true,
  });

organizationSchema.index({ ownerId: 1 });

export const Organization = model<IOrganization>( "Organization", organizationSchema );

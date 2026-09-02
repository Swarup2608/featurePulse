import { Schema, model } from "mongoose";
import {
  IMembership,
  OrganizationRole,
} from "./membership.types";

const membershipSchema = new Schema<IMembership>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true }, 
    
    organizationId: { type: Schema.Types.ObjectId, ref: "Organization", required: true }, 
    
    role: { type: String, enum: ["OWNER", "ADMIN", "MEMBER", "VIEWER"], default: "MEMBER", required: true }
  },
  {
    timestamps: true,
  }
);

membershipSchema.index(
  { userId: 1, organizationId: 1, },
  { unique: true, }
);

export const Membership = model<IMembership>( "Membership", membershipSchema );
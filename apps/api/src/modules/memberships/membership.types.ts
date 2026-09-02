import { Types } from "mongoose";

export type OrganizationRole = | "OWNER" | "ADMIN" | "MEMBER" | "VIEWER";
export enum MembershipRole {
  OWNER = "OWNER",
  ADMIN = "ADMIN",
  MEMBER = "MEMBER",
  VIEWER = "VIEWER",
}
export interface IMembership {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  organizationId: Types.ObjectId;
  role: OrganizationRole;
  createdAt: Date;
  updatedAt: Date;
}
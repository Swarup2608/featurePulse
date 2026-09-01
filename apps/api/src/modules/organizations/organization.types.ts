import { Types } from "mongoose";

export interface IOrganization {
  _id: Types.ObjectId;
  name: string;
  slug: string;
  ownerId: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}
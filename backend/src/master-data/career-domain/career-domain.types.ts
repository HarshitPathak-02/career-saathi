import { Types } from "mongoose";

export interface CareerDomain {
  _id: Types.ObjectId;

  name: string;

  slug: string;

  description?: string;

  isActive: boolean;

  createdAt: Date;

  updatedAt: Date;
}
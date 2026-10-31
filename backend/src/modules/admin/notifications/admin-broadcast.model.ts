import { Schema, model, HydratedDocument, InferSchemaType, Types } from "mongoose";

const AdminBroadcastSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    targetCohort: {
      type: String,
      enum: ["ALL", "DOMAIN", "ROLE", "STALLED"],
      default: "ALL",
      required: true,
    },
    cohortFilter: {
      type: String,
      trim: true,
      default: null,
    },
    type: {
      type: String,
      enum: ["INFO", "WARNING", "CRITICAL", "UPDATE"],
      default: "INFO",
      required: true,
    },
    actionUrl: {
      type: String,
      trim: true,
      default: null,
    },
    recipientCount: {
      type: Number,
      default: 0,
    },
    senderId: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
    senderEmail: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
    collection: "admin_broadcasts",
    versionKey: false,
  }
);

export type AdminBroadcast = InferSchemaType<typeof AdminBroadcastSchema>;
export type AdminBroadcastDocument = HydratedDocument<AdminBroadcast>;

export const AdminBroadcastModel = model<AdminBroadcast>(
  "AdminBroadcast",
  AdminBroadcastSchema
);

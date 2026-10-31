import {
  HydratedDocument,
  InferSchemaType,
  Schema,
  model,
} from "mongoose";

import { NotificationType } from "./notification.enums.js";

const NotificationSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

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

    type: {
      type: String,
      enum: Object.values(NotificationType),
      default: NotificationType.SYSTEM,
      required: true,
    },

    actionUrl: {
      type: String,
      default: null,
      trim: true,
    },

    isRead: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    versionKey: false,
    collection: "notifications",
  }
);

NotificationSchema.index({ userId: 1, createdAt: -1 });
NotificationSchema.index({ userId: 1, isRead: 1 });

export type Notification = InferSchemaType<typeof NotificationSchema>;
export type NotificationDocument = HydratedDocument<Notification>;

export const NotificationModel = model<Notification>(
  "Notification",
  NotificationSchema
);

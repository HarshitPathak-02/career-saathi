import { Types } from "mongoose";
import { NotificationModel, NotificationDocument } from "./notification.model.js";
import { NotificationType } from "./notification.enums.js";

export interface CreateNotificationInput {
  userId: Types.ObjectId;
  title: string;
  message: string;
  type?: NotificationType;
  actionUrl?: string | null;
}

class NotificationRepository {
  async create(data: CreateNotificationInput): Promise<NotificationDocument> {
    const [created] = await NotificationModel.create([data]);
    return created;
  }

  async findByUserId(userId: Types.ObjectId, limit = 20): Promise<NotificationDocument[]> {
    return NotificationModel.find({ userId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean() as unknown as Promise<NotificationDocument[]>;
  }

  async countUnread(userId: Types.ObjectId): Promise<number> {
    return NotificationModel.countDocuments({ userId, isRead: false });
  }

  async markAsRead(id: Types.ObjectId, userId: Types.ObjectId): Promise<NotificationDocument | null> {
    return NotificationModel.findOneAndUpdate(
      { _id: id, userId },
      { $set: { isRead: true } },
      { returnDocument: "after" }
    );
  }

  async markAllAsRead(userId: Types.ObjectId): Promise<void> {
    await NotificationModel.updateMany(
      { userId, isRead: false },
      { $set: { isRead: true } }
    );
  }
}

export const notificationRepository = new NotificationRepository();

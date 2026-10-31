import { Types } from "mongoose";
import { notificationRepository } from "./notification.repository.js";
import { NotificationType } from "./notification.enums.js";

class NotificationService {
  async getNotifications(userId: string) {
    const userObjectId = new Types.ObjectId(userId);
    const notifications = await notificationRepository.findByUserId(userObjectId, 25);
    const unreadCount = await notificationRepository.countUnread(userObjectId);

    return {
      notifications,
      unreadCount,
    };
  }

  async markAsRead(userId: string, notificationId: string) {
    const userObjectId = new Types.ObjectId(userId);
    const notifObjectId = new Types.ObjectId(notificationId);
    return notificationRepository.markAsRead(notifObjectId, userObjectId);
  }

  async markAllAsRead(userId: string) {
    const userObjectId = new Types.ObjectId(userId);
    await notificationRepository.markAllAsRead(userObjectId);
    return { success: true };
  }

  async sendNotification(
    userId: Types.ObjectId | string,
    data: {
      title: string;
      message: string;
      type?: NotificationType;
      actionUrl?: string;
    }
  ) {
    const userObjectId = typeof userId === "string" ? new Types.ObjectId(userId) : userId;
    return notificationRepository.create({
      userId: userObjectId,
      title: data.title,
      message: data.message,
      type: data.type || NotificationType.SYSTEM,
      actionUrl: data.actionUrl || null,
    });
  }
}

export const notificationService = new NotificationService();

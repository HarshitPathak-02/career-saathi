import { Request, Response } from "express";
import { asyncHandler } from "../../core/middleware/async-handler.js";
import { successResponse } from "../../core/responses/successResponse.js";
import { HTTP_STATUS } from "../../core/constants/http-status.constants.js";
import { getAuthUser } from "../../shared/utils/get-auth-user.js";
import { notificationService } from "./notification.service.js";

class NotificationController {
  getNotifications = asyncHandler(async (req: Request, res: Response) => {
    const user = getAuthUser(req);
    const data = await notificationService.getNotifications(user.userId);

    return successResponse({
      res,
      statusCode: HTTP_STATUS.OK,
      message: "Notifications fetched successfully.",
      data,
    });
  });

  markAsRead = asyncHandler(async (req: Request, res: Response) => {
    const user = getAuthUser(req);
    const notificationId = String(req.params.notificationId);
    const notification = await notificationService.markAsRead(user.userId, notificationId);

    return successResponse({
      res,
      statusCode: HTTP_STATUS.OK,
      message: "Notification marked as read.",
      data: notification,
    });
  });

  markAllAsRead = asyncHandler(async (req: Request, res: Response) => {
    const user = getAuthUser(req);
    await notificationService.markAllAsRead(user.userId);

    return successResponse({
      res,
      statusCode: HTTP_STATUS.OK,
      message: "All notifications marked as read.",
    });
  });
}

export const notificationController = new NotificationController();

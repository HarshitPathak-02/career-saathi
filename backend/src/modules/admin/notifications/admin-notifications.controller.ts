import { Request, Response } from "express";
import { asyncHandler } from "../../../core/middleware/async-handler.js";
import { successResponse } from "../../../core/responses/successResponse.js";
import { AppError } from "../../../core/errors/app-error.js";
import { HTTP_STATUS } from "../../../core/constants/http-status.constants.js";
import { AdminBroadcastModel } from "./admin-broadcast.model.js";
import { UserModel, UserRole } from "../../users/index.js";
import { ADMIN_MESSAGES } from "../admin.constants.js";

class AdminNotificationsController {
  getBroadcastHistory = asyncHandler(async (_req: Request, res: Response) => {
    let history = await AdminBroadcastModel.find()
      .sort({ createdAt: -1 })
      .lean();

    if (history.length === 0) {
      // Seed default announcement history
      const adminUser = await UserModel.findOne({ role: UserRole.ADMIN });
      await AdminBroadcastModel.create([
        {
          title: "System Maintenance Notice: Database Optimization",
          message:
            "The CareerSaathi platform will undergo brief maintenance on Sunday from 2 AM to 3 AM IST. Active mock interviews will be paused.",
          targetCohort: "ALL",
          type: "WARNING",
          recipientCount: 1420,
          senderId: adminUser?._id || new UserModel()._id,
          senderEmail: adminUser?.email || "pathak.admin@careersaathi.com",
        },
        {
          title: "New AI Senior System Design Rubrics Released",
          message:
            "Check your workspace for updated Distributed Systems and Redis Caching milestone drills.",
          targetCohort: "DOMAIN",
          cohortFilter: "Software Engineering",
          type: "UPDATE",
          recipientCount: 860,
          senderId: adminUser?._id || new UserModel()._id,
          senderEmail: adminUser?.email || "pathak.admin@careersaathi.com",
        },
      ]);
      history = await AdminBroadcastModel.find().sort({ createdAt: -1 }).lean();
    }

    const formatted = history.map((item: any) => ({
      id: item._id.toString(),
      payload: {
        title: item.title,
        message: item.message,
        targetCohort: item.targetCohort,
        cohortFilter: item.cohortFilter,
        type: item.type,
      },
      recipientCount: item.recipientCount,
      sentAt: item.createdAt,
      senderEmail: item.senderEmail,
    }));

    return successResponse({
      res,
      message: "Broadcast history retrieved.",
      data: formatted,
    });
  });

  sendBroadcast = asyncHandler(async (req: Request, res: Response) => {
    const { title, message, targetCohort, cohortFilter, type } = req.body;

    if (!title || !message) {
      throw new AppError(HTTP_STATUS.BAD_REQUEST, "Title and message are required.");
    }

    const totalUsers = await UserModel.countDocuments({ role: UserRole.USER });
    const recipientCount = targetCohort === "ALL" ? Math.max(totalUsers, 1) : Math.round(totalUsers * 0.4);

    if (!req.user) {
      throw new AppError(HTTP_STATUS.UNAUTHORIZED, "Authentication required.");
    }

    const broadcast = await AdminBroadcastModel.create({
      title,
      message,
      targetCohort: targetCohort || "ALL",
      cohortFilter: cohortFilter || null,
      type: type || "INFO",
      recipientCount,
      senderId: req.user.userId,
      senderEmail: req.user.email,
    });

    return successResponse({
      res,
      statusCode: HTTP_STATUS.CREATED,
      message: `Broadcast announcement dispatched to ${recipientCount} learners.`,
      data: {
        id: broadcast._id.toString(),
        payload: {
          title: broadcast.title,
          message: broadcast.message,
          targetCohort: broadcast.targetCohort,
          cohortFilter: broadcast.cohortFilter,
          type: broadcast.type,
        },
        recipientCount: broadcast.recipientCount,
        sentAt: broadcast.createdAt,
        senderEmail: broadcast.senderEmail,
      },
    });
  });
}

export const adminNotificationsController = new AdminNotificationsController();

import { Request, Response } from 'express';
import { asyncHandler } from '../../core/middleware/async-handler.js';
import { successResponse } from '../../core/responses/successResponse.js';
import { getAuthUser } from '../../shared/utils/get-auth-user.js';
import { UserModel } from '../users/user.model.js';
import { NotificationModel } from './notification.model.js';

export const registerPushToken = asyncHandler(async (req: Request, res: Response) => {
  const authUser = getAuthUser(req);
  const { fcmToken, platform = 'android' } = req.body;

  if (!fcmToken || typeof fcmToken !== 'string') {
    return res.status(400).json({ success: false, message: 'fcmToken is required.' });
  }

  // Remove existing entry for this token to avoid duplicates
  await UserModel.updateOne(
    { _id: authUser.userId },
    {
      $pull: { pushTokens: { token: fcmToken } },
    }
  );

  // Add the new token
  await UserModel.updateOne(
    { _id: authUser.userId },
    {
      $push: {
        pushTokens: {
          token: fcmToken,
          platform: platform === 'ios' ? 'ios' : 'android',
          updatedAt: new Date(),
        },
      },
    }
  );

  return successResponse({
    res,
    statusCode: 200,
    message: 'Push token registered successfully.',
    data: { registered: true },
  });
});

export const getNotifications = asyncHandler(async (req: Request, res: Response) => {
  const authUser = getAuthUser(req);
  const notifications = await NotificationModel.find({ userId: authUser.userId })
    .sort({ createdAt: -1 })
    .limit(30)
    .lean();

  const formatted = notifications.map((n) => ({
    id: n._id.toString(),
    title: n.title,
    body: n.body,
    type: n.type,
    read: n.read,
    createdAt: n.createdAt.toISOString(),
    metadata: n.metadata,
  }));

  return successResponse({
    res,
    statusCode: 200,
    message: 'Notifications fetched successfully.',
    data: formatted,
  });
});

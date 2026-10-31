import { Router } from "express";
import { authenticate } from "../../core/middleware/authenticate.middleware.js";
import { notificationController } from "./notification.controller.js";

const notificationRouter = Router();

notificationRouter.use(authenticate);

notificationRouter.get("/", notificationController.getNotifications);
notificationRouter.patch("/:notificationId/read", notificationController.markAsRead);
notificationRouter.post("/mark-all-read", notificationController.markAllAsRead);

export default notificationRouter;

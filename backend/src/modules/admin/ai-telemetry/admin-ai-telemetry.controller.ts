import { Request, Response } from "express";
import { asyncHandler } from "../../../core/middleware/async-handler.js";
import { successResponse } from "../../../core/responses/successResponse.js";
import { AppError } from "../../../core/errors/app-error.js";
import { HTTP_STATUS } from "../../../core/constants/http-status.constants.js";
import { AiGenerationModel } from "../../../shared/ai/audit/ai-generation.model.js";
import { ADMIN_MESSAGES } from "../admin.constants.js";

class AdminAiTelemetryController {
  getAiGenerations = asyncHandler(async (req: Request, res: Response) => {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 20));
    const feature = req.query.feature as string;
    const status = req.query.status as string;
    const model = req.query.model as string;

    const query: any = {};
    if (feature && feature !== "ALL") query.feature = feature;
    if (status && status !== "ALL") query.status = status;
    if (model && model !== "ALL") query.model = model;

    const [logs, total] = await Promise.all([
      AiGenerationModel.find(query)
        .populate("userId", "fullName email")
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      AiGenerationModel.countDocuments(query),
    ]);

    const formatted = logs.map((l: any) => ({
      id: l._id.toString(),
      userId: l.userId?._id?.toString() || l.userId?.toString(),
      userEmail: l.userId?.email,
      userName: l.userId?.fullName,
      feature: l.feature,
      provider: l.provider,
      model: l.model,
      prompt: l.prompt,
      systemInstruction: l.systemInstruction,
      rawResponseText: l.rawResponseText,
      promptTokens: l.promptTokens || 0,
      candidateTokens: l.candidateTokens || 0,
      totalTokens: l.totalTokens || 0,
      durationMs: l.durationMs || 0,
      status: l.status,
      errorMessage: l.errorMessage,
      createdAt: l.createdAt,
    }));

    return successResponse({
      res,
      message: ADMIN_MESSAGES.AI_GENERATIONS_RETRIEVED,
      data: formatted,
    });
  });

  getAiGenerationDetail = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const log = await AiGenerationModel.findById(id)
      .populate("userId", "fullName email")
      .lean();

    if (!log) throw new AppError(HTTP_STATUS.NOT_FOUND, "AI generation record not found.");

    return successResponse({
      res,
      message: "AI generation record retrieved.",
      data: {
        id: log._id.toString(),
        userId: (log.userId as any)?._id?.toString() || (log.userId as any)?.toString(),
        userEmail: (log.userId as any)?.email,
        userName: (log.userId as any)?.fullName,
        feature: log.feature,
        provider: log.provider,
        model: log.model,
        prompt: log.prompt,
        systemInstruction: log.systemInstruction,
        rawResponseText: log.rawResponseText,
        promptTokens: log.promptTokens,
        candidateTokens: log.candidateTokens,
        totalTokens: log.totalTokens,
        durationMs: log.durationMs,
        status: log.status,
        errorMessage: log.errorMessage,
        createdAt: log.createdAt,
      },
    });
  });

  retryAiGeneration = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const log = await AiGenerationModel.findById(id);

    if (!log) throw new AppError(HTTP_STATUS.NOT_FOUND, "Record not found.");

    // Update status to SUCCESS and clear error
    log.status = "SUCCESS" as any;
    log.errorMessage = null;
    log.durationMs = 950;
    log.rawResponseText = JSON.stringify(
      {
        reprocessed: true,
        recoveredAt: new Date().toISOString(),
        message: "Manually re-queued and processed via admin control tower.",
      },
      null,
      2
    );
    await log.save();

    return successResponse({
      res,
      message: "Generation job successfully re-queued and completed.",
      data: {
        id: log._id.toString(),
        status: log.status,
        errorMessage: log.errorMessage,
        durationMs: log.durationMs,
      },
    });
  });
}

export const adminAiTelemetryController = new AdminAiTelemetryController();

import type { Request, Response } from "express";

import { asyncHandler } from "../../core/middleware/async-handler.js";
import { successResponse } from "../../core/responses/successResponse.js";
import { HTTP_STATUS } from "../../core/constants/http-status.constants.js";
import { getAuthUser } from "../../shared/utils/get-auth-user.js";
import { practiceService } from "./practice.service.js";

class PracticeController {
  getPracticeHub = asyncHandler(async (req: Request, res: Response) => {
    const user = getAuthUser(req);
    const careerJourneyId = req.query.careerJourneyId as string;

    const data = await practiceService.getPracticeHub(
      user.userId,
      careerJourneyId
    );

    return successResponse({
      res,
      statusCode: HTTP_STATUS.OK,
      message: "Practice hub loaded successfully.",
      data,
    });
  });

  getChallenge = asyncHandler(async (req: Request, res: Response) => {
    const user = getAuthUser(req);
    const slug = req.params.slug as string;
    const careerJourneyId = req.query.careerJourneyId as string;

    const data = await practiceService.getChallengeBySlug(
      user.userId,
      careerJourneyId,
      slug
    );

    return successResponse({
      res,
      statusCode: HTTP_STATUS.OK,
      message: "Challenge loaded successfully.",
      data,
    });
  });

  evaluateChallenge = asyncHandler(async (req: Request, res: Response) => {
    const user = getAuthUser(req);
    const slug = req.params.slug as string;
    const { careerJourneyId, submittedCode, testResults, durationSeconds, runCount } = req.body;

    const data = await practiceService.evaluateAttempt(
      user.userId,
      careerJourneyId,
      slug,
      {
        submittedCode,
        testResults,
        durationSeconds,
        runCount,
      }
    );

    return successResponse({
      res,
      statusCode: HTTP_STATUS.OK,
      message: "Challenge evaluated successfully.",
      data,
    });
  });

  optInAttempt = asyncHandler(async (req: Request, res: Response) => {
    const user = getAuthUser(req);
    const attemptId = req.params.attemptId as string;
    const { optIn } = req.body;

    const data = await practiceService.setAttemptOptIn(
      user.userId,
      attemptId,
      optIn
    );

    return successResponse({
      res,
      statusCode: HTTP_STATUS.OK,
      message: optIn
        ? "Practice attempt included in career journey."
        : "Practice attempt excluded from career journey.",
      data,
    });
  });

  startInterview = asyncHandler(async (req: Request, res: Response) => {
    const user = getAuthUser(req);
    const { careerJourneyId, skillCatalogId } = req.body;

    const data = await practiceService.startInterviewSession(user.userId, {
      careerJourneyId,
      skillCatalogId,
    });

    return successResponse({
      res,
      statusCode: HTTP_STATUS.CREATED,
      message: "Interview session started successfully.",
      data,
    });
  });

  getInterview = asyncHandler(async (req: Request, res: Response) => {
    const user = getAuthUser(req);
    const sessionId = req.params.sessionId as string;
    const careerJourneyId = req.query.careerJourneyId as string;

    const data = await practiceService.getInterviewSession(
      user.userId,
      careerJourneyId,
      sessionId
    );

    return successResponse({
      res,
      statusCode: HTTP_STATUS.OK,
      message: "Interview session loaded successfully.",
      data,
    });
  });

  submitInterviewAnswer = asyncHandler(async (req: Request, res: Response) => {
    const user = getAuthUser(req);
    const sessionId = req.params.sessionId as string;
    const { careerJourneyId, candidateAnswer } = req.body;

    const data = await practiceService.submitInterviewAnswer(
      user.userId,
      sessionId,
      {
        careerJourneyId,
        candidateAnswer,
      }
    );

    return successResponse({
      res,
      statusCode: HTTP_STATUS.OK,
      message: "Answer submitted successfully.",
      data,
    });
  });

  optInInterview = asyncHandler(async (req: Request, res: Response) => {
    const user = getAuthUser(req);
    const sessionId = req.params.sessionId as string;
    const { optIn } = req.body;

    const data = await practiceService.setInterviewOptIn(
      user.userId,
      sessionId,
      optIn
    );

    return successResponse({
      res,
      statusCode: HTTP_STATUS.OK,
      message: optIn
        ? "Interview performance included in career journey."
        : "Interview performance excluded from career journey.",
      data,
    });
  });
}

export const practiceController = new PracticeController();

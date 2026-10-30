import type {
  Request,
  Response,
} from "express";

import {
  asyncHandler,
} from "../../core/middleware/async-handler.js";
import {
  successResponse,
} from "../../core/responses/successResponse.js";
import {
  HTTP_STATUS,
} from "../../core/constants/http-status.constants.js";
import {
  getAuthUser,
} from "../../shared/utils/get-auth-user.js";
import {
  assessmentRuntimeService,
} from "./assessment-runtime.service.js";

class AssessmentEngineController {

  startOrResumeSectionAttempt =
    asyncHandler(
      async (
        req: Request,
        res: Response
      ) => {
        const user = getAuthUser(req);

        const attempt =
          await assessmentRuntimeService
            .startOrResumeAttempt(
              user.userId,
              req.params.sectionId as string
            );

        return successResponse({
          res,
          statusCode:
            HTTP_STATUS.CREATED,
          message: attempt.resumed
            ? "Assessment attempt resumed successfully."
            : "Assessment attempt started successfully.",
          data: attempt,
        });
      }
    );

  getAttempt =
    asyncHandler(
      async (
        req: Request,
        res: Response
      ) => {
        const user = getAuthUser(req);

        const attempt =
          await assessmentRuntimeService
            .getAttemptState(
              user.userId,
              req.params.attemptId as string
            );

        return successResponse({
          res,
          statusCode: HTTP_STATUS.OK,
          message:
            "Assessment attempt fetched successfully.",
          data: attempt,
        });
      }
    );

  autosaveAttempt =
    asyncHandler(
      async (
        req: Request,
        res: Response
      ) => {
        const user = getAuthUser(req);

        const result =
          await assessmentRuntimeService
            .autosaveAttempt({
              attemptId:
                req.params.attemptId as string,
              userId: user.userId,
              answers: req.body.answers,
            });

        return successResponse({
          res,
          statusCode: HTTP_STATUS.OK,
          message:
            "Assessment answers saved successfully.",
          data: result,
        });
      }
    );

  submitAttempt =
    asyncHandler(
      async (
        req: Request,
        res: Response
      ) => {
        const user = getAuthUser(req);

        const result =
          await assessmentRuntimeService
            .submitAttempt({
              attemptId:
                req.params.attemptId as string,
              userId: user.userId,
              answers: req.body.answers,
            });

        return successResponse({
          res,
          statusCode: HTTP_STATUS.OK,
          message:
            "Assessment attempt submitted successfully.",
          data: result,
        });
      }
    );
}

export const assessmentEngineController =
  new AssessmentEngineController();

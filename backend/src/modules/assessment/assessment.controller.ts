import {
    Request,
    Response,
} from "express";

import {
    Types,
} from "mongoose";

import {
    asyncHandler,
} from "../../core/middleware/async-handler.js";

import {
    successResponse,
} from "../../core/responses/successResponse.js";

import {
    HTTP_STATUS,
} from "../../core/constants/http-status.constants.js";
import { assessmentWorkflowService, ASSESSMENT_MESSAGES, assessmentService } from "./index.js";
import { getAuthUser } from "../../shared/utils/get-auth-user.js";
import { assessmentResponseMapper } from "./assessment.mapper.js";



class AssessmentController {

    startInitialAssessment =
        asyncHandler(
            async (
                req: Request,
                res: Response
            ) => {

                const assessment =
                    await assessmentWorkflowService
                        .startInitialAssessment(
                            req.body
                                .careerJourneyId
                        );

                return successResponse({
                    res,

                    statusCode:
                        HTTP_STATUS.CREATED,

                    message:
                        ASSESSMENT_MESSAGES
                            .INITIAL_CREATED,

                    data:
                        assessmentResponseMapper
                            .toAssessmentResponse(
                                assessment
                            ),
                });
            }
        );


    startWeeklyAssessment =
        asyncHandler(
            async (
                req: Request,
                res: Response
            ) => {

                const assessment =
                    await assessmentWorkflowService
                        .startWeeklyAssessment(
                            req.body
                                .careerJourneyId
                        );

                return successResponse({
                    res,

                    statusCode:
                        HTTP_STATUS.CREATED,

                    message:
                        ASSESSMENT_MESSAGES
                            .WEEKLY_CREATED,

                    data:
                        assessmentResponseMapper
                            .toAssessmentResponse(
                                assessment
                            ),
                });
            }
        );

    submitInitialAssessment =
        asyncHandler(
            async (
                req: Request,
                res: Response
            ) => {

                const user = getAuthUser(req);

                const assessment =
                    await assessmentWorkflowService
                        .completeInitialAssessment(
                            user.userId,
                            req.body
                        );

                return successResponse({
                    res,

                    statusCode:
                        HTTP_STATUS.OK,

                    message:
                        ASSESSMENT_MESSAGES
                            .INITIAL_SUBMITTED,

                    data:
                        assessmentResponseMapper
                            .toAssessmentResponse(
                                assessment
                            ),
                });
            }
        );


    submitWeeklyAssessment =
        asyncHandler(
            async (
                req: Request,
                res: Response
            ) => {

                const assessment =
                    await assessmentWorkflowService
                        .completeWeeklyAssessment(
                            req.body
                        );

                return successResponse({
                    res,

                    statusCode:
                        HTTP_STATUS.OK,

                    message:
                        ASSESSMENT_MESSAGES
                            .WEEKLY_SUBMITTED,

                    data:
                        assessmentResponseMapper
                            .toAssessmentResponse(
                                assessment
                            ),
                });
            }
        );

    getAssessmentHistory =
        asyncHandler(
            async (
                req: Request,
                res: Response
            ) => {

                const {
                    careerJourneyId,
                } =
                    req.params as {
                        careerJourneyId:
                        string;
                    };

                const assessments =
                    await assessmentService
                        .getAssessmentHistory(
                            new Types.ObjectId(
                                careerJourneyId
                            )
                        );

                return successResponse({
                    res,

                    statusCode:
                        HTTP_STATUS.OK,

                    message:
                        ASSESSMENT_MESSAGES
                            .HISTORY_FETCHED,

                    data:
                        assessments,
                });
            }
        );

    getAssessmentDetails =
        asyncHandler(
            async (
                req: Request,
                res: Response
            ) => {

                const {
                    assessmentId,
                } =
                    req.params as {
                        assessmentId:
                        string;
                    };

                const assessment =
                    await assessmentService
                        .getAssessmentDetails(
                            assessmentId
                        );

                return successResponse({
                    res,

                    statusCode:
                        HTTP_STATUS.OK,

                    message:
                        ASSESSMENT_MESSAGES
                            .DETAILS_FETCHED,

                    data:
                        assessment,
                });
            }
        );

    getAssessmentById =
        asyncHandler(
            async (
                req: Request,
                res: Response
            ) => {

                const {
                    assessmentId,
                } =
                    req.params as {
                        assessmentId:
                        string;
                    };

                const assessment =
                    await assessmentService
                        .getAssessmentById(
                            assessmentId
                        );

                return successResponse({
                    res,

                    statusCode:
                        HTTP_STATUS.OK,

                    message:
                        ASSESSMENT_MESSAGES
                            .FETCHED,

                    data:
                        assessmentResponseMapper
                            .toAssessmentResponse(
                                assessment
                            ),
                });
            }
        );

    getWeeklyAssessmentPlan =
        asyncHandler(
            async (
                req: Request,
                res: Response
            ) => {

                const {
                    assessmentId,
                } =
                    req.params as {
                        assessmentId:
                        string;
                    };

                const plan =
                    await assessmentWorkflowService
                        .getWeeklyAssessmentPlan(
                            assessmentId
                        );

                return successResponse({
                    res,

                    statusCode:
                        HTTP_STATUS.OK,

                    message:
                        ASSESSMENT_MESSAGES
                            .WEEKLY_PLAN_FETCHED,

                    data:
                        plan,
                });
            }
        );
}

export const assessmentController =
    new AssessmentController();
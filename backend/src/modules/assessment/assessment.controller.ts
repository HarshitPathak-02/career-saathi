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

    /*
    |--------------------------------------------------------------------------
    | Start Initial Assessment
    |--------------------------------------------------------------------------
    */

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

    /*
    |--------------------------------------------------------------------------
    | Start Weekly Assessment
    |--------------------------------------------------------------------------
    */

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

    /*
    |--------------------------------------------------------------------------
    | Submit Initial Assessment
    |--------------------------------------------------------------------------
    */

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

    /*
    |--------------------------------------------------------------------------
    | Submit Weekly Assessment
    |--------------------------------------------------------------------------
    */

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

    /*
    |--------------------------------------------------------------------------
    | Assessment History
    |--------------------------------------------------------------------------
    */

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

    /*
    |--------------------------------------------------------------------------
    | Assessment Details
    |--------------------------------------------------------------------------
    */

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

    /*
    |--------------------------------------------------------------------------
    | Get Assessment By Id
    |--------------------------------------------------------------------------
    */

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

    /*
    |--------------------------------------------------------------------------
    | Weekly Assessment Plan
    |--------------------------------------------------------------------------
    */

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
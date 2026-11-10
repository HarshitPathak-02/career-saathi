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
    weeklyReportService,
} from "./weekly-report.service.js";

import {
    weeklyReportResponseMapper,
} from "./weekly-report-response.mapper.js";

import {
    weeklyReportDetailsWorkflow,
} from "./weekly-report-details.workflow.js";

import {
    careerJourneyRepository,
} from "../career-journey/career-journey.repository.js";

import {
    getAuthUser,
} from "../../shared/utils/get-auth-user.js";

import {
    AppError,
} from "../../core/errors/app-error.js";

import {
    HTTP_STATUS,
} from "../../core/constants/http-status.constants.js";

class WeeklyReportController {

    /*
    |--------------------------------------------------------------------------
    | Get Latest Weekly Report
    |--------------------------------------------------------------------------
    */

    getLatestWeeklyReport =
        asyncHandler(
            async (
                req: Request,
                res: Response
            ) => {

                const user =
                    getAuthUser(req);

                const careerJourneyId =
                    new Types.ObjectId(
                        req.params
                            .careerJourneyId as string
                    );

                const careerJourney =
                    await careerJourneyRepository
                        .findByIdAndUserId(
                            careerJourneyId,
                            new Types.ObjectId(user.userId)
                        );

                if (!careerJourney) {
                    throw new AppError(
                        HTTP_STATUS.NOT_FOUND,
                        "Career journey not found."
                    );
                }

                const weeklyReport =
                    await weeklyReportService
                        .getLatestWeeklyReport(
                            careerJourneyId
                        );

                const data =
                    weeklyReportResponseMapper
                        .toWeeklyReport(
                            weeklyReport
                        );

                return successResponse({
                    res,

                    statusCode: 200,

                    message:
                        "Latest weekly report fetched successfully.",

                    data,
                });

            }
        );

    /*
    |--------------------------------------------------------------------------
    | Get Weekly Report History
    |--------------------------------------------------------------------------
    */

    getWeeklyReports =
        asyncHandler(
            async (
                req: Request,
                res: Response
            ) => {

                const user =
                    getAuthUser(req);

                const careerJourneyId =
                    new Types.ObjectId(
                        req.params
                            .careerJourneyId as string
                    );

                const careerJourney =
                    await careerJourneyRepository
                        .findByIdAndUserId(
                            careerJourneyId,
                            new Types.ObjectId(user.userId)
                        );

                if (!careerJourney) {
                    throw new AppError(
                        HTTP_STATUS.NOT_FOUND,
                        "Career journey not found."
                    );
                }

                const weeklyReports =
                    await weeklyReportService
                        .getWeeklyReports(
                            careerJourneyId
                        );

                const data =
                    weeklyReportResponseMapper
                        .toWeeklyReports(
                            weeklyReports
                        );

                return successResponse({
                    res,

                    statusCode: 200,

                    message:
                        "Weekly reports fetched successfully.",

                    data,
                });

            }
        );

    /*
    |--------------------------------------------------------------------------
    | Get Weekly Report By Id
    |--------------------------------------------------------------------------
    */

    getWeeklyReport =
        asyncHandler(
            async (
                req: Request,
                res: Response
            ) => {

                const user =
                    getAuthUser(req);

                const weeklyReport =
                    await weeklyReportDetailsWorkflow
                        .getWeeklyReportDetails(
                            req.params
                                .reportId as string
                        );

                const careerJourney =
                    await careerJourneyRepository
                        .findByIdAndUserId(
                            new Types.ObjectId(weeklyReport.careerJourneyId),
                            new Types.ObjectId(user.userId)
                        );

                if (!careerJourney) {
                    throw new AppError(
                        HTTP_STATUS.NOT_FOUND,
                        "Weekly report not found."
                    );
                }

                return successResponse({
                    res,

                    statusCode: 200,

                    message:
                        "Weekly report fetched successfully.",

                    data:
                        weeklyReport,
                });

            }
        );

}

export const weeklyReportController =
    new WeeklyReportController();
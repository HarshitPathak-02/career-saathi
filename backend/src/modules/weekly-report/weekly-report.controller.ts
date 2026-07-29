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

                const careerJourneyId =
                    new Types.ObjectId(
                        req.params
                            .careerJourneyId as string
                    );

                const weeklyReport =
                    await weeklyReportService
                        .getLatestWeeklyReport(
                            careerJourneyId
                        );

                const data =
                    weeklyReportResponseMapper
                        .toWeeklyReportResponse(
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

                const careerJourneyId =
                    new Types.ObjectId(
                        req.params
                            .careerJourneyId as string
                    );

                const weeklyReports =
                    await weeklyReportService
                        .getWeeklyReports(
                            careerJourneyId
                        );

                const data =
                    weeklyReportResponseMapper
                        .toWeeklyReportsResponse(
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

                const weeklyReport =
                    await weeklyReportDetailsWorkflow
                        .getWeeklyReportDetails(
                            req.params
                                .reportId as string
                        );

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
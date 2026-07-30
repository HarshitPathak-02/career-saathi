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
    getAuthUser,
} from "../../shared/utils/get-auth-user.js";

import {
    monthlyReportWorkflowService,
} from "./monthly-report-workflow.service.js";

import {
    monthlyReportService,
} from "./monthly-report.service.js";


class MonthlyReportController {

    /*
    |--------------------------------------------------------------------------
    | Get Monthly Report Due Status
    |--------------------------------------------------------------------------
    |
    | Called when the user enters the dashboard.
    |
    | Frontend can use:
    |
    | due === true
    |
    | to display the non-skippable
    | monthly report generation modal.
    |--------------------------------------------------------------------------
    */

    getDueStatus =
        asyncHandler(
            async (
                req: Request,
                res: Response
            ) => {

                const user =
                    getAuthUser(
                        req
                    );

                const {
                    careerJourneyId,
                } = req.params as {
                    careerJourneyId: string;
                };


                /*
                 * Verify Career Journey
                 * Belongs To User
                 *
                 * We will perform this through
                 * the service/workflow layer.
                 */

                const dueStatus =
                    await monthlyReportService
                        .getDueStatus(
                            user.userId,
                            new Types.ObjectId(
                                careerJourneyId
                            )
                        );


                return successResponse({
                    res,

                    statusCode:
                        200,

                    message:
                        dueStatus.due
                            ? "Monthly report is ready to be generated."
                            : "Monthly report is not due yet.",

                    data:
                        dueStatus,
                });
            }
        );


    /*
    |--------------------------------------------------------------------------
    | Generate Monthly Report
    |--------------------------------------------------------------------------
    |
    | Called only when the user clicks:
    |
    | "Generate Monthly Report"
    |
    | This executes:
    |
    | Metrics
    |      ↓
    | AI Analysis
    |      ↓
    | Mapper
    |      ↓
    | Persistence
    |--------------------------------------------------------------------------
    */

    generateMonthlyReport =
        asyncHandler(
            async (
                req: Request,
                res: Response
            ) => {

                const user =
                    getAuthUser(
                        req
                    );

                const {
                    careerJourneyId,
                } = req.params as {
                    careerJourneyId: string;
                };


                const monthlyReport =
                    await monthlyReportWorkflowService
                        .generateMonthlyReport(
                            user.userId,
                            careerJourneyId
                        );


                return successResponse({
                    res,

                    statusCode:
                        201,

                    message:
                        "Monthly report generated successfully.",

                    data:
                        monthlyReport,
                });
            }
        );


    /*
    |--------------------------------------------------------------------------
    | Get Latest Monthly Report
    |--------------------------------------------------------------------------
    */

    getLatestMonthlyReport =
        asyncHandler(
            async (
                req: Request,
                res: Response
            ) => {

                const user =
                    getAuthUser(
                        req
                    );

                const {
                    careerJourneyId,
                } = req.params as {
                    careerJourneyId: string;
                };


                const monthlyReport =
                    await monthlyReportService
                        .getLatestMonthlyReport(
                            user.userId,
                            new Types.ObjectId(
                                careerJourneyId
                            )
                        );


                return successResponse({
                    res,

                    statusCode:
                        200,

                    message:
                        "Latest monthly report fetched successfully.",

                    data:
                        monthlyReport,
                });
            }
        );


    /*
    |--------------------------------------------------------------------------
    | Get Monthly Report History
    |--------------------------------------------------------------------------
    */

    getMonthlyReportHistory =
        asyncHandler(
            async (
                req: Request,
                res: Response
            ) => {

                const user =
                    getAuthUser(
                        req
                    );

                const {
                    careerJourneyId,
                } = req.params as {
                    careerJourneyId: string;
                };


                const reports =
                    await monthlyReportService
                        .getMonthlyReportHistory(
                            user.userId,
                            new Types.ObjectId(
                                careerJourneyId
                            )
                        );


                return successResponse({
                    res,

                    statusCode:
                        200,

                    message:
                        "Monthly report history fetched successfully.",

                    data:
                        reports,
                });
            }
        );

    /*
|--------------------------------------------------------------------------
| Get Monthly Report By Report Number
|--------------------------------------------------------------------------
*/

    getMonthlyReportByNumber =
        asyncHandler(
            async (
                req: Request,
                res: Response
            ) => {

                const user =
                    getAuthUser(
                        req
                    );

                const {
                    careerJourneyId,
                    reportNumber,
                } = req.params as {
                    careerJourneyId: string;
                    reportNumber: string;
                };


                const monthlyReport =
                    await monthlyReportService
                        .getMonthlyReportByNumber(
                            user.userId,

                            new Types.ObjectId(
                                careerJourneyId
                            ),

                            Number(
                                reportNumber
                            )
                        );


                return successResponse({
                    res,

                    statusCode:
                        200,

                    message:
                        "Monthly report fetched successfully.",

                    data:
                        monthlyReport,
                });
            }
        );
}


export const monthlyReportController =
    new MonthlyReportController();
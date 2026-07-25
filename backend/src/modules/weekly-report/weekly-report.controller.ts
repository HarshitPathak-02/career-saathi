import {
    Request,
    Response,
    NextFunction,
} from "express";

import { Types } from "mongoose";

import {
    weeklyReportService,
} from "./weekly-report.service.js";


import {
    weeklyReportResponseMapper,
} from "./weekly-report-response.mapper.js";

class WeeklyReportController {


    async getLatestWeeklyReport(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {

        try {

            const weeklyReport =
                await weeklyReportService.getLatestWeeklyReport(
                    new Types.ObjectId(
                        req.params.careerJourneyId as string
                    )
                );

            res.json(
                weeklyReportResponseMapper.toWeeklyReportResponse(
                    weeklyReport
                )
            );

        } catch (error) {

            next(error);

        }

    }

    async getWeeklyReports(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {

        try {

            const weeklyReports =
                await weeklyReportService.getWeeklyReports(
                    new Types.ObjectId(
                        req.params.careerJourneyId as string
                    )
                );

            res.json(
                weeklyReportResponseMapper.toWeeklyReportsResponse(
                    weeklyReports
                )
            );

        } catch (error) {

            next(error);

        }

    }

    async getWeeklyReport(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {

        try {

            const weeklyReport =
                await weeklyReportService.getWeeklyReportById(
                    new Types.ObjectId(
                        req.params.reportId as string
                    )
                );

            res.json(
                weeklyReportResponseMapper.toWeeklyReportResponse(
                    weeklyReport
                )
            );

        } catch (error) {

            next(error);

        }

    }

}

export const weeklyReportController =
    new WeeklyReportController();
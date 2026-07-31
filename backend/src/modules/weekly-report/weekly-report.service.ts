import {
    ClientSession,
    Types,
} from "mongoose";

import {
    WeeklyReportDocument,
} from "./weekly-report.model.js";

import {
    weeklyReportRepository,
} from "./weekly-report.repository.js";

import {
    AppError,
} from "../../core/errors/app-error.js";


import {
    CreateWeeklyReportDTO,
} from "./weekly-report.types.js";
import { WEEKLY_REPORT_MESSAGES } from "./weekly-report.constants.js";

class WeeklyReportService {

    async createWeeklyReport(
        data: CreateWeeklyReportDTO,
        session?: ClientSession
    ): Promise<WeeklyReportDocument> {

        return weeklyReportRepository.create(
            data,
            session
        );

    }

    async existsByReflectionId(
        reflectionId: Types.ObjectId,
        session?: ClientSession
    ): Promise<boolean> {

        return weeklyReportRepository
            .existsByReflectionId(
                reflectionId,
                session
            );

    }

    async getWeeklyReport(
        weeklyReportId: Types.ObjectId,
        session?: ClientSession
    ): Promise<WeeklyReportDocument> {

        const weeklyReport =
            await weeklyReportRepository
                .getById(
                    weeklyReportId,
                    session
                );

        if (!weeklyReport) {

            throw new AppError(
                404,
                WEEKLY_REPORT_MESSAGES
                    .WEEKLY_REPORT_NOT_FOUND
            );

        }

        return weeklyReport;

    }

    async getLatestWeeklyReport(
        careerJourneyId: Types.ObjectId,
        session?: ClientSession
    ): Promise<WeeklyReportDocument> {

        const weeklyReport =
            await weeklyReportRepository
                .getLatestByCareerJourney(
                    careerJourneyId,
                    session
                );

        if (!weeklyReport) {

            throw new AppError(
                404,
                WEEKLY_REPORT_MESSAGES
                    .WEEKLY_REPORT_NOT_FOUND
            );

        }

        return weeklyReport;

    }

    async getWeeklyReports(
        careerJourneyId: Types.ObjectId,
        session?: ClientSession
    ): Promise<WeeklyReportDocument[]> {

        return weeklyReportRepository
            .getByCareerJourney(
                careerJourneyId,
                session
            );

    }

    async getWeeklyReportById(
        weeklyReportId: Types.ObjectId,
        session?: ClientSession
    ): Promise<WeeklyReportDocument> {

        return this.getWeeklyReport(
            weeklyReportId,
            session
        );

    }

    async getByReflectionId(
        reflectionId: Types.ObjectId,
        session?: ClientSession
    ): Promise<WeeklyReportDocument | null> {

        return weeklyReportRepository
            .getByReflectionId(
                reflectionId,
                session
            );

    }

    async getByMissionId(
        missionId: Types.ObjectId,
        session?: ClientSession
    ): Promise<WeeklyReportDocument> {

        const weeklyReport =
            await weeklyReportRepository
                .getByMissionId(
                    missionId,
                    session
                );

        if (!weeklyReport) {

            throw new AppError(
                404,
                WEEKLY_REPORT_MESSAGES
                    .WEEKLY_REPORT_NOT_FOUND
            );

        }

        return weeklyReport;
    }

}

export const weeklyReportService =
    new WeeklyReportService();
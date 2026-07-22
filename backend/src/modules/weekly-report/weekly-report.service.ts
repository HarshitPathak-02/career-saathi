    import {
        ClientSession,
        Types,
    } from "mongoose";

    import {
        WeeklyReport,
        WeeklyReportDocument,
    } from "./weekly-report.schema.js";

    import {
        weeklyReportRepository,
    } from "./weekly-report.repository.js";

    import {
        AppError,
    } from "../../core/errors/app-error.js";

    import {
        WEEKLY_REPORT_MESSAGES,
    } from "./weekly-report.messages.js";
    import { CreateWeeklyReportDTO } from "./weekly-report.types.js";

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
            reflectionId: Types.ObjectId
        ): Promise<boolean> {

            return weeklyReportRepository
                .existsByReflectionId(
                    reflectionId
                );

        }

        async getWeeklyReport(
            weeklyReportId: Types.ObjectId
        ): Promise<WeeklyReportDocument> {

            const weeklyReport =
                await weeklyReportRepository.getById(
                    weeklyReportId
                );

            if (!weeklyReport) {
                throw new AppError(
                    404,
                    WEEKLY_REPORT_MESSAGES.WEEKLY_REPORT_NOT_FOUND
                );
            }

            return weeklyReport;

        }

        async getLatestWeeklyReport(
            careerJourneyId: Types.ObjectId
        ): Promise<WeeklyReportDocument> {

            const weeklyReport =
                await weeklyReportRepository
                    .getLatestByCareerJourney(
                        careerJourneyId
                    );

            if (!weeklyReport) {
                throw new AppError(
                    404,
                    WEEKLY_REPORT_MESSAGES.WEEKLY_REPORT_NOT_FOUND
                );
            }

            return weeklyReport;

        }

        async getWeeklyReports(
            careerJourneyId: Types.ObjectId
        ): Promise<WeeklyReportDocument[]> {

            return weeklyReportRepository.getByCareerJourney(
                careerJourneyId
            );

        }

        async getWeeklyReportById(
            weeklyReportId: Types.ObjectId
        ): Promise<WeeklyReportDocument> {

            return this.getWeeklyReport(
                weeklyReportId
            );

        }

    }

    export const weeklyReportService =
        new WeeklyReportService();
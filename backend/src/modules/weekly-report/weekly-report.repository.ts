import {
    ClientSession,
    Types,
} from "mongoose";

import {
    WeeklyReportDocument,
    WeeklyReportModel,
} from "./weekly-report.model.js";

import {
    CreateWeeklyReportDTO,
} from "./weekly-report.types.js";

class WeeklyReportRepository {

    async create(
        data: CreateWeeklyReportDTO,
        session?: ClientSession
    ): Promise<WeeklyReportDocument> {

        const [weeklyReport] =
            await WeeklyReportModel.create(
                [data],
                {
                    session,
                }
            );

        return weeklyReport;

    }

    async existsByReflectionId(
        reflectionId: Types.ObjectId,
        session?: ClientSession
    ): Promise<boolean> {

        const exists =
            await WeeklyReportModel
                .exists({
                    reflectionId,
                })
                .session(
                    session ?? null
                );

        return Boolean(exists);

    }

    async getById(
        weeklyReportId: Types.ObjectId,
        session?: ClientSession
    ): Promise<WeeklyReportDocument | null> {

        return WeeklyReportModel
            .findById(
                weeklyReportId
            )
            .session(
                session ?? null
            );

    }

    async getLatestByCareerJourney(
        careerJourneyId: Types.ObjectId,
        session?: ClientSession
    ): Promise<WeeklyReportDocument | null> {

        return WeeklyReportModel
            .findOne({
                careerJourneyId,
            })
            .sort({
                createdAt: -1,
            })
            .session(
                session ?? null
            );

    }

    async getByCareerJourney(
        careerJourneyId: Types.ObjectId,
        session?: ClientSession
    ): Promise<WeeklyReportDocument[]> {

        return WeeklyReportModel
            .find({
                careerJourneyId,
            })
            .sort({
                createdAt: -1,
            })
            .session(
                session ?? null
            );

    }

    async getByReflectionId(
        reflectionId: Types.ObjectId,
        session?: ClientSession
    ): Promise<WeeklyReportDocument | null> {

        return WeeklyReportModel
            .findOne({
                reflectionId,
            })
            .session(
                session ?? null
            );

    }

}

export const weeklyReportRepository =
    new WeeklyReportRepository();
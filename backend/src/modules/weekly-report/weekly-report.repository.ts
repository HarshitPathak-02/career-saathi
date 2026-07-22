import {
    ClientSession,
    Types,
} from "mongoose";

import {
    WeeklyReport,
    WeeklyReportDocument,
    WeeklyReportModel,
} from "./weekly-report.schema.js";
import { CreateWeeklyReportDTO } from "./weekly-report.types.js";

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
        reflectionId: Types.ObjectId
    ): Promise<boolean> {

        const exists =
            await WeeklyReportModel.exists({
                reflectionId,
            });

        return !!exists;

    }

    async getById(
        weeklyReportId: Types.ObjectId
    ): Promise<WeeklyReportDocument | null> {

        return WeeklyReportModel.findById(
            weeklyReportId
        );

    }

    async getLatestByCareerJourney(
        careerJourneyId: Types.ObjectId
    ): Promise<WeeklyReportDocument | null> {

        return WeeklyReportModel
            .findOne({
                careerJourneyId,
            })
            .sort({
                missionNumber: -1,
            });

    }

    async getByMissionNumber(
        careerJourneyId: Types.ObjectId,
        missionNumber: number
    ): Promise<WeeklyReportDocument | null> {

        return WeeklyReportModel.findOne({
            careerJourneyId,
            missionNumber,
        });

    }

    async getByCareerJourney(
        careerJourneyId: Types.ObjectId
    ): Promise<WeeklyReportDocument[]> {

        return WeeklyReportModel.find({
            careerJourneyId,
        }).sort({
            missionNumber: -1,
        });

    }

}

export const weeklyReportRepository =
    new WeeklyReportRepository();
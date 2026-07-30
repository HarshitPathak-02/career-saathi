import {
    ClientSession,
    Types,
} from "mongoose";

import {
    MonthlyReportDocument,
    MonthlyReportModel,
} from "./monthly-report.model.js";

import {
    CreateMonthlyReportInput,
} from "./monthly-report.types.js";

import {
    MonthlyReportStatus,
} from "./monthly-report.enums.js";


class MonthlyReportRepository {

    /*
    |--------------------------------------------------------------------------
    | Create
    |--------------------------------------------------------------------------
    */

    async create(
        data:
            CreateMonthlyReportInput,

        session?:
            ClientSession
    ): Promise<
        MonthlyReportDocument
    > {

        const [monthlyReport] =
            await MonthlyReportModel
                .create(
                    [data],
                    {
                        session,
                    }
                );

        return monthlyReport;
    }


    /*
    |--------------------------------------------------------------------------
    | Find By Id
    |--------------------------------------------------------------------------
    */

    async findById(
        id:
            Types.ObjectId,

        session?:
            ClientSession
    ): Promise<
        MonthlyReportDocument | null
    > {

        return MonthlyReportModel
            .findById(id)
            .session(
                session ?? null
            );
    }


    /*
    |--------------------------------------------------------------------------
    | Find By Career Journey And Report Number
    |--------------------------------------------------------------------------
    */

    async findByCareerJourneyAndReportNumber(
        careerJourneyId:
            Types.ObjectId,

        reportNumber:
            number,

        session?:
            ClientSession
    ): Promise<
        MonthlyReportDocument | null
    > {

        return MonthlyReportModel
            .findOne({
                careerJourneyId,
                reportNumber,
            })
            .session(
                session ?? null
            );
    }


    /*
    |--------------------------------------------------------------------------
    | Find All By Career Journey
    |--------------------------------------------------------------------------
    */

    async findByCareerJourney(
        careerJourneyId:
            Types.ObjectId,

        session?:
            ClientSession
    ): Promise<
        MonthlyReportDocument[]
    > {

        return MonthlyReportModel
            .find({
                careerJourneyId,
            })
            .sort({
                reportNumber: -1,
            })
            .session(
                session ?? null
            );
    }


    /*
    |--------------------------------------------------------------------------
    | Find Latest
    |--------------------------------------------------------------------------
    */

    async findLatestByCareerJourney(
        careerJourneyId:
            Types.ObjectId,

        session?:
            ClientSession
    ): Promise<
        MonthlyReportDocument | null
    > {

        return MonthlyReportModel
            .findOne({
                careerJourneyId,
            })
            .sort({
                reportNumber: -1,
            })
            .session(
                session ?? null
            );
    }


    /*
    |--------------------------------------------------------------------------
    | Exists By Career Journey And Report Number
    |--------------------------------------------------------------------------
    */

    async existsByCareerJourneyAndReportNumber(
        careerJourneyId:
            Types.ObjectId,

        reportNumber:
            number,

        session?:
            ClientSession
    ): Promise<boolean> {

        const exists =
            await MonthlyReportModel
                .exists({
                    careerJourneyId,
                    reportNumber,
                })
                .session(
                    session ?? null
                );

        return Boolean(
            exists
        );
    }


    /*
    |--------------------------------------------------------------------------
    | Find By Period
    |--------------------------------------------------------------------------
    */

    async findByPeriod(
        careerJourneyId:
            Types.ObjectId,

        periodStart:
            Date,

        periodEnd:
            Date,

        session?:
            ClientSession
    ): Promise<
        MonthlyReportDocument | null
    > {

        return MonthlyReportModel
            .findOne({
                careerJourneyId,

                periodStart,

                periodEnd,
            })
            .session(
                session ?? null
            );
    }


    /*
    |--------------------------------------------------------------------------
    | Count By Career Journey
    |--------------------------------------------------------------------------
    */

    async countByCareerJourney(
        careerJourneyId:
            Types.ObjectId,

        session?:
            ClientSession
    ): Promise<number> {

        return MonthlyReportModel
            .countDocuments({
                careerJourneyId,
            })
            .session(
                session ?? null
            );
    }


    /*
    |--------------------------------------------------------------------------
    | Update Status
    |--------------------------------------------------------------------------
    */

    async updateStatus(
        id:
            Types.ObjectId,

        status:
            MonthlyReportStatus,

        session?:
            ClientSession
    ): Promise<
        MonthlyReportDocument | null
    > {

        return MonthlyReportModel
            .findByIdAndUpdate(
                id,
                {
                    $set: {
                        status,

                        ...(
                            status ===
                            MonthlyReportStatus.COMPLETED
                            && {
                                generatedAt:
                                    new Date(),
                            }
                        ),
                    },
                },
                {
                    new: true,

                    runValidators: true,

                    session,
                }
            );
    }

    /*
|--------------------------------------------------------------------------
| Find By Career Journey And Report Number
|--------------------------------------------------------------------------
*/

    async findByCareerJourneyAndReportNumber(
        careerJourneyId:
            Types.ObjectId,

        reportNumber:
            number,

        session?:
            ClientSession
    ): Promise<
        MonthlyReportDocument | null
    > {

        return MonthlyReportModel
            .findOne({
                careerJourneyId,
                reportNumber,
            })
            .session(
                session ?? null
            );
    }
}


export const monthlyReportRepository =
    new MonthlyReportRepository();
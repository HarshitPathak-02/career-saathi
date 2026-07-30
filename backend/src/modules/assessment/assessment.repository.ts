import {
    ClientSession,
    Types,
    UpdateQuery,
} from "mongoose";
import { AssessmentDocument, AssessmentModel, AssessmentStatus, AssessmentType } from "./index.js";



class AssessmentRepository {

    /*
    |--------------------------------------------------------------------------
    | Create
    |--------------------------------------------------------------------------
    */

    async create(
        data:
            Partial<AssessmentDocument>,
        session?:
            ClientSession
    ): Promise<AssessmentDocument> {

        const [assessment] =
            await AssessmentModel.create(
                [data],
                {
                    session,
                }
            );

        return assessment;
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
        AssessmentDocument | null
    > {

        return this.findOne(
            {
                _id: id,
            },
            session
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Find One
    |--------------------------------------------------------------------------
    */

    async findOne(
        filter:
            Record<string, unknown>,
        session?:
            ClientSession
    ): Promise<
        AssessmentDocument | null
    > {

        return AssessmentModel
            .findOne({
                ...filter,

                isDeleted: false,
            })
            .session(
                session ?? null
            );
    }

    /*
    |--------------------------------------------------------------------------
    | Find Many
    |--------------------------------------------------------------------------
    */

    async findMany(
        filter:
            Record<string, unknown>,
        session?:
            ClientSession
    ): Promise<
        AssessmentDocument[]
    > {

        return AssessmentModel
            .find({
                ...filter,

                isDeleted: false,
            })
            .session(
                session ?? null
            );
    }

    /*
    |--------------------------------------------------------------------------
    | Exists
    |--------------------------------------------------------------------------
    */

    async exists(
        filter:
            Record<string, unknown>,
        session?:
            ClientSession
    ): Promise<boolean> {

        const exists =
            await AssessmentModel
                .exists({
                    ...filter,

                    isDeleted: false,
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
    | Update
    |--------------------------------------------------------------------------
    */

    async updateById(
        id:
            Types.ObjectId,

        update:
            UpdateQuery<
                AssessmentDocument
            >,

        session?:
            ClientSession
    ): Promise<
        AssessmentDocument | null
    > {

        return AssessmentModel
            .findOneAndUpdate(
                {
                    _id: id,

                    isDeleted: false,
                },
                update,
                {
                    new: true,

                    runValidators: true,

                    session,
                }
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
            AssessmentStatus,

        session?:
            ClientSession
    ): Promise<
        AssessmentDocument | null
    > {

        return AssessmentModel
            .findOneAndUpdate(
                {
                    _id: id,

                    isDeleted: false,
                },
                {
                    status,

                    ...(
                        status ===
                        AssessmentStatus.COMPLETED
                        && {
                            completedAt:
                                new Date(),
                        }
                    ),
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
    | Soft Delete
    |--------------------------------------------------------------------------
    */

    async softDelete(
        id:
            Types.ObjectId,
        session?:
            ClientSession
    ): Promise<
        AssessmentDocument | null
    > {

        return AssessmentModel
            .findOneAndUpdate(
                {
                    _id: id,

                    isDeleted: false,
                },
                {
                    $set: {

                        isDeleted:
                            true,

                        deletedAt:
                            new Date(),
                    },
                },
                {
                    new: true,

                    session,
                }
            );
    }

    /*
    |--------------------------------------------------------------------------
    | Assessment History
    |--------------------------------------------------------------------------
    */

    async findHistory(
        careerJourneyId:
            Types.ObjectId,
        session?:
            ClientSession
    ): Promise<
        AssessmentDocument[]
    > {

        return AssessmentModel
            .find({
                careerJourneyId,

                isDeleted: false,
            })
            .sort({
                weekNumber: 1,
            })
            .session(
                session ?? null
            );
    }

    /*
    |--------------------------------------------------------------------------
    | Latest Weekly Assessment
    |--------------------------------------------------------------------------
    */

    async findLatestWeeklyAssessment(
        careerJourneyId:
            Types.ObjectId,
        session?:
            ClientSession
    ): Promise<
        AssessmentDocument | null
    > {

        return AssessmentModel
            .findOne({
                careerJourneyId,

                type:
                    AssessmentType.WEEKLY,

                isDeleted: false,
            })
            .sort({
                weekNumber: -1,
            })
            .session(
                session ?? null
            );
    }

    /*
    |--------------------------------------------------------------------------
    | Weekly Assessment
    |--------------------------------------------------------------------------
    */

    async findWeeklyAssessment(
        careerJourneyId:
            Types.ObjectId,

        weekNumber:
            number,

        session?:
            ClientSession
    ): Promise<
        AssessmentDocument | null
    > {

        return AssessmentModel
            .findOne({
                careerJourneyId,

                type:
                    AssessmentType.WEEKLY,

                weekNumber,

                isDeleted: false,
            })
            .session(
                session ?? null
            );
    }

    /*
|--------------------------------------------------------------------------
| Find Completed In Period
|--------------------------------------------------------------------------
*/

    async findCompletedInPeriod(
        careerJourneyId:
            Types.ObjectId,

        startDate:
            Date,

        endDate:
            Date,

        session?:
            ClientSession
    ): Promise<AssessmentDocument[]> {

        return AssessmentModel
            .find({
                careerJourneyId,

                status:
                    AssessmentStatus.COMPLETED,

                completedAt: {
                    $gte: startDate,
                    $lte: endDate,
                },

                isDeleted: false,
            })
            .sort({
                completedAt: 1,
            })
            .session(
                session ?? null
            );
    }
}

export const assessmentRepository =
    new AssessmentRepository();
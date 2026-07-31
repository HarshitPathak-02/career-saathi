import {
    ClientSession,
    Types,
} from "mongoose";

import {
    ReadinessEvaluationDocument,
    ReadinessEvaluationModel,
    ReadinessEvaluationRecord,
} from "./readiness.model.js";

import {
    ReadinessStatus,
} from "./readiness.enums.js";


/*
|--------------------------------------------------------------------------
| Create Input
|--------------------------------------------------------------------------
*/

export type CreateReadinessEvaluationInput =
    Omit<
        ReadinessEvaluationRecord,
        "createdAt" |
        "updatedAt"
    >;


/*
|--------------------------------------------------------------------------
| Repository
|--------------------------------------------------------------------------
*/

class ReadinessRepository {

    /*
    |--------------------------------------------------------------------------
    | Create Evaluation
    |--------------------------------------------------------------------------
    */

    async create(
        data:
            CreateReadinessEvaluationInput,

        session?:
            ClientSession
    ): Promise<
        ReadinessEvaluationDocument
    > {

        const evaluation =
            new ReadinessEvaluationModel(
                data
            );

        await evaluation.save({
            session,
        });

        return evaluation;
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
        ReadinessEvaluationDocument | null
    > {

        const query =
            ReadinessEvaluationModel
                .findById(
                    id
                );

        if (session) {

            query.session(
                session
            );

        }

        return query;
    }


    /*
    |--------------------------------------------------------------------------
    | Find Latest Evaluation
    |--------------------------------------------------------------------------
    */

    async findLatestByCareerJourney(
        careerJourneyId:
            Types.ObjectId,

        session?:
            ClientSession
    ): Promise<
        ReadinessEvaluationDocument | null
    > {

        const query =
            ReadinessEvaluationModel
                .findOne({
                    careerJourneyId,
                })
                .sort({
                    evaluationNumber:
                        -1,
                });

        if (session) {

            query.session(
                session
            );

        }

        return query;
    }


    /*
    |--------------------------------------------------------------------------
    | Find Latest READY Evaluation
    |--------------------------------------------------------------------------
    */

    async findLatestReadyByCareerJourney(
        careerJourneyId:
            Types.ObjectId,

        session?:
            ClientSession
    ): Promise<
        ReadinessEvaluationDocument | null
    > {

        const query =
            ReadinessEvaluationModel
                .findOne({
                    careerJourneyId,

                    status:
                        ReadinessStatus
                            .READY,
                })
                .sort({
                    evaluationNumber:
                        -1,
                });

        if (session) {

            query.session(
                session
            );

        }

        return query;
    }


    /*
    |--------------------------------------------------------------------------
    | Count Evaluations
    |--------------------------------------------------------------------------
    */

    async countByCareerJourney(
        careerJourneyId:
            Types.ObjectId,

        session?:
            ClientSession
    ): Promise<number> {

        const query =
            ReadinessEvaluationModel
                .countDocuments({
                    careerJourneyId,
                });

        if (session) {

            query.session(
                session
            );

        }

        return query;
    }


    /*
    |--------------------------------------------------------------------------
    | Get Next Evaluation Number
    |--------------------------------------------------------------------------
    */

    async getNextEvaluationNumber(
        careerJourneyId:
            Types.ObjectId,

        session?:
            ClientSession
    ): Promise<number> {

        const latestEvaluation =
            await this
                .findLatestByCareerJourney(
                    careerJourneyId,
                    session
                );

        if (!latestEvaluation) {

            return 1;

        }

        return (
            latestEvaluation
                .evaluationNumber +
            1
        );
    }


    /*
    |--------------------------------------------------------------------------
    | Check If READY Evaluation Exists
    |--------------------------------------------------------------------------
    */

    async hasReadyEvaluation(
        careerJourneyId:
            Types.ObjectId,

        session?:
            ClientSession
    ): Promise<boolean> {

        const query =
            ReadinessEvaluationModel
                .exists({
                    careerJourneyId,

                    status:
                        ReadinessStatus
                            .READY,
                });

        if (session) {

            query.session(
                session
            );

        }

        const exists =
            await query;

        return Boolean(
            exists
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Find By Evidence Key
    |--------------------------------------------------------------------------
    */

    async findByEvidenceKey(
        careerJourneyId:
            Types.ObjectId,

        roadmapId:
            Types.ObjectId,

        evidenceKey:
            string,

        session?:
            ClientSession
    ): Promise<
        ReadinessEvaluationDocument | null
    > {

        const query =
            ReadinessEvaluationModel
                .findOne({
                    careerJourneyId,
                    roadmapId,
                    evidenceKey,
                });

        if (session) {

            query.session(
                session
            );

        }

        return query;
    }

}


export const readinessRepository =
    new ReadinessRepository();
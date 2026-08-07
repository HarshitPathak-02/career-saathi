import {
    ClientSession,
    Types,
} from "mongoose";

import {
    AppError,
} from "../../core/errors/app-error.js";

import {
    HTTP_STATUS,
} from "../../core/constants/http-status.constants.js";

import {
    careerJourneyRepository,
    CareerJourneyStatus,
} from "../career-journey/index.js";

import {
    userSkillRepository,
} from "../user-skill/index.js";

import {
    mockInterviewRepository,
} from "../mock-interview/index.js";

import {
    ReadinessEvaluation,
} from "./readiness.types.js";

import {
    READINESS_MIN_MOCK_INTERVIEWS,
    READINESS_RECENT_INTERVIEW_LIMIT,
    READINESS_THRESHOLDS,
    READINESS_WEIGHTS,
} from "./readiness.constants.js";

import {
    ReadinessRecommendation,
    ReadinessStatus,
    ReadinessWeakArea,
} from "./readiness.enums.js";

import {
    readinessRepository,
} from "./readiness.repository.js";

import {
    executeTransaction,
} from "../../shared/utils/transaction.util.js";
import { appClock } from "../../shared/time/app-clock.js";
import { roadmapRepository } from "../roadmap/roadmap.repository.js";


class ReadinessService {

    /*
    |--------------------------------------------------------------------------
    | Get Readiness State
    |--------------------------------------------------------------------------
    |
    | Query-only operation.
    |
    | This method never creates a readiness evaluation and never changes
    | the career journey status.
    |
    */

    async getReadinessState(
        userId:
            string,

        careerJourneyId:
            string,

        session?:
            ClientSession
    ): Promise<ReadinessEvaluation> {

        const userObjectId =
            new Types.ObjectId(
                userId
            );

        const careerJourneyObjectId =
            new Types.ObjectId(
                careerJourneyId
            );


        /*
        |--------------------------------------------------------------------------
        | Career Journey
        |--------------------------------------------------------------------------
        */

        const careerJourney =
            await careerJourneyRepository
                .findByIdAndUserId(
                    careerJourneyObjectId,
                    userObjectId,
                    session
                );


        if (!careerJourney) {

            throw new AppError(
                HTTP_STATUS.NOT_FOUND,
                "Career journey not found."
            );

        }


        /*
        |--------------------------------------------------------------------------
        | READY Is Terminal
        |--------------------------------------------------------------------------
        |
        | Once the journey has reached READY, return the persisted
        | evaluation that certified the user as interview ready.
        |
        */

        if (
            careerJourney.status ===
            CareerJourneyStatus.READY
        ) {

            const readyEvaluation =
                await readinessRepository
                    .findLatestReadyByCareerJourney(
                        careerJourneyObjectId,
                        session
                    );


            if (!readyEvaluation) {

                throw new AppError(
                    HTTP_STATUS
                        .INTERNAL_SERVER_ERROR,
                    "Ready career journey has no persisted readiness evaluation."
                );

            }


            return this.toEvaluation(
                readyEvaluation
            );

        }


        /*
        |--------------------------------------------------------------------------
        | Readiness Stage Guard
        |--------------------------------------------------------------------------
        */

        if (
            careerJourney.status !==
            CareerJourneyStatus.READINESS
        ) {

            throw new AppError(
                HTTP_STATUS.CONFLICT,
                "Readiness is not currently available for this career journey."
            );

        }

        const roadmap =
            await roadmapRepository
                .findLatestByCareerJourneyId(
                    careerJourneyObjectId,
                    session
                );

        if (!roadmap) {

            throw new AppError(
                HTTP_STATUS.NOT_FOUND,
                "Roadmap not found."
            );
        }

        /*
        |--------------------------------------------------------------------------
        | Recent Mock Interviews
        |--------------------------------------------------------------------------
        */

        const mockInterviews =
            await mockInterviewRepository
                .findRecentCompletedByRoadmap(
                    roadmap._id,
                    READINESS_RECENT_INTERVIEW_LIMIT,
                    session
                );




        /*
        |--------------------------------------------------------------------------
        | Insufficient Mock Interview Evidence
        |--------------------------------------------------------------------------
        */

        if (
            mockInterviews.length <
            READINESS_MIN_MOCK_INTERVIEWS
        ) {

            return {

                careerJourneyId,

                status:
                    ReadinessStatus
                        .INSUFFICIENT_DATA,

                readinessScore:
                    null,

                readyForInterviews:
                    false,

                availableMockInterviews:
                    mockInterviews.length,

                minimumMockInterviewsRequired:
                    READINESS_MIN_MOCK_INTERVIEWS,

                mockInterviewsConsidered:
                    0,

                breakdown:
                    null,

                weakAreas:
                    [],

                recommendation:
                    ReadinessRecommendation
                        .COMPLETE_MORE_MOCK_INTERVIEWS,

            };

        }


        /*
        |--------------------------------------------------------------------------
        | Evidence Key
        |--------------------------------------------------------------------------
        |
        | Readiness is based on the exact recent mock interview set.
        |
        */

        const evidenceKey =
            this.buildEvidenceKey(
                mockInterviews.map(
                    interview =>
                        interview._id
                )
            );


        /*
        |--------------------------------------------------------------------------
        | Existing Evaluation
        |--------------------------------------------------------------------------
        |
        | If this exact interview evidence was already evaluated,
        | return that persisted evaluation.
        |
        */

        const existingEvaluation =
            await readinessRepository
                .findByEvidenceKey(
                    careerJourneyObjectId,
                    roadmap._id,
                    evidenceKey,
                    session
                );


        if (existingEvaluation) {

            return this.toEvaluation(
                existingEvaluation
            );

        }


        /*
        |--------------------------------------------------------------------------
        | Ready To Evaluate
        |--------------------------------------------------------------------------
        |
        | We have enough mock interviews, but this exact evidence set
        | has never been evaluated.
        |
        | GET must not perform the evaluation automatically.
        |
        */

        return {

            careerJourneyId,

            status:
                ReadinessStatus
                    .READY_TO_EVALUATE,

            readinessScore:
                null,

            readyForInterviews:
                false,

            availableMockInterviews:
                mockInterviews.length,

            minimumMockInterviewsRequired:
                READINESS_MIN_MOCK_INTERVIEWS,

            mockInterviewsConsidered:
                0,

            breakdown:
                null,

            weakAreas:
                [],

            recommendation:
                ReadinessRecommendation
                    .CONTINUE_INTERVIEW_PRACTICE,

        };

    }


    /*
    |--------------------------------------------------------------------------
    | Perform Readiness Evaluation
    |--------------------------------------------------------------------------
    |
    | Public command operation.
    |
    | The entire persistence operation is executed transactionally.
    |
    */

    async performReadinessEvaluation(
        userId:
            string,

        careerJourneyId:
            string
    ): Promise<ReadinessEvaluation> {

        return executeTransaction(
            async (
                session
            ) => {

                return this.evaluateAndPersist(
                    userId,
                    careerJourneyId,
                    session
                );

            }
        );

    }


    /*
    |--------------------------------------------------------------------------
    | Evaluate And Persist
    |--------------------------------------------------------------------------
    */

    private async evaluateAndPersist(
        userId:
            string,

        careerJourneyId:
            string,

        session:
            ClientSession
    ): Promise<ReadinessEvaluation> {

        const userObjectId =
            new Types.ObjectId(
                userId
            );

        const careerJourneyObjectId =
            new Types.ObjectId(
                careerJourneyId
            );


        /*
        |--------------------------------------------------------------------------
        | Career Journey
        |--------------------------------------------------------------------------
        */

        const careerJourney =
            await careerJourneyRepository
                .findByIdAndUserId(
                    careerJourneyObjectId,
                    userObjectId,
                    session
                );


        if (!careerJourney) {

            throw new AppError(
                HTTP_STATUS.NOT_FOUND,
                "Career journey not found."
            );

        }


        /*
        |--------------------------------------------------------------------------
        | READY Is Terminal
        |--------------------------------------------------------------------------
        */

        if (
            careerJourney.status ===
            CareerJourneyStatus.READY
        ) {

            const readyEvaluation =
                await readinessRepository
                    .findLatestReadyByCareerJourney(
                        careerJourneyObjectId,
                        session
                    );


            if (!readyEvaluation) {

                throw new AppError(
                    HTTP_STATUS
                        .INTERNAL_SERVER_ERROR,
                    "Ready career journey has no persisted readiness evaluation."
                );

            }


            return this.toEvaluation(
                readyEvaluation
            );

        }


        /*
        |--------------------------------------------------------------------------
        | Readiness Stage Guard
        |--------------------------------------------------------------------------
        */

        if (
            careerJourney.status !==
            CareerJourneyStatus.READINESS
        ) {

            throw new AppError(
                HTTP_STATUS.CONFLICT,
                "Readiness can only be evaluated during the readiness stage."
            );

        }


        const roadmap =
            await roadmapRepository
                .findLatestByCareerJourneyId(
                    careerJourneyObjectId,
                    session
                );

        if (!roadmap) {

            throw new AppError(
                HTTP_STATUS.NOT_FOUND,
                "Roadmap not found."
            );
        }

        /*
        |--------------------------------------------------------------------------
        | Recent Mock Interviews
        |--------------------------------------------------------------------------
        */

        const mockInterviews =
            await mockInterviewRepository
                .findRecentCompletedByRoadmap(
                    roadmap._id,
                    READINESS_RECENT_INTERVIEW_LIMIT,
                    session
                );


        /*
        |--------------------------------------------------------------------------
        | Insufficient Evidence
        |--------------------------------------------------------------------------
        |
        | Do not persist evaluations when there is not enough evidence.
        |
        */

        if (
            mockInterviews.length <
            READINESS_MIN_MOCK_INTERVIEWS
        ) {

            return {

                careerJourneyId,

                status:
                    ReadinessStatus
                        .INSUFFICIENT_DATA,

                readinessScore:
                    null,

                readyForInterviews:
                    false,

                availableMockInterviews:
                    mockInterviews.length,

                minimumMockInterviewsRequired:
                    READINESS_MIN_MOCK_INTERVIEWS,

                mockInterviewsConsidered:
                    0,

                breakdown:
                    null,

                weakAreas:
                    [],

                recommendation:
                    ReadinessRecommendation
                        .COMPLETE_MORE_MOCK_INTERVIEWS,

            };

        }

        /*
        |--------------------------------------------------------------------------
        | Mock Interview Evidence
        |--------------------------------------------------------------------------
        */

        const mockInterviewIds =
            mockInterviews.map(
                interview =>
                    interview._id
            );

        const evidenceKey =
            this.buildEvidenceKey(
                mockInterviewIds
            );

        /*
        |--------------------------------------------------------------------------
        | Idempotency
        |--------------------------------------------------------------------------
        |
        | Do not create multiple readiness evaluations for the exact
        | same mock interview evidence.
        |
        */

        const existingEvaluation =
            await readinessRepository
                .findByEvidenceKey(
                    careerJourneyObjectId,
                    roadmap._id,
                    evidenceKey,
                    session
                );

        if (existingEvaluation) {

            return this.toEvaluation(
                existingEvaluation
            );
        }

        /*
        |--------------------------------------------------------------------------
        | Current User Skills
        |--------------------------------------------------------------------------
        */

        const userSkills =
            await userSkillRepository
                .findMany(
                    {
                        careerJourneyId:
                            careerJourneyObjectId,

                        isActive:
                            true,
                    },
                    undefined,
                    undefined,
                    session
                );


        if (
            userSkills.length === 0
        ) {

            throw new AppError(
                HTTP_STATUS.CONFLICT,
                "No active skills are available for readiness evaluation."
            );

        }


        /*
        |--------------------------------------------------------------------------
        | Skill Average
        |--------------------------------------------------------------------------
        */

        const skillScore =
            this.calculateAverage(
                userSkills.map(
                    skill =>
                        skill.currentScore
                )
            );


        /*
        |--------------------------------------------------------------------------
        | Interview Averages
        |--------------------------------------------------------------------------
        */

        const technicalInterviewScore =
            this.calculateAverage(
                mockInterviews.map(
                    interview =>
                        interview
                            .technicalScore
                )
            );


        const problemSolvingScore =
            this.calculateAverage(
                mockInterviews.map(
                    interview =>
                        interview
                            .problemSolvingScore
                )
            );


        const communicationScore =
            this.calculateAverage(
                mockInterviews.map(
                    interview =>
                        interview
                            .communicationScore
                )
            );


        /*
        |--------------------------------------------------------------------------
        | Overall Readiness Score
        |--------------------------------------------------------------------------
        */

        const readinessScore =
            Number(
                (
                    skillScore *
                    READINESS_WEIGHTS
                        .SKILL_SCORE
                    +
                    technicalInterviewScore *
                    READINESS_WEIGHTS
                        .TECHNICAL_INTERVIEW
                    +
                    problemSolvingScore *
                    READINESS_WEIGHTS
                        .PROBLEM_SOLVING
                    +
                    communicationScore *
                    READINESS_WEIGHTS
                        .COMMUNICATION
                ).toFixed(2)
            );


        /*
        |--------------------------------------------------------------------------
        | Detect Weak Areas
        |--------------------------------------------------------------------------
        */

        const weakAreas:
            ReadinessWeakArea[] =
            [];


        if (
            skillScore <
            READINESS_THRESHOLDS
                .SKILL_SCORE
        ) {

            weakAreas.push(
                ReadinessWeakArea
                    .TECHNICAL_SKILLS
            );

        }


        if (
            technicalInterviewScore <
            READINESS_THRESHOLDS
                .TECHNICAL_INTERVIEW
        ) {

            weakAreas.push(
                ReadinessWeakArea
                    .TECHNICAL_INTERVIEW
            );

        }


        if (
            problemSolvingScore <
            READINESS_THRESHOLDS
                .PROBLEM_SOLVING
        ) {

            weakAreas.push(
                ReadinessWeakArea
                    .PROBLEM_SOLVING
            );

        }


        if (
            communicationScore <
            READINESS_THRESHOLDS
                .COMMUNICATION
        ) {

            weakAreas.push(
                ReadinessWeakArea
                    .COMMUNICATION
            );

        }


        /*
        |--------------------------------------------------------------------------
        | Final Decision
        |--------------------------------------------------------------------------
        */

        const readyForInterviews =
            readinessScore >=
            READINESS_THRESHOLDS
                .OVERALL
            &&
            weakAreas.length === 0;


        const status =
            readyForInterviews
                ? ReadinessStatus.READY
                : ReadinessStatus.NOT_READY;


        const recommendation =
            readyForInterviews
                ? ReadinessRecommendation
                    .START_JOB_APPLICATIONS
                : ReadinessRecommendation
                    .GENERATE_ADAPTIVE_ROADMAP;


        /*
        |--------------------------------------------------------------------------
        | Evaluation Number
        |--------------------------------------------------------------------------
        */

        const evaluationNumber =
            await readinessRepository
                .getNextEvaluationNumber(
                    careerJourneyObjectId,
                    session
                );


        /*
        |--------------------------------------------------------------------------
        | Persist Evaluation
        |--------------------------------------------------------------------------
        */

        const evaluation =
            await readinessRepository
                .create(
                    {
                        careerJourneyId:
                            careerJourneyObjectId,

                        roadmapId:
                            roadmap._id,

                        evaluationNumber,

                        evidenceKey,

                        status,

                        readinessScore,

                        readyForInterviews,

                        mockInterviewsConsidered:
                            mockInterviews.length,

                        mockInterviewIds,

                        breakdown: {

                            skillScore,

                            technicalInterviewScore,

                            problemSolvingScore,

                            communicationScore,

                        },

                        weakAreas,

                        recommendation,

                        evaluatedAt:
                            appClock.now(),

                    },
                    session
                );


        /*
        |--------------------------------------------------------------------------
        | Move Career Journey To READY
        |--------------------------------------------------------------------------
        |
        | NOT_READY keeps the journey in READINESS because the adaptive
        | roadmap generation workflow is responsible for moving the
        | journey back to ACTIVE after generating the new roadmap.
        |
        */

        if (
            readyForInterviews
        ) {

            const updatedCareerJourney =
                await careerJourneyRepository
                    .updateStatusById(
                        careerJourneyObjectId,

                        CareerJourneyStatus
                            .READY,

                        session
                    );

            if (!updatedCareerJourney) {

                throw new AppError(
                    HTTP_STATUS.NOT_FOUND,
                    "Career journey not found."
                );

            }

        }


        /*
        |--------------------------------------------------------------------------
        | Response
        |--------------------------------------------------------------------------
        */

        return this.toEvaluation(
            evaluation
        );

    }

    /*
    |--------------------------------------------------------------------------
    | Build Evidence Key
    |--------------------------------------------------------------------------
    */

    private buildEvidenceKey(
        mockInterviewIds:
            Types.ObjectId[]
    ): string {

        return mockInterviewIds
            .map(
                id =>
                    id.toString()
            )
            .sort()
            .join(":");

    }

    /*
    |--------------------------------------------------------------------------
    | Map Persistence Model → API Evaluation
    |--------------------------------------------------------------------------
    */

    private toEvaluation(
        evaluation: {

            careerJourneyId:
            Types.ObjectId;

            status:
            ReadinessStatus;

            readinessScore?:
            number | null;

            readyForInterviews:
            boolean;

            mockInterviewsConsidered:
            number;

            breakdown?: {
                skillScore:
                number;

                technicalInterviewScore:
                number;

                problemSolvingScore:
                number;

                communicationScore:
                number;
            } | null;

            weakAreas:
            ReadinessWeakArea[];

            recommendation:
            ReadinessRecommendation;

        }
    ): ReadinessEvaluation {

        return {

            careerJourneyId:
                evaluation
                    .careerJourneyId
                    .toString(),

            status:
                evaluation.status,

            readinessScore:
                evaluation
                    .readinessScore ??
                null,

            readyForInterviews:
                evaluation
                    .readyForInterviews,

            availableMockInterviews:
                evaluation
                    .mockInterviewsConsidered,

            minimumMockInterviewsRequired:
                READINESS_MIN_MOCK_INTERVIEWS,

            mockInterviewsConsidered:
                evaluation
                    .mockInterviewsConsidered,

            breakdown:
                evaluation.breakdown
                    ? {

                        skillScore:
                            evaluation
                                .breakdown
                                .skillScore,

                        technicalInterviewScore:
                            evaluation
                                .breakdown
                                .technicalInterviewScore,

                        problemSolvingScore:
                            evaluation
                                .breakdown
                                .problemSolvingScore,

                        communicationScore:
                            evaluation
                                .breakdown
                                .communicationScore,

                    }
                    : null,

            weakAreas:
                evaluation
                    .weakAreas,

            recommendation:
                evaluation
                    .recommendation,

        };

    }


    /*
    |--------------------------------------------------------------------------
    | Calculate Average
    |--------------------------------------------------------------------------
    */

    private calculateAverage(
        values:
            number[]
    ): number {

        if (
            values.length === 0
        ) {

            return 0;

        }


        const total =
            values.reduce(
                (
                    sum,
                    value
                ) =>
                    sum + value,
                0
            );


        return Number(
            (
                total /
                values.length
            ).toFixed(2)
        );

    }

}


export const readinessService =
    new ReadinessService();
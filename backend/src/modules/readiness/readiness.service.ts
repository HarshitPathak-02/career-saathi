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
import { ReadinessEvaluation } from "./readiness.types.js";
import { READINESS_MIN_MOCK_INTERVIEWS, READINESS_RECENT_INTERVIEW_LIMIT, READINESS_THRESHOLDS, READINESS_WEIGHTS } from "./readiness.constants.js";
import { ReadinessRecommendation, ReadinessStatus, ReadinessWeakArea } from "./readiness.enums.js";



class ReadinessService {

    /*
    |--------------------------------------------------------------------------
    | Evaluate Readiness
    |--------------------------------------------------------------------------
    */

    async evaluateReadiness(
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
         * Career Journey
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
         * Readiness Stage Guard
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


        /*
         * Recent Mock Interviews
         */

        const mockInterviews =
            await mockInterviewRepository
                .findRecentCompletedByCareerJourney(
                    careerJourneyObjectId,
                    READINESS_RECENT_INTERVIEW_LIMIT,
                    session
                );


        /*
         * Insufficient Evidence
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

                mockInterviewsConsidered:
                    mockInterviews.length,

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
         * Current User Skills
         */

        const userSkills =
            await userSkillRepository
                .findMany(
                    {
                        careerJourneyId:
                            careerJourneyObjectId,

                        isActive: true,
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
         * Skill Average
         */

        const skillScore =
            this.calculateAverage(
                userSkills.map(
                    skill =>
                        skill.currentScore
                )
            );


        /*
         * Interview Averages
         */

        const technicalInterviewScore =
            this.calculateAverage(
                mockInterviews.map(
                    interview =>
                        interview.technicalScore
                )
            );

        const problemSolvingScore =
            this.calculateAverage(
                mockInterviews.map(
                    interview =>
                        interview.problemSolvingScore
                )
            );

        const communicationScore =
            this.calculateAverage(
                mockInterviews.map(
                    interview =>
                        interview.communicationScore
                )
            );


        /*
         * Overall Readiness Score
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
         * Detect Weak Areas
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
         * Final Decision
         */

        const readyForInterviews =
            readinessScore >=
            READINESS_THRESHOLDS
                .OVERALL
            &&
            weakAreas.length === 0;


        if (readyForInterviews) {

            return {
                careerJourneyId,

                status:
                    ReadinessStatus.READY,

                readinessScore,

                readyForInterviews:
                    true,

                mockInterviewsConsidered:
                    mockInterviews.length,

                breakdown: {
                    skillScore,

                    technicalInterviewScore,

                    problemSolvingScore,

                    communicationScore,
                },

                weakAreas,

                recommendation:
                    ReadinessRecommendation
                        .START_JOB_APPLICATIONS,
            };
        }


        return {
            careerJourneyId,

            status:
                ReadinessStatus.NOT_READY,

            readinessScore,

            readyForInterviews:
                false,

            mockInterviewsConsidered:
                mockInterviews.length,

            breakdown: {
                skillScore,

                technicalInterviewScore,

                problemSolvingScore,

                communicationScore,
            },

            weakAreas,

            recommendation:
                ReadinessRecommendation
                    .GENERATE_ADAPTIVE_ROADMAP,
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
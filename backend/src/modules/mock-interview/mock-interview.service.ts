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
    CreateMockInterviewDTO,
    CreateMockInterviewInput,
} from "./mock-interview.types.js";

import {
    MockInterviewStatus,
} from "./mock-interview.enums.js";

import {
    mockInterviewRepository,
} from "./mock-interview.repository.js";
import { roadmapRepository } from "../roadmap/roadmap.repository.js";


class MockInterviewService {

    /*
    |--------------------------------------------------------------------------
    | Create Mock Interview
    |--------------------------------------------------------------------------
    */

    async createMockInterview(
        userId: string,
        data: CreateMockInterviewDTO,
        session?: ClientSession
    ) {

        const careerJourneyId =
            new Types.ObjectId(
                data.careerJourneyId
            );

        /*
         * Validate Career Journey
         */

        const careerJourney =
            await careerJourneyRepository
                .findByIdAndUserId(
                    careerJourneyId,

                    new Types.ObjectId(
                        userId
                    ),

                    session
                );

        if (!careerJourney) {

            throw new AppError(
                HTTP_STATUS.NOT_FOUND,
                "Career journey not found."
            );
        }

        /*
         * Mock Interviews Are Allowed
         * Only During Readiness Stage
         */

        if (
            careerJourney.status !==
            CareerJourneyStatus.READINESS
        ) {

            throw new AppError(
                HTTP_STATUS.CONFLICT,
                "Mock interviews can only be submitted during the readiness stage."
            );
        }

        const roadmap =
            await roadmapRepository
                .findLatestByCareerJourneyId(
                    careerJourneyId,
                    session
                );

        if (!roadmap) {

            throw new AppError(
                HTTP_STATUS.NOT_FOUND,
                "Roadmap not found."
            );
        }

        /*
         * Determine Next Interview Number
         */

        const latestInterview =
            await mockInterviewRepository
                .findLatest(
                    careerJourneyId,
                    session
                );

        const interviewNumber =
            latestInterview
                ? latestInterview
                    .interviewNumber + 1
                : 1;

        /*
         * Build Persistence Input
         */

        const input:
            CreateMockInterviewInput = {

            careerJourneyId,

            roadmapId:
                roadmap._id,

            interviewNumber,

            platform:
                data.platform,

            interviewType:
                data.interviewType,

            overallScore:
                data.overallScore,

            technicalScore:
                data.technicalScore,

            problemSolvingScore:
                data.problemSolvingScore,

            communicationScore:
                data.communicationScore,

            feedback:
                data.feedback,

            interviewedAt:
                data.interviewedAt,

            status:
                MockInterviewStatus
                    .COMPLETED,
        };

        return mockInterviewRepository
            .create(
                input,
                session
            );
    }


    /*
    |--------------------------------------------------------------------------
    | Get Mock Interview
    |--------------------------------------------------------------------------
    */

    async getMockInterview(
        mockInterviewId:
            string,

        session?:
            ClientSession
    ) {

        const mockInterview =
            await mockInterviewRepository
                .findById(
                    new Types.ObjectId(
                        mockInterviewId
                    ),
                    session
                );

        if (!mockInterview) {

            throw new AppError(
                HTTP_STATUS.NOT_FOUND,
                "Mock interview not found."
            );
        }

        return mockInterview;
    }


    /*
    |--------------------------------------------------------------------------
    | Get Interview History
    |--------------------------------------------------------------------------
    */

    async getMockInterviewHistory(
        userId: string,
        careerJourneyId: string,
        session?: ClientSession
    ) {

        const careerJourneyObjectId =
            new Types.ObjectId(
                careerJourneyId
            );

        const careerJourney =
            await careerJourneyRepository
                .findByIdAndUserId(
                    careerJourneyObjectId,

                    new Types.ObjectId(
                        userId
                    ),

                    session
                );

        if (!careerJourney) {

            throw new AppError(
                HTTP_STATUS.NOT_FOUND,
                "Career journey not found."
            );
        }

        return mockInterviewRepository
            .findByCareerJourney(
                careerJourneyObjectId,
                session
            );
    }
}


export const mockInterviewService =
    new MockInterviewService();
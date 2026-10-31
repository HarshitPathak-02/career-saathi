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
import { practiceService } from "../practice/practice.service.js";
import { interviewSessionRepository } from "../practice/interview-session.repository.js";
import { InterviewSessionStatus } from "../practice/practice.enums.js";


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

    /*
    |--------------------------------------------------------------------------
    | Get Readiness Battery
    |--------------------------------------------------------------------------
    */
    async getReadinessBattery(
        userId: string,
        careerJourneyIdStr: string,
        session?: ClientSession
    ) {
        const careerJourneyObjectId = new Types.ObjectId(careerJourneyIdStr);
        const userObjectId = new Types.ObjectId(userId);

        const careerJourney = await careerJourneyRepository.findByIdAndUserId(
            careerJourneyObjectId,
            userObjectId,
            session
        );

        if (!careerJourney) {
            throw new AppError(HTTP_STATUS.NOT_FOUND, "Career journey not found.");
        }

        const completedMocks = await mockInterviewRepository.findByCareerJourney(
            careerJourneyObjectId,
            session
        );

        const activeSessions = await interviewSessionRepository.findOfficialMockSessions(
            careerJourneyObjectId,
            session
        );

        const slotDefinitions = [
            {
                interviewNumber: 1,
                title: "Technical & System Architecture",
                description:
                    "Probing core mechanics, state management, caching & architectural trade-offs.",
                type: "technical",
            },
            {
                interviewNumber: 2,
                title: "Production Problem Solving & Debugging",
                description:
                    "Failure recovery, concurrency hazards, latency spikes & incident mitigation.",
                type: "technical",
            },
            {
                interviewNumber: 3,
                title: "Comprehensive Role Screen & System Scalability",
                description:
                    "End-to-end engineering trade-offs, system scalability & leadership reasoning.",
                type: "mixed",
            },
        ];

        let completedCount = 0;
        const slots = slotDefinitions.map((def, index) => {
            const completedMock = completedMocks.find(
                (m) => m.interviewNumber === def.interviewNumber
            );

            if (completedMock) {
                completedCount++;
                return {
                    ...def,
                    status: "COMPLETED" as const,
                    overallScore: completedMock.overallScore,
                    technicalScore: completedMock.technicalScore,
                    problemSolvingScore: completedMock.problemSolvingScore,
                    communicationScore: completedMock.communicationScore,
                    feedback: completedMock.feedback,
                    completedAt: completedMock.interviewedAt,
                    sessionId: null,
                };
            }

            const inProgressSession = activeSessions.find(
                (s) =>
                    s.mockInterviewNumber === def.interviewNumber &&
                    s.status === InterviewSessionStatus.IN_PROGRESS
            );

            if (inProgressSession) {
                return {
                    ...def,
                    status: "IN_PROGRESS" as const,
                    overallScore: null,
                    technicalScore: null,
                    problemSolvingScore: null,
                    communicationScore: null,
                    feedback: null,
                    completedAt: null,
                    sessionId: inProgressSession._id.toString(),
                };
            }

            // Check if previous slot was completed
            const isPreviousCompleted =
                index === 0 ||
                completedMocks.some((m) => m.interviewNumber === def.interviewNumber - 1);

            return {
                ...def,
                status: isPreviousCompleted ? ("NOT_STARTED" as const) : ("LOCKED" as const),
                overallScore: null,
                technicalScore: null,
                problemSolvingScore: null,
                communicationScore: null,
                feedback: null,
                completedAt: null,
                sessionId: null,
            };
        });

        return {
            careerJourneyId: careerJourneyIdStr,
            status: careerJourney.status,
            slots,
            completedCount,
            totalRequired: 3,
            canEvaluateReadiness: completedCount >= 3,
        };
    }

    /*
    |--------------------------------------------------------------------------
    | Start Official Mock Interview
    |--------------------------------------------------------------------------
    */
    async startOfficialMockInterview(
        userId: string,
        careerJourneyIdStr: string,
        interviewNumber: number,
        session?: ClientSession
    ) {
        if (![1, 2, 3].includes(interviewNumber)) {
            throw new AppError(HTTP_STATUS.BAD_REQUEST, "Interview number must be 1, 2, or 3.");
        }

        const careerJourneyObjectId = new Types.ObjectId(careerJourneyIdStr);
        const userObjectId = new Types.ObjectId(userId);

        const careerJourney = await careerJourneyRepository.findByIdAndUserId(
            careerJourneyObjectId,
            userObjectId,
            session
        );

        if (!careerJourney) {
            throw new AppError(HTTP_STATUS.NOT_FOUND, "Career journey not found.");
        }

        // Check if roadmap is available
        const roadmap = await roadmapRepository.findLatestByCareerJourneyId(
            careerJourneyObjectId,
            session
        );

        if (!roadmap) {
            throw new AppError(HTTP_STATUS.NOT_FOUND, "Roadmap not found.");
        }

        // Check if this interview is already completed
        const existingMock = await mockInterviewRepository.findByJourneyAndNumber(
            careerJourneyObjectId,
            interviewNumber,
            session
        );

        if (existingMock) {
            throw new AppError(
                HTTP_STATUS.CONFLICT,
                `Mock Interview ${interviewNumber} is already completed.`
            );
        }

        // Validate sequence: if interviewNumber > 1, previous must be completed
        if (interviewNumber > 1) {
            const previousMock = await mockInterviewRepository.findByJourneyAndNumber(
                careerJourneyObjectId,
                interviewNumber - 1,
                session
            );

            if (!previousMock) {
                throw new AppError(
                    HTTP_STATUS.BAD_REQUEST,
                    `You must complete Mock Interview ${interviewNumber - 1} first.`
                );
            }
        }

        // Resume in-progress session if one already exists
        const inProgressSession = await interviewSessionRepository.findOfficialMockSession(
            careerJourneyObjectId,
            interviewNumber,
            session
        );

        if (inProgressSession && inProgressSession.status === InterviewSessionStatus.IN_PROGRESS) {
            return practiceService.getInterviewSession(
                userId,
                careerJourneyIdStr,
                inProgressSession._id.toString()
            );
        }

        // Start a new official interview session
        return practiceService.startOfficialReadinessMockInterview(
            userId,
            careerJourney,
            roadmap,
            interviewNumber
        );
    }
}


export const mockInterviewService =
    new MockInterviewService();
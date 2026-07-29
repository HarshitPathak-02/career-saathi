import {
    ClientSession,
    Types,
} from "mongoose";

import {
    missionRepository,
} from "./mission.repository.js";

import {
    MissionStatus,
} from "./mission.enums.js";

import {
    CreateMissionDTO,
} from "./mission.types.js";

import {
    MissionDocument,
} from "./mission.model.js";

import {
    AppError,
} from "../../core/errors/app-error.js";
import { DEFAULT_DURATION_DAYS } from "./index.js";

class MissionService {

    async createMission(
        data: CreateMissionDTO,
        session?: ClientSession
    ): Promise<MissionDocument> {

        return missionRepository.create(
            data,
            session
        );
    }

    async getMission(
        missionId: string,
        session?: ClientSession
    ): Promise<MissionDocument | null> {

        const missionObjectId =
            new Types.ObjectId(
                missionId
            );

        return missionRepository.findById(
            missionObjectId,
            session
        );
    }

    async getMissionByNumber(
        careerJourneyId: string,
        missionNumber: number,
        session?: ClientSession
    ): Promise<MissionDocument | null> {

        const careerJourneyObjectId =
            new Types.ObjectId(
                careerJourneyId
            );

        return missionRepository
            .findByMissionNumber(
                careerJourneyObjectId,
                missionNumber,
                session
            );
    }

    async getLatestMission(
        careerJourneyId: string,
        session?: ClientSession
    ): Promise<MissionDocument | null> {

        const careerJourneyObjectId =
            new Types.ObjectId(
                careerJourneyId
            );

        return missionRepository
            .findLatestMission(
                careerJourneyObjectId,
                session
            );
    }

    async getActiveMission(
        careerJourneyId: string,
        session?: ClientSession
    ): Promise<MissionDocument | null> {

        const careerJourneyObjectId =
            new Types.ObjectId(
                careerJourneyId
            );

        return missionRepository
            .findActiveMission(
                careerJourneyObjectId,
                session
            );
    }

    async getMissionHistory(
        careerJourneyId: string,
        session?: ClientSession
    ): Promise<MissionDocument[]> {

        const careerJourneyObjectId =
            new Types.ObjectId(
                careerJourneyId
            );

        return missionRepository
            .findAllByCareerJourney(
                careerJourneyObjectId,
                session
            );
    }

    async markAsActive(
        missionId: string,
        session?: ClientSession
    ): Promise<MissionDocument | null> {

        const missionObjectId =
            new Types.ObjectId(
                missionId
            );

        return missionRepository.updateStatus(
            missionObjectId,
            MissionStatus.ACTIVE,
            session
        );
    }

    async markAsCompleted(
        missionId: string,
        session?: ClientSession
    ): Promise<MissionDocument | null> {

        const missionObjectId =
            new Types.ObjectId(
                missionId
            );

        return missionRepository.updateStatus(
            missionObjectId,
            MissionStatus.COMPLETED,
            session
        );
    }

    async markAsSkipped(
        missionId: string,
        session?: ClientSession
    ): Promise<MissionDocument | null> {

        const missionObjectId =
            new Types.ObjectId(
                missionId
            );

        return missionRepository.updateStatus(
            missionObjectId,
            MissionStatus.SKIPPED,
            session
        );
    }

    async getCurrentMissionDay(
        missionId: Types.ObjectId,
        session?: ClientSession
    ): Promise<number> {

        const mission =
            await missionRepository.findById(
                missionId,
                session
            );

        if (!mission) {
            throw new AppError(
                404,
                "Mission not found."
            );
        }

        return this.calculateCurrentMissionDay(
            mission.startDate
        );
    }

    private calculateCurrentMissionDay(
        missionStartDate: Date
    ): number {

        const today =
            new Date();

        const start =
            new Date(
                missionStartDate
            );

        today.setHours(
            0,
            0,
            0,
            0
        );

        start.setHours(
            0,
            0,
            0,
            0
        );

        const millisecondsPerDay =
            24 * 60 * 60 * 1000;

        const daysPassed =
            Math.floor(
                (
                    today.getTime() -
                    start.getTime()
                ) /
                millisecondsPerDay
            );

        return Math.min(
            Math.max(
                daysPassed + 1,
                1
            ),
            DEFAULT_DURATION_DAYS
        );
    }
}

export const missionService =
    new MissionService();
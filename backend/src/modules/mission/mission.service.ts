import { ClientSession, Types } from "mongoose";

import {
    missionRepository,
} from "./mission.repository.js";

import {
    MissionStatus,
} from "./mission.enums.js";

import {
    CreateMissionDTO,
} from "./mission.types.js";
import { MissionDocument } from "./mission.schema.js";
import { dailyTaskService } from "../daily-task/daily-task.service.js";
import { missionMapper } from "./mission.mapper.js";
import { AppError } from "../../core/errors/app-error.js";

class MissionService {

    async createMission(
        data: CreateMissionDTO
    ) {
        return missionRepository.create(data);
    }

    async getMission(
        missionId: string
    ): Promise<MissionDocument | null> {

        const missionObjectId =
            new Types.ObjectId(missionId);

        return missionRepository.findById(
            missionObjectId
        );

    }

    async getMissionByNumber(
        careerJourneyId: string,
        missionNumber: number
    ) {
        const careerJourneyObjectId =
            new Types.ObjectId(careerJourneyId);

        return missionRepository.findByMissionNumber(
            careerJourneyObjectId,
            missionNumber
        );
    }

    async getLatestMission(
        careerJourneyId: string
    ): Promise<MissionDocument | null> {

        const careerJourneyObjectId =
            new Types.ObjectId(careerJourneyId);

        return missionRepository.findLatestMission(
            careerJourneyObjectId
        );

    }

    async getActiveMission(
        careerJourneyId: string
    ): Promise<MissionDocument | null> {

        const careerJourneyObjectId =
            new Types.ObjectId(careerJourneyId);

        return missionRepository.findActiveMission(
            careerJourneyObjectId
        );

    }

    async getMissionHistory(
        careerJourneyId: string
    ): Promise<MissionDocument[]> {

        const careerJourneyObjectId =
            new Types.ObjectId(careerJourneyId);

        return missionRepository.findAllByCareerJourney(
            careerJourneyObjectId
        );

    }

    async markAsActive(
        missionId: string
    ) {
        const missionObjectId =
            new Types.ObjectId(missionId);

        return missionRepository.updateStatus(
            missionObjectId,
            MissionStatus.ACTIVE
        );
    }

    async markAsCompleted(
        missionId: string
    ) {
        const missionObjectId =
            new Types.ObjectId(missionId);

        return missionRepository.updateStatus(
            missionObjectId,
            MissionStatus.COMPLETED
        );
    }

    async markAsSkipped(
        missionId: string
    ) {
        const missionObjectId =
            new Types.ObjectId(missionId);

        return missionRepository.updateStatus(
            missionObjectId,
            MissionStatus.SKIPPED
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
            new Date(missionStartDate);

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
            7
        );

    }

}

export const missionService =
    new MissionService();
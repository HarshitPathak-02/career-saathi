import { Types } from "mongoose";

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

class MissionService {

    async createMission(
        data: CreateMissionDTO
    ) {
        return missionRepository.create(data);
    }

    async getMission(
        missionId: string
    ) {
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
    ):Promise<MissionDocument | null> {
        const careerJourneyObjectId =
            new Types.ObjectId(careerJourneyId);

        return missionRepository.findLatestMission(
            careerJourneyObjectId
        );
    }

    async getActiveMission(
        careerJourneyId: string
    ) {
        const careerJourneyObjectId =
            new Types.ObjectId(careerJourneyId);

        return missionRepository.findActiveMission(
            careerJourneyObjectId
        );
    }

    async getUpcomingMission(
        careerJourneyId: string
    ) {
        const careerJourneyObjectId =
            new Types.ObjectId(careerJourneyId);

        return missionRepository.findUpcomingMission(
            careerJourneyObjectId
        );
    }

    async getMissionHistory(
        careerJourneyId: string
    ) {
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

}

export const missionService =
    new MissionService();
import {
    ClientSession,
    Types,
} from "mongoose";

import {
    roadmapRepository,
} from "./roadmap.repository.js";

import {
    roadmapItemRepository,
} from "./roadmap-item.repository.js";
import { AppError } from "../../core/errors/app-error.js";
import { RoadmapStatus } from "./roadmap.enums.js";

class RoadmapService {

    async getRoadmap(
        roadmapId: string,
        session?: ClientSession
    ) {

        const roadmapObjectId =
            new Types.ObjectId(
                roadmapId
            );

        return roadmapRepository
            .findById(
                roadmapObjectId,
                session
            );
    }

    async getRoadmapByCareerJourney(
        careerJourneyId: string,
        session?: ClientSession
    ) {

        const careerJourneyObjectId =
            new Types.ObjectId(
                careerJourneyId
            );

        return roadmapRepository
            .findLatestByCareerJourneyId(
                careerJourneyObjectId,
                session
            );
    }

    async getRoadmapItems(
        roadmapId: string,
        session?: ClientSession
    ) {

        const roadmapObjectId =
            new Types.ObjectId(
                roadmapId
            );

        return roadmapItemRepository
            .findByRoadmapId(
                roadmapObjectId,
                session
            );
    }

    async getNextPendingItems(
        roadmapId: Types.ObjectId,
        limit: number,
        session?: ClientSession
    ) {

        return roadmapItemRepository
            .findNextPendingItems(
                roadmapId,
                limit,
                session
            );
    }

    async getRoadmapItemsByIds(
        roadmapItemIds: Types.ObjectId[],
        session?: ClientSession
    ) {

        return roadmapItemRepository
            .findByIds(
                roadmapItemIds,
                session
            );
    }

    async syncRoadmapProgress(
        roadmapId: Types.ObjectId,
        session?: ClientSession
    ) {

        const roadmap =
            await roadmapRepository
                .findById(
                    roadmapId,
                    session
                );

        if (!roadmap) {
            throw new AppError(
                404,
                "Roadmap not found."
            );
        }

        const completedItems =
            await roadmapItemRepository
                .countCompleted(
                    roadmapId,
                    session
                );

        const updatedRoadmap =
            await roadmapRepository
                .updateCompletedItems(
                    roadmapId,
                    completedItems,
                    session
                );

        if (!updatedRoadmap) {
            throw new AppError(
                404,
                "Roadmap not found."
            );
        }

        return updatedRoadmap;
    }

    async completeRoadmap(
        roadmapId: Types.ObjectId,
        session?: ClientSession
    ) {

        const roadmap =
            await roadmapRepository
                .findById(
                    roadmapId,
                    session
                );

        if (!roadmap) {
            throw new AppError(
                404,
                "Roadmap not found."
            );
        }

        if (
            roadmap.status ===
            RoadmapStatus.COMPLETED
        ) {
            return roadmap;
        }

        const completedItems =
            await roadmapItemRepository
                .countCompleted(
                    roadmapId,
                    session
                );

        if (
            completedItems !==
            roadmap.totalItems
        ) {
            throw new AppError(
                409,
                "Roadmap cannot be completed because some roadmap items are still pending."
            );
        }

        const completedRoadmap =
            await roadmapRepository
                .updateStatus(
                    roadmapId,
                    RoadmapStatus.COMPLETED,
                    session
                );

        if (!completedRoadmap) {
            throw new AppError(
                404,
                "Roadmap not found."
            );
        }

        return completedRoadmap;
    }
}

export const roadmapService =
    new RoadmapService();
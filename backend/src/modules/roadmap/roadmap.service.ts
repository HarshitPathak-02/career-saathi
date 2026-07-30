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
            .findByCareerJourneyId(
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
}

export const roadmapService =
    new RoadmapService();
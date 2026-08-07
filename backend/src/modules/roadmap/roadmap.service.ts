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
import { RoadmapDocument } from "./roadmap.model.js";
import { RoadmapItemDocument } from "./roadmap-item.model.js";


class RoadmapService {

    async getRoadmapByCareerJourney(
        careerJourneyId: string,
        session?: ClientSession
    ): Promise<RoadmapDocument | null> {

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
    ): Promise<RoadmapItemDocument[]> {

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

    async getRoadmapItemsByIds(
        roadmapItemIds: Types.ObjectId[],
        session?: ClientSession
    ): Promise<RoadmapItemDocument[]> {

        return roadmapItemRepository
            .findByIds(
                roadmapItemIds,
                session
            );
    }
}

export const roadmapService =
    new RoadmapService();
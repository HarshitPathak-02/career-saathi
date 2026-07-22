import { Types } from "mongoose";

import { roadmapRepository } from "./roadmap.repository.js";
import { roadmapItemRepository } from "./roadmap-item.repository.js";
import { RoadmapDocument } from "./roadmap.schema.js";

class RoadmapService {

    async getRoadmap(
        roadmapId: string
    ) {
        const roadmapObjectId = new Types.ObjectId(roadmapId);
        return roadmapRepository.findById(
            roadmapObjectId
        );
    }

    async getRoadmapByCareerJourney(
        careerJourneyId: string
    ) {
        const careerJourneyObjectId = new Types.ObjectId(careerJourneyId);
        return roadmapRepository.findByCareerJourneyId(
            careerJourneyObjectId
        );

    }

    async getRoadmapItems(
        roadmapId: string
    ) {
        const roadmapObjectId = new Types.ObjectId(roadmapId);
        return roadmapItemRepository.findByRoadmapId(
            roadmapObjectId
        );
    }

    async getNextPendingItems(
        roadmapId: Types.ObjectId,
        limit: number
    ) {
        return roadmapItemRepository.findNextPendingItems(
            roadmapId,
            limit
        );
    }
    
    async getRoadmapItemsByIds(
        roadmapItemIds: Types.ObjectId[]
    ) {
        return roadmapItemRepository.findByIds(
            roadmapItemIds
        );
    }
}

export const roadmapService =
    new RoadmapService();
import {
    RoadmapDocument,
} from "./roadmap.schema.js";

import {RoadmapItemDocument} from "./roadmap-item.schema.js"

import {
    GenerateRoadmapResponse,
    RoadmapItemResponse,
    RoadmapResponse,
} from "./roadmap.types.js";

class RoadmapResponseMapper {

    toRoadmapResponse(
        roadmap: RoadmapDocument
    ): RoadmapResponse {

        return {

            id: roadmap._id.toString(),

            title: roadmap.title,

            targetRole: roadmap.targetRole,

            targetDomain: roadmap.targetDomain,

            targetDurationMonths:
                roadmap.targetDurationMonths,

            estimatedWeeks:
                roadmap.estimatedWeeks,

            totalItems:
                roadmap.totalItems,

            completedItems:
                roadmap.completedItems,

            status:
                roadmap.status,

            generatedAt:
                roadmap.generatedAt,

        };

    }

    toRoadmapItemResponse(
        roadmapItem: RoadmapItemDocument
    ): RoadmapItemResponse {

        return {

            id:
                roadmapItem._id.toString(),

            order:
                roadmapItem.order,

            type:
                roadmapItem.type,

            title:
                roadmapItem.title,

            description:
                roadmapItem.description,

            estimatedHours:
                roadmapItem.estimatedHours,

            aiReason:
                roadmapItem.aiReason,

            status:
                roadmapItem.status,

        };

    }

    toRoadmapItemsResponse(
        roadmapItems: RoadmapItemDocument[]
    ): RoadmapItemResponse[] {

        return roadmapItems.map(
            item =>
                this.toRoadmapItemResponse(item)
        );

    }

    toGenerateRoadmapResponse(
        roadmap: RoadmapDocument
    ): GenerateRoadmapResponse {

        return {

            roadmapId:
                roadmap._id.toString(),

            message:
                "Roadmap generated successfully.",

        };

    }

}

export const roadmapResponseMapper =
    new RoadmapResponseMapper();
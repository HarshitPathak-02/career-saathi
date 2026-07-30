import {
    RoadmapDocument,
} from "./roadmap.model.js";

import {
    RoadmapItemDocument,
} from "./roadmap-item.model.js";

import {
    GenerateRoadmapResponse,
    RoadmapItemResponse,
    RoadmapResponse,
} from "./roadmap.types.js";


class RoadmapResponseMapper {

    /*
    |--------------------------------------------------------------------------
    | Roadmap
    |--------------------------------------------------------------------------
    */

    toRoadmapResponse(
        roadmap: RoadmapDocument
    ): RoadmapResponse {

        return {

            id:
                roadmap._id.toString(),

            title:
                roadmap.title,

            targetRole:
                roadmap.targetRole,

            targetDomain:
                roadmap.targetDomain,

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

    /*
    |--------------------------------------------------------------------------
    | Roadmap Item
    |--------------------------------------------------------------------------
    */

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

    /*
    |--------------------------------------------------------------------------
    | Roadmap Items
    |--------------------------------------------------------------------------
    */

    toRoadmapItemsResponse(
        roadmapItems: RoadmapItemDocument[]
    ): RoadmapItemResponse[] {

        return roadmapItems.map(
            roadmapItem =>
                this.toRoadmapItemResponse(
                    roadmapItem
                )
        );

    }

    /*
    |--------------------------------------------------------------------------
    | Generate Roadmap
    |--------------------------------------------------------------------------
    */

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
import {
    RoadmapDocument,
} from "./roadmap.model.js";

import {
    RoadmapItemDocument,
} from "./roadmap-item.model.js";

import {
    AdaptiveRoadmapWorkflowContext,
    GenerateRoadmapResponse,
    RoadmapGenerationOutput,
    RoadmapItemResponse,
    RoadmapResponse,
} from "./roadmap.types.js";
import { RoadmapStatus, RoadmapType } from "./roadmap.enums.js";
import { appClock } from "../../shared/time/app-clock.js";


class RoadmapResponseMapper {

    toRoadmapResponse(
        roadmap: RoadmapDocument
    ): RoadmapResponse {

        return {

            id:
                roadmap._id.toString(),

            version:
                roadmap.version,

            type:
                roadmap.type,

            previousRoadmapId:
                roadmap.previousRoadmapId
                    ? roadmap.previousRoadmapId.toString()
                    : null,

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

            completedAt: roadmap.completedAt

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
            roadmapItem =>
                this.toRoadmapItemResponse(
                    roadmapItem
                )
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

    buildAdaptiveRoadmap(
        context: AdaptiveRoadmapWorkflowContext,
        output: RoadmapGenerationOutput,
        estimatedWeeks: number
    ) {

        return {

            careerJourneyId:
                context.careerJourney._id,

            version:
                context.previousRoadmap.version + 1,

            previousRoadmapId:
                context.previousRoadmap._id,

            type:
                RoadmapType.ADAPTIVE,

            title:
                output.title,

            targetRole:
                context.role.name,

            targetDomain:
                context.domain.name,

            targetDurationMonths:
                context.careerJourney
                    .targetDurationMonths,

            estimatedWeeks,

            totalItems:
                output.roadmapItems.length,

            completedItems: 0,

            status:
                RoadmapStatus.ACTIVE,

            generatedAt:
                appClock.now(),

            completedAt:
                null,
        };
    }

}


export const roadmapResponseMapper =
    new RoadmapResponseMapper();
import { Types } from "mongoose";

import {
    RoadmapItemStatus,
    RoadmapItemType,
    RoadmapStatus,
} from "./roadmap.enums.js";

import {
    RoadmapGenerationOutput,
    RoadmapWorkflowContext,
    RoadmapItemOutput,
} from "./roadmap.types.js";

class RoadmapMapper {

    buildRoadmap(
        context: RoadmapWorkflowContext,
        output: RoadmapGenerationOutput,
        estimatedWeeks: number
    ) {

        return {

            careerJourneyId:
                context.careerJourney._id,

            title:
                output.title,

            targetRole:
                context.role.name,

            targetDomain:
                context.domain.name,

            targetDurationMonths:
                context.careerJourney.targetDurationMonths,

            estimatedWeeks,

            totalItems:
                output.roadmapItems.length,

            completedItems: 0,

            status:
                RoadmapStatus.ACTIVE,

            generatedAt:
                new Date(),

        };

    }

    buildRoadmapItems(
        roadmapId: Types.ObjectId,
        items: RoadmapItemOutput[]
    ) {

        return items.map(item => ({

            roadmapId,

            order:
                item.order,

            type:
                item.type,

            skillId:
                item.type === RoadmapItemType.TOPIC &&
                    item.skillId
                    ? new Types.ObjectId(item.skillId)
                    : null,

            title:
                item.title,

            description:
                item.description,

            estimatedHours:
                item.estimatedHours,

            status:
                RoadmapItemStatus.PENDING,

            aiReason:
                item.aiReason,

            metadata:
                item.metadata ?? {},

        }));

    }

}

export const roadmapMapper =
    new RoadmapMapper();
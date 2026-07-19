import { Types } from "mongoose";

import { RoadmapItemType } from "../../modules/roadmap/roadmap.enums.js";
import {
    RoadmapGenerationOutput,
    RoadmapItemOutput,
} from "../../modules/roadmap/roadmap.types.js";

class AIValidator {

    validateRoadmap(
        response: unknown
    ): RoadmapGenerationOutput {

        if (
            !response ||
            typeof response !== "object"
        ) {
            throw new Error(
                "AI response must be an object."
            );
        }

        const roadmap =
            response as RoadmapGenerationOutput;

        if (
            typeof roadmap.version !== "number"
        ) {
            throw new Error(
                "Invalid roadmap version."
            );
        }

        if (
            typeof roadmap.title !== "string" ||
            roadmap.title.trim().length === 0
        ) {
            throw new Error(
                "Roadmap title is required."
            );
        }

        if (
            !Array.isArray(roadmap.roadmapItems) ||
            roadmap.roadmapItems.length === 0
        ) {
            throw new Error(
                "Roadmap must contain at least one roadmap item."
            );
        }

        roadmap.roadmapItems.forEach(
            (item, index) =>
                this.validateRoadmapItem(
                    item,
                    index
                )
        );

        const orders =
            roadmap.roadmapItems.map(
                item => item.order
            );

        const uniqueOrders =
            new Set(orders);

        if (
            orders.length !== uniqueOrders.size
        ) {
            throw new Error(
                "Roadmap contains duplicate item orders."
            );
        }

        const sortedOrders =
            [...orders].sort(
                (a, b) => a - b
            );

        sortedOrders.forEach(
            (order, index) => {

                if (order !== index + 1) {
                    throw new Error(
                        "Roadmap item orders must start at 1 and be sequential."
                    );
                }

            }
        );

        return roadmap;
    }

    private validateRoadmapItem(
        item: RoadmapItemOutput,
        index: number
    ): void {

        if (
            !Number.isInteger(item.order) ||
            item.order < 1
        ) {
            throw new Error(
                `Roadmap item ${index} has an invalid order.`
            );
        }

        if (
            !Object.values(
                RoadmapItemType
            ).includes(item.type)
        ) {
            throw new Error(
                `Roadmap item ${index} has an invalid type.`
            );
        }

        // Validate skillId
        if (
            item.type === RoadmapItemType.TOPIC
        ) {

            if (
                typeof item.skillId !== "string" ||
                !Types.ObjectId.isValid(
                    item.skillId
                )
            ) {
                throw new Error(
                    `Roadmap item ${index} must contain a valid skillId.`
                );
            }

        } else {

            if (
                item.skillId !== undefined &&
                item.skillId !== null
            ) {
                throw new Error(
                    `Roadmap item ${index} must not contain skillId because only TOPIC items can have it.`
                );
            }

        }

        if (
            typeof item.title !== "string" ||
            item.title.trim().length === 0
        ) {
            throw new Error(
                `Roadmap item ${index} must have a valid title.`
            );
        }

        if (
            typeof item.description !== "string" ||
            item.description.trim().length === 0
        ) {
            throw new Error(
                `Roadmap item ${index} must have a valid description.`
            );
        }

        if (
            !Number.isFinite(
                item.estimatedHours
            ) ||
            item.estimatedHours <= 0
        ) {
            throw new Error(
                `Roadmap item ${index} has invalid estimated hours.`
            );
        }

        if (
            typeof item.aiReason !== "string" ||
            item.aiReason.trim().length === 0
        ) {
            throw new Error(
                `Roadmap item ${index} must contain an AI reason.`
            );
        }

        if (
            item.metadata !== undefined &&
            (
                typeof item.metadata !== "object" ||
                item.metadata === null
            )
        ) {
            throw new Error(
                `Roadmap item ${index} has invalid metadata.`
            );
        }

    }

}

export const aiValidator =
    new AIValidator();
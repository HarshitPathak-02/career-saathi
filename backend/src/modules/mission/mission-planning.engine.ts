import { Types } from "mongoose";

import {
    MissionPlanningInput,
    MissionPlanningResult,
} from "./mission.types.js";

class MissionPlanningEngine {

    planMission(
        input: MissionPlanningInput
    ): MissionPlanningResult {

        const capacity =
            this.calculateCapacity(
                input.targetRoadmapItemsPerMission,
                input.workloadMultiplier
            );

        const plannedRoadmapItemIds: Types.ObjectId[] = [
            ...input.carryForwardRoadmapItemIds,
        ];

        for (const id of input.revisionRoadmapItemIds) {

            if (
                plannedRoadmapItemIds.length >= capacity
            ) break;

            if (
                !plannedRoadmapItemIds.some(
                    item => item.equals(id)
                )
            ) {
                plannedRoadmapItemIds.push(id);
            }

        }

        const remainingCapacity =
            capacity -
            plannedRoadmapItemIds.length;

        const newItems =
            input.newRoadmapItems
                .filter(item =>
                    !plannedRoadmapItemIds.some(
                        id => id.equals(item._id)
                    )
                )
                .slice(0, remainingCapacity)
                .map(item => item._id);

        plannedRoadmapItemIds.push(
            ...newItems
        );

        return {
            missionNumber: input.missionNumber,
            plannedRoadmapItemIds,
            startDate: input.startDate,
            endDate: input.endDate,
        };
    }

    private calculateCapacity(
        targetRoadmapItemsPerMission: number,
        workloadMultiplier: number
    ): number {

        const capacity = Math.floor(
            targetRoadmapItemsPerMission *
            workloadMultiplier
        );

        return Math.max(capacity, 1);
    }

}

export const missionPlanningEngine =
    new MissionPlanningEngine();
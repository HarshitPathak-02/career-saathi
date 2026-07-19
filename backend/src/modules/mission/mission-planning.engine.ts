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

        const remainingCapacity = Math.max(
            capacity - plannedRoadmapItemIds.length,
            0
        );

        const newRoadmapItemIds =
            input.roadmapItems
                .slice(0, remainingCapacity)
                .map(item => item._id);

        plannedRoadmapItemIds.push(
            ...newRoadmapItemIds
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
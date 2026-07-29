import {
    Types,
} from "mongoose";

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

        /*
        |--------------------------------------------------------------------------
        | Carry Forward
        |--------------------------------------------------------------------------
        |
        | Incomplete items from the previous mission
        | always receive priority.
        |
        */

        const plannedRoadmapItemIds:
            Types.ObjectId[] = [
                ...input.carryForwardRoadmapItemIds,
            ];

        /*
        |--------------------------------------------------------------------------
        | Revision Capacity
        |--------------------------------------------------------------------------
        |
        | For V1, the existence of revision work
        | consumes one roadmap-sized workload unit.
        |
        */

        const revisionCapacityCost =
            input.revisionPlans.length > 0
                ? 1
                : 0;

        /*
        |--------------------------------------------------------------------------
        | Remaining Capacity
        |--------------------------------------------------------------------------
        */

        const remainingCapacity =
            Math.max(
                capacity -
                plannedRoadmapItemIds.length -
                revisionCapacityCost,
                0
            );

        /*
        |--------------------------------------------------------------------------
        | New Roadmap Items
        |--------------------------------------------------------------------------
        |
        | Add new items only after carry-forward
        | and revision workload have been considered.
        |
        */

        const newItems =
            input.newRoadmapItems
                .filter(
                    (item) =>
                        !this.containsId(
                            plannedRoadmapItemIds,
                            item._id
                        )
                )
                .slice(
                    0,
                    remainingCapacity
                )
                .map(
                    (item) =>
                        item._id
                );

        plannedRoadmapItemIds.push(
            ...newItems
        );

        return {
            missionNumber:
                input.missionNumber,

            plannedRoadmapItemIds,

            revisionPlans:
                input.revisionPlans,

            startDate:
                input.startDate,

            endDate:
                input.endDate,
        };
    }

    /*
    |--------------------------------------------------------------------------
    | Capacity
    |--------------------------------------------------------------------------
    */

    private calculateCapacity(
        targetRoadmapItemsPerMission: number,
        workloadMultiplier: number
    ): number {

        const capacity =
            Math.floor(
                targetRoadmapItemsPerMission *
                workloadMultiplier
            );

        return Math.max(
            capacity,
            1
        );
    }

    /*
    |--------------------------------------------------------------------------
    | ObjectId Helper
    |--------------------------------------------------------------------------
    */

    private containsId(
        ids: Types.ObjectId[],
        targetId: Types.ObjectId
    ): boolean {

        return ids.some(
            (id) =>
                id.equals(
                    targetId
                )
        );
    }
}

export const missionPlanningEngine =
    new MissionPlanningEngine();
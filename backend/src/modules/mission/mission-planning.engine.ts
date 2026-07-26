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
         * Carry-forward items always get priority.
         */
        const plannedRoadmapItemIds: Types.ObjectId[] =
            [
                ...input.carryForwardRoadmapItemIds,
            ];

        /*
         * Revision consumes part of the weekly capacity.
         *
         * We treat the existence of revision work as
         * one roadmap-sized workload unit for V1.
         */
        const revisionCapacityCost =
            input.revisionPlans.length > 0
                ? 1
                : 0;

        const remainingCapacity =
            Math.max(
                capacity -
                plannedRoadmapItemIds.length -
                revisionCapacityCost,
                0
            );

        const newItems =
            input.newRoadmapItems
                .filter(item =>
                    !plannedRoadmapItemIds.some(
                        id =>
                            id.equals(item._id)
                    )
                )
                .slice(
                    0,
                    remainingCapacity
                )
                .map(
                    item =>
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
            id =>
                id.equals(
                    targetId
                )
        );

    }

}

export const missionPlanningEngine =
    new MissionPlanningEngine();
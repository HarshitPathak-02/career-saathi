import {
    ClientSession,
    Types,
} from "mongoose";

import {
    dailyTaskRepository,
} from "../daily-task/daily-task.repository.js";

import {
    DailyTaskStatus,
} from "../daily-task/daily-task.enums.js";

import {
    roadmapItemRepository,
} from "./roadmap-item.repository.js";

import {
    roadmapRepository,
} from "./roadmap.repository.js";

import {
    RoadmapItemStatus,
} from "./roadmap.enums.js";

class RoadmapItemProgressService {

    /*
    |-------------------------------------------------------------------------- 
    | Sync Roadmap Items For Task
    |--------------------------------------------------------------------------
    */

    async syncRoadmapItemsForTask(
        missionId: Types.ObjectId,
        roadmapItemIds: Types.ObjectId[],
        session?: ClientSession
    ): Promise<void> {

        for (
            const roadmapItemId
            of roadmapItemIds
        ) {

            await this.syncRoadmapItem(
                missionId,
                roadmapItemId,
                session
            );

        }
    }

    /*
    |-------------------------------------------------------------------------- 
    | Sync Roadmap Item
    |--------------------------------------------------------------------------
    */

    private async syncRoadmapItem(
        missionId: Types.ObjectId,
        roadmapItemId: Types.ObjectId,
        session?: ClientSession
    ): Promise<void> {

        /*
         * Fetch Daily Tasks
         */

        const tasks =
            await dailyTaskRepository
                .findByMissionAndRoadmapItem(
                    missionId,
                    roadmapItemId,
                    session
                );

        if (
            tasks.length === 0
        ) {
            return;
        }

        /*
         * Calculate Completed Tasks
         */

        const completedCount =
            tasks.filter(
                task =>
                    task.status ===
                    DailyTaskStatus.COMPLETED
            ).length;

        /*
         * Determine Roadmap Item Status
         */

        let status:
            RoadmapItemStatus;

        if (
            completedCount ===
            tasks.length
        ) {

            status =
                RoadmapItemStatus.COMPLETED;

        } else if (
            completedCount > 0
        ) {

            status =
                RoadmapItemStatus.IN_PROGRESS;

        } else {

            status =
                RoadmapItemStatus.PENDING;

        }

        /*
         * Update Roadmap Item
         */

        await roadmapItemRepository
            .updateStatus(
                roadmapItemId,
                status,
                session
            );

        /*
         * Fetch Roadmap Item
         */

        const roadmapItem =
            await roadmapItemRepository.findById(
                roadmapItemId,
                session
            );

        if (!roadmapItem) {
            return;
        }

        /*
         * Count Completed Roadmap Items
         */

        const completedItems =
            await roadmapItemRepository
                .countCompleted(
                    roadmapItem.roadmapId,
                    session
                );

        /*
         * Update Roadmap Progress
         */

        await roadmapRepository
            .updateCompletedItems(
                roadmapItem.roadmapId,
                completedItems,
                session
            );
    }
}

export const roadmapItemProgressService =
    new RoadmapItemProgressService();
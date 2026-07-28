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
    RoadmapItemStatus,
} from "./roadmap.enums.js";
import { roadmapRepository } from "./roadmap.repository.js";

class RoadmapItemProgressService {

    async syncRoadmapItemsForTask(
        missionId: Types.ObjectId,
        roadmapItemIds: Types.ObjectId[],
        session?: ClientSession
    ) {

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

    private async syncRoadmapItem(
        missionId: Types.ObjectId,
        roadmapItemId: Types.ObjectId,
        session?: ClientSession
    ) {

        console.log("syncRoadmapItem called");
        const tasks =
            await dailyTaskRepository
                .findByMissionAndRoadmapItem(
                    missionId,
                    roadmapItemId,
                    session
                );

        if (tasks.length === 0) {
            return;
        }

        const completedCount =
            tasks.filter(
                task =>
                    task.status ===
                    DailyTaskStatus.COMPLETED
            ).length;

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

        await roadmapItemRepository
            .updateStatus(
                roadmapItemId,
                status,
                session
            );

        console.log("Updated roadmap item status:", status);

        const roadmapItem =
            await roadmapItemRepository.findById(
                roadmapItemId,
                session
            );

        if (!roadmapItem) {
            return;
        }

        const completedItems =
            await roadmapItemRepository
                .countCompleted(
                    roadmapItem.roadmapId,
                    session
                );

        console.log("Completed items:", completedItems);

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
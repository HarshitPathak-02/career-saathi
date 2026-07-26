import {
    Types,
} from "mongoose";

import {
    AppError,
} from "../../core/errors/app-error.js";

import {
    missionService,
} from "./mission.service.js";

import {
    nextMissionWorkflow,
} from "./next-mission.workflow.js";

import {
    roadmapRepository,
} from "../roadmap/roadmap.repository.js";

import {
    roadmapItemRepository,
} from "../roadmap/roadmap-item.repository.js";

import {
    MissionStatus,
} from "./mission.enums.js";

import {
    MissionLifecycleResult,
    MissionLifecycleState,
} from "./mission-lifecycle.types.js";

class MissionLifecycleService {

    async resolveMission(
        userId: string,
        careerJourneyId: Types.ObjectId,
    ): Promise<MissionLifecycleResult> {

        /*
        |--------------------------------------------------------------------------
        | Existing Active Mission
        |--------------------------------------------------------------------------
        */

        const activeMission =
            await missionService.getActiveMission(
                careerJourneyId.toString(),
            );

        if (activeMission) {

            return {

                state:
                    MissionLifecycleState.ACTIVE,

                mission:
                    activeMission,

                nextMissionAvailableAt:
                    null,

            };

        }

        /*
        |--------------------------------------------------------------------------
        | Latest Mission
        |--------------------------------------------------------------------------
        */

        const latestMission =
            await missionService.getLatestMission(
                careerJourneyId.toString(),
            );

        /*
        |--------------------------------------------------------------------------
        | No Mission Has Ever Been Generated
        |--------------------------------------------------------------------------
        */

        if (!latestMission) {

            return {

                state:
                    MissionLifecycleState.INITIAL_MISSION_REQUIRED,

                mission:
                    null,

                nextMissionAvailableAt:
                    null,

            };

        }

        /*
        |--------------------------------------------------------------------------
        | Validate Previous Mission State
        |--------------------------------------------------------------------------
        */

        if (
            latestMission.status !==
            MissionStatus.COMPLETED
        ) {

            throw new AppError(
                409,
                "Latest mission is not in a valid state for next mission generation.",
            );

        }

        /*
        |--------------------------------------------------------------------------
        | Check Whether Roadmap Has Remaining Work
        |--------------------------------------------------------------------------
        */

        const roadmap =
            await roadmapRepository
                .findByCareerJourneyId(
                    careerJourneyId,
                );

        if (!roadmap) {

            throw new AppError(
                404,
                "Roadmap not found.",
            );

        }

        const pendingRoadmapItems =
            await roadmapItemRepository
                .findPendingItems(
                    roadmap._id,
                );

        if (
            pendingRoadmapItems.length === 0
        ) {

            return {

                state:
                    MissionLifecycleState.ROADMAP_COMPLETED,

                mission:
                    null,

                nextMissionAvailableAt:
                    null,

            };

        }

        /*
        |--------------------------------------------------------------------------
        | Next Mission Availability
        |--------------------------------------------------------------------------
        */

        const nextMissionAvailableAt =
            this.calculateNextMissionAvailableAt(
                latestMission.endDate,
            );

        const today =
            this.startOfDay(
                new Date(),
            );

        const availableAt =
            this.startOfDay(
                nextMissionAvailableAt,
            );

        /*
        |--------------------------------------------------------------------------
        | Next Mission Not Available Yet
        |--------------------------------------------------------------------------
        */

        if (
            today.getTime() <
            availableAt.getTime()
        ) {

            return {

                state:
                    MissionLifecycleState.WAITING_FOR_NEXT_MISSION,

                mission:
                    null,

                nextMissionAvailableAt,

            };

        }

        /*
        |--------------------------------------------------------------------------
        | Generate Next Mission
        |--------------------------------------------------------------------------
        */

        const mission =
            await nextMissionWorkflow
                .generateNextMission(
                    userId,
                    careerJourneyId,
                );

        return {

            state:
                MissionLifecycleState.ACTIVE,

            mission,

            nextMissionAvailableAt:
                null,

        };

    }

    /*
    |--------------------------------------------------------------------------
    | Next Mission Availability
    |--------------------------------------------------------------------------
    */

    private calculateNextMissionAvailableAt(
        previousMissionEndDate: Date,
    ): Date {

        const date =
            this.startOfDay(
                previousMissionEndDate,
            );

        date.setDate(
            date.getDate() + 1,
        );

        return date;

    }

    /*
    |--------------------------------------------------------------------------
    | Start Of Day
    |--------------------------------------------------------------------------
    */

    private startOfDay(
        date: Date,
    ): Date {

        const normalized =
            new Date(date);

        normalized.setHours(
            0,
            0,
            0,
            0,
        );

        return normalized;

    }

}

export const missionLifecycleService =
    new MissionLifecycleService();
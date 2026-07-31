import {
    Types,
} from "mongoose";

import {
    AppError,
} from "../../core/errors/app-error.js";

import {
    careerJourneyRepository,
} from "../career-journey/career-journey.repository.js";

import {
    CareerJourneyStatus,
} from "../career-journey/career-journey.enums.js";

import {
    roadmapRepository,
} from "../roadmap/roadmap.repository.js";

import {
    roadmapItemRepository,
} from "../roadmap/roadmap-item.repository.js";

import {
    missionService,
} from "./mission.service.js";

import {
    nextMissionWorkflow,
} from "./next-mission.workflow.js";

import {
    MissionStatus,
} from "./mission.enums.js";

import {
    MissionLifecycleResult,
    MissionLifecycleState,
} from "./mission-lifecycle.types.js";
import { addDays, startOfDay } from "../../shared/utils/date.util.js";
import { appClock } from "../../shared/time/app-clock.js";
import { RoadmapStatus } from "../roadmap/roadmap.enums.js";

class MissionLifecycleService {

    async resolveMission(
        userId: string,
        careerJourneyId: Types.ObjectId
    ): Promise<MissionLifecycleResult> {

        /*
        |--------------------------------------------------------------------------
        | Validate Career Journey Ownership
        |--------------------------------------------------------------------------
        */

        const userObjectId =
            new Types.ObjectId(
                userId
            );

        const careerJourney =
            await careerJourneyRepository
                .findByIdAndUserId(
                    careerJourneyId,
                    userObjectId
                );

        if (!careerJourney) {
            throw new AppError(
                404,
                "Career journey not found."
            );
        }

        /*
        |--------------------------------------------------------------------------
        | Validate Career Journey State
        |--------------------------------------------------------------------------
        |
        | A mission can only exist after the
        | initial assessment has activated the journey.
        |
        */

        if (
            careerJourney.status !==
            CareerJourneyStatus.ACTIVE
        ) {
            throw new AppError(
                409,
                "Career journey must be active before resolving missions."
            );
        }


        const roadmap =
            await roadmapRepository
                .findLatestByCareerJourneyId(
                    careerJourneyId
                );

        if (!roadmap) {

            throw new AppError(
                404,
                "Roadmap not found."
            );
        }
        /*
        |--------------------------------------------------------------------------
        | Existing Active Mission
        |--------------------------------------------------------------------------
        */

        const activeMission =
            await missionService
                .getActiveMissionByRoadmap(
                    roadmap._id
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
            await missionService
                .getLatestMissionByRoadmap(
                    roadmap._id
                );

        /*
        |--------------------------------------------------------------------------
        | No Mission Has Ever Been Generated
        |--------------------------------------------------------------------------
        */

        if (!latestMission) {
            return {
                state:
                    MissionLifecycleState
                        .INITIAL_MISSION_REQUIRED,

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
                "Latest mission is not in a valid state for next mission generation."
            );
        }

        /*
        |--------------------------------------------------------------------------
        | Check Remaining Roadmap Work
        |--------------------------------------------------------------------------
        */

        const pendingRoadmapItems =
            await roadmapItemRepository
                .findPendingItems(
                    roadmap._id
                );

        if (
            roadmap.status ===
            RoadmapStatus.COMPLETED
        ) {

            return {
                state:
                    MissionLifecycleState
                        .ROADMAP_COMPLETED,

                mission:
                    null,

                nextMissionAvailableAt:
                    null,
            };
        }

        /*
        |--------------------------------------------------------------------------
        | Calculate Next Mission Availability
        |--------------------------------------------------------------------------
        */

        const nextMissionAvailableAt =
            this.calculateNextMissionAvailableAt(
                latestMission.endDate
            );

        const today =
            startOfDay(
                appClock.now()
            );

        const availableAt =
            startOfDay(
                nextMissionAvailableAt
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
                    MissionLifecycleState
                        .WAITING_FOR_NEXT_MISSION,

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
                    careerJourneyId
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
        previousMissionEndDate: Date
    ): Date {

        return addDays(
            startOfDay(
                previousMissionEndDate
            ),
            1
        );
    }

}

export const missionLifecycleService =
    new MissionLifecycleService();
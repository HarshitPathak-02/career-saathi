import {
    Types,
} from "mongoose";

import {
    AppError,
} from "../../core/errors/app-error.js";

import {
    userRepository,
} from "../users/user.repository.js";

import {
    careerJourneyRepository,
} from "../career-journey/career-journey.repository.js";

import {
    CareerJourneyStatus,
} from "../career-journey/career-journey.enums.js";

import {
    assessmentRepository,
} from "../assessment/assessment.repository.js";

import {
    roadmapRepository,
} from "../roadmap/roadmap.repository.js";

import {
    dailyTaskRepository,
} from "../daily-task/daily-task.repository.js";

import {
    dailyTaskService,
} from "../daily-task/daily-task.service.js";

import {
    AssessmentType,
} from "../assessment/assessment.enums.js";

import {
    missionLifecycleService,
} from "../mission/mission-lifecycle.service.js";

import {
    MissionLifecycleState,
} from "../mission/mission-lifecycle.types.js";

import {
    WorkspaceMapper,
} from "./workspace.mapper.js";
import { DEFAULT_DURATION_DAYS } from "../mission/mission.constants.js";
import { missionService } from "../mission/index.js";
import { missionRepository } from "../mission/mission.repository.js";
import { HTTP_STATUS } from "../../core/constants/http-status.constants.js";
import { appClock } from "../../shared/time/app-clock.js";
import {
    addDays,
    startOfDay,
} from "../../shared/utils/date.util.js";


export class WorkspaceService {

    async getWorkspace(
        userId: string
    ) {

        const userObjectId =
            new Types.ObjectId(
                userId
            );

        /*
        |--------------------------------------------------------------------------
        | User
        |--------------------------------------------------------------------------
        */

        const user =
            await userRepository
                .findById(
                    userId
                );


        if (!user) {

            throw new AppError(
                HTTP_STATUS.NOT_FOUND,
                "User not found."
            );

        }


        /*
        |--------------------------------------------------------------------------
        | Current Career Journey
        |--------------------------------------------------------------------------
        |
        | findActiveByUserId includes:
        |
        | DRAFT
        | ACTIVE
        | READINESS
        | READY
        |
        |--------------------------------------------------------------------------
        */

        const careerJourney =
            await careerJourneyRepository
                .findActiveByUserId(
                    userObjectId
                );


        if (!careerJourney) {

            throw new AppError(
                HTTP_STATUS.NOT_FOUND,
                "Active career journey not found."
            );

        }


        /*
        |--------------------------------------------------------------------------
        | Initial Assessment + Current Roadmap
        |--------------------------------------------------------------------------
        */

        const [
            assessment,
            roadmap,
        ] =
            await Promise.all([

                assessmentRepository
                    .findOne({

                        careerJourneyId:
                            careerJourney._id,

                        type:
                            AssessmentType
                                .INITIAL,

                    }),

                roadmapRepository
                    .findLatestByCareerJourneyId(
                        careerJourney._id
                    )

            ]);


        /*
        |--------------------------------------------------------------------------
        | Mission Lifecycle
        |--------------------------------------------------------------------------
        */

        let lifecycleState:
            MissionLifecycleState | null =
            null;

        let activeMission =
            null;

        let nextMissionAvailableAt:
            Date | null =
            null;


        /*
         * Mission lifecycle only belongs
         * to the ACTIVE learning stage.
         *
         * Once the career journey enters:
         *
         * READINESS
         * READY
         *
         * we must not attempt to resolve
         * or generate another mission.
         */

        if (
            roadmap &&
            careerJourney.status ===
            CareerJourneyStatus.ACTIVE
        ) {

            const lifecycle =
                await missionLifecycleService
                    .resolveMission(
                        userId,
                        careerJourney._id
                    );


            lifecycleState =
                lifecycle.state;

            activeMission =
                lifecycle.mission;

            nextMissionAvailableAt =
                lifecycle
                    .nextMissionAvailableAt;

        }


        /*
        |--------------------------------------------------------------------------
        | Active Mission Tasks
        |--------------------------------------------------------------------------
        */

        const tasks =
            activeMission
                ? await dailyTaskRepository
                    .findByMissionId(
                        activeMission._id
                    )
                : [];


        /*
        |--------------------------------------------------------------------------
        | Today's Mission State
        |--------------------------------------------------------------------------
        */

        let today:
            {
                dayNumber: number;
                remainingDays: number;
            } | null =
            null;


        let todayTask =
            null;


        if (activeMission) {

            const currentMissionDay =
                await missionService
                    .getCurrentMissionDay(
                        activeMission._id
                    );

            today = {

                dayNumber:
                    currentMissionDay,

                remainingDays:
                    Math.max(
                        DEFAULT_DURATION_DAYS -
                        currentMissionDay,
                        0
                    ),

            };

            todayTask =
                await dailyTaskService
                    .getTaskByMissionAndDay(
                        activeMission._id,
                        currentMissionDay
                    );

        }


        /*
        |--------------------------------------------------------------------------
        | Career Target
        |--------------------------------------------------------------------------
        */

        const targetRole =
            careerJourney
                .roleId
                .name;


        const targetDomain =
            careerJourney
                .domainId
                .name;


        /*
        |--------------------------------------------------------------------------
        | Consecutive Day Streak
        |--------------------------------------------------------------------------
        */

        const streak =
            await this.calculateStreak(
                careerJourney._id
            );


        /*
        |--------------------------------------------------------------------------
        | Workspace Response
        |--------------------------------------------------------------------------
        */

        return WorkspaceMapper
            .toResponse({

                user,

                careerJourney,

                assessment,

                roadmap,

                activeMission,

                tasks,

                today,

                todayTask,

                targetRole,

                targetDomain,

                lifecycleState,

                nextMissionAvailableAt,

                streak,

            });

    }

    /*
    |--------------------------------------------------------------------------
    | Streak
    |--------------------------------------------------------------------------
    |
    | Number of consecutive calendar days (ending today or
    | yesterday) on which at least one mission task was
    | completed.
    |
    */

    private async calculateStreak(
        careerJourneyId: Types.ObjectId
    ): Promise<number> {

        const missionIds =
            await missionRepository
                .findMissionIdsByCareerJourney(
                    careerJourneyId
                );

        const completedDates =
            await dailyTaskRepository
                .findCompletedDatesByMissionIds(
                    missionIds
                );

        if (completedDates.length === 0) {
            return 0;
        }

        const completedDays =
            new Set(
                completedDates.map(
                    (date) =>
                        startOfDay(date)
                            .getTime()
                )
            );

        let cursor =
            startOfDay(
                appClock.now()
            );

        /*
         * Today may not be completed yet, so fall
         * back to yesterday before counting.
         */
        if (!completedDays.has(cursor.getTime())) {
            cursor = addDays(cursor, -1);
        }

        let streak = 0;

        while (completedDays.has(cursor.getTime())) {
            streak += 1;
            cursor = addDays(cursor, -1);
        }

        return streak;
    }

}


export const workspaceService =
    new WorkspaceService();
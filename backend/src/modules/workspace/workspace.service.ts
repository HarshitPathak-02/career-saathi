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
import { HTTP_STATUS } from "../../core/constants/http-status.constants.js";


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

            });

    }

}


export const workspaceService =
    new WorkspaceService();
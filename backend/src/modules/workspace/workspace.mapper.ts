import {
    AssessmentDocument,
} from "../assessment/assessment.model.js";

import {
    DailyTaskDocument,
} from "../daily-task/daily-task.model.js";

import {
    DailyTaskStatus,
} from "../daily-task/daily-task.enums.js";

import {
    MissionDocument,
} from "../mission/mission.model.js";

import {
    MissionLifecycleState,
} from "../mission/mission-lifecycle.types.js";

import {
    RoadmapDocument,
} from "../roadmap/roadmap.model.js";

import {
    UserDocument,
} from "../users/user.model.js";

import {
    WorkspaceState,
} from "./workspace.enums.js";

import {
    WorkspaceResponseDto,
} from "./workspace-response.dto.js";

import {
    PopulatedCareerJourneyDocument,
} from "../career-journey/career-journey.types.js";

interface WorkspaceMapperInput {

    user:
    UserDocument;

    careerJourney:
    PopulatedCareerJourneyDocument;

    assessment:
    AssessmentDocument | null;

    roadmap:
    RoadmapDocument | null;

    activeMission:
    MissionDocument | null;

    tasks:
    DailyTaskDocument[];

    today: {
        dayNumber: number;
        remainingDays: number;
    } | null;

    todayTask:
    DailyTaskDocument | null;

    targetRole:
    string;

    targetDomain:
    string;

    lifecycleState:
    MissionLifecycleState | null;

    nextMissionAvailableAt:
    Date | null;

}

export class WorkspaceMapper {

    /*
    |--------------------------------------------------------------------------
    | Workspace Response
    |--------------------------------------------------------------------------
    */

    static toResponse(
        input: WorkspaceMapperInput
    ): WorkspaceResponseDto {

        const {
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
        } = input;

        /*
        |--------------------------------------------------------------------------
        | Availability Flags
        |--------------------------------------------------------------------------
        */

        const hasInitialAssessment =
            Boolean(assessment);

        const hasRoadmap =
            Boolean(roadmap);

        /*
        |--------------------------------------------------------------------------
        | Workspace State
        |--------------------------------------------------------------------------
        */

        const workspaceState =
            this.getWorkspaceState(
                hasInitialAssessment,
                hasRoadmap,
                lifecycleState
            );

        /*
        |--------------------------------------------------------------------------
        | Mission Progress
        |--------------------------------------------------------------------------
        */

        const completedTasks =
            tasks.filter(
                task =>
                    task.status ===
                    DailyTaskStatus.COMPLETED
            ).length;

        const totalTasks =
            tasks.length;

        const progressPercentage =
            totalTasks > 0
                ? Math.round(
                    (
                        completedTasks /
                        totalTasks
                    ) * 100
                )
                : 0;

        /*
        |--------------------------------------------------------------------------
        | Actions
        |--------------------------------------------------------------------------
        */

        const canStartAssessment =
            !hasInitialAssessment;

        const canGenerateRoadmap =
            hasInitialAssessment &&
            !hasRoadmap;

        const canStartJourney =
            hasInitialAssessment &&
            hasRoadmap &&
            lifecycleState ===
            MissionLifecycleState
                .INITIAL_MISSION_REQUIRED;

        /*
        |--------------------------------------------------------------------------
        | Response
        |--------------------------------------------------------------------------
        */

        return {

            workspaceState,

            user: {

                id:
                    user._id.toString(),

                fullName:
                    user.fullName,

            },

            careerJourney: {

                id:
                    careerJourney
                        ._id
                        .toString(),

                roleId:
                    careerJourney
                        .roleId
                        ._id
                        .toString(),

                domainId:
                    careerJourney
                        .domainId
                        ._id
                        .toString(),

                targetRole,

                targetDomain,

                targetCompany:
                    careerJourney
                        .targetCompany ??
                    "",

                targetDurationMonths:
                    careerJourney
                        .targetDurationMonths,

                dailyStudyHours:
                    careerJourney
                        .dailyStudyHours,

            },

            overview: {

                currentMission:
                    activeMission
                        ?.missionNumber ??
                    0,

                currentWeek:
                    activeMission
                        ?.missionNumber ??
                    0,

                completedTasks,

                totalTasks,

                progressPercentage,

                // TODO:
                // Implement streak calculation.
                streak:
                    0,

            },

            actions: {

                canStartAssessment,

                canGenerateRoadmap,

                canStartJourney,

            },

            activeMission:
                activeMission
                    ? {

                        id:
                            activeMission
                                ._id
                                .toString(),

                        missionNumber:
                            activeMission
                                .missionNumber,

                        startDate:
                            activeMission
                                .startDate,

                        endDate:
                            activeMission
                                .endDate,

                        status:
                            activeMission
                                .status,

                    }
                    : null,

            today,

            todayTask:
                todayTask
                    ? {

                        id:
                            todayTask
                                ._id
                                .toString(),

                        dayNumber:
                            todayTask
                                .dayNumber,

                        title:
                            todayTask
                                .title,

                        description:
                            todayTask
                                .description,

                        topics:
                            todayTask
                                .topics,

                        estimatedMinutes:
                            todayTask
                                .estimatedMinutes,

                        status:
                            todayTask
                                .status,

                        type:
                            todayTask
                                .type,

                        completedAt:
                            todayTask
                                .completedAt ??
                            null,

                    }
                    : null,

            nextMissionAvailableAt,

        };

    }

    /*
    |--------------------------------------------------------------------------
    | Resolve Workspace State
    |--------------------------------------------------------------------------
    */

    private static getWorkspaceState(
        hasAssessment: boolean,
        hasRoadmap: boolean,
        lifecycleState:
            MissionLifecycleState | null
    ): WorkspaceState {

        if (!hasAssessment) {

            return WorkspaceState
                .INITIAL_ASSESSMENT;

        }

        if (!hasRoadmap) {

            return WorkspaceState
                .ROADMAP_PENDING;

        }

        if (
            lifecycleState ===
            MissionLifecycleState
                .INITIAL_MISSION_REQUIRED
        ) {

            return WorkspaceState
                .MISSION_PENDING;

        }

        if (
            lifecycleState ===
            MissionLifecycleState
                .WAITING_FOR_NEXT_MISSION
        ) {

            return WorkspaceState
                .NEXT_MISSION_PENDING;

        }

        if (
            lifecycleState ===
            MissionLifecycleState
                .ROADMAP_COMPLETED
        ) {

            return WorkspaceState
                .ROADMAP_COMPLETED;

        }

        if (
            lifecycleState ===
            MissionLifecycleState.ACTIVE
        ) {

            return WorkspaceState
                .ACTIVE;

        }

        throw new Error(
            "Unable to determine workspace state."
        );

    }

}
import {
    AssessmentDocument,
} from "../assessment/assessment.schema.js";

import {
    CareerJourneyDocument,
} from "../career-journey/career-journey.model.js";

import {
    DailyTaskDocument,
} from "../daily-task/daily-task.schema.js";

import {
    MissionDocument,
} from "../mission/mission.schema.js";

import {
    RoadmapDocument,
} from "../roadmap/roadmap.schema.js";

import {
    UserDocument,
} from "../../modules/users/user.model.js";

import {
    WorkspaceState,
} from "./workspace.enums.js";

import {
    WorkspaceResponseDto,
} from "./workspace-response.dto.js";

interface WorkspaceMapperInput {
    user: UserDocument;

    careerJourney: CareerJourneyDocument;

    assessment: AssessmentDocument | null;

    roadmap: RoadmapDocument | null;

    activeMission: MissionDocument | null;

    tasks: DailyTaskDocument[];

    targetRole: string;

    targetDomain: string;
}

export class WorkspaceMapper {

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
            targetRole,
            targetDomain,
        } = input;

        const hasInitialAssessment =
            !!assessment;

        const hasRoadmap =
            !!roadmap;

        const hasActiveMission =
            !!activeMission;

        const workspaceState =
            this.getWorkspaceState(
                hasInitialAssessment,
                hasRoadmap,
                hasActiveMission
            );

        const completedTasks =
            tasks.filter(
                task =>
                    task.status === "COMPLETED"
            ).length;

        const totalTasks =
            tasks.length;

        const progressPercentage =
            totalTasks > 0
                ? Math.round(
                    (completedTasks / totalTasks) *
                    100
                )
                : 0;

        return {
            workspaceState,

            user: {
                id: user._id.toString(),

                firstName: user.fullName,
            },

            careerJourney: {
                id:
                    careerJourney._id.toString(),

                targetRole,

                targetDomain,

                targetCompany:
                    careerJourney.targetCompany ?? "",

                targetDurationMonths:
                    careerJourney.targetDurationMonths,

                dailyStudyHours:
                    careerJourney.dailyStudyHours,
            },

            overview: {
                currentMission:
                    activeMission?.missionNumber ?? 0,

                currentWeek:
                    activeMission?.missionNumber ?? 0,

                completedTasks,

                totalTasks,

                progressPercentage,

                // We don't have streak calculation yet.
                streak: 0,
            },

            actions: {
                canStartAssessment:
                    !hasInitialAssessment,

                canGenerateRoadmap:
                    hasInitialAssessment &&
                    !hasRoadmap,

                canStartJourney:
                    hasInitialAssessment &&
                    hasRoadmap &&
                    !hasActiveMission,
            },

            activeMission:
                activeMission
                    ? {
                        id:
                            activeMission._id.toString(),

                        missionNumber:
                            activeMission.missionNumber,

                        startDate:
                            activeMission.startDate,

                        endDate:
                            activeMission.endDate,

                        status:
                            activeMission.status,
                    }
                    : null,

            tasks: tasks.map(task => ({
                id:
                    task._id.toString(),

                dayNumber:
                    task.dayNumber,

                title:
                    task.title,

                description:
                    task.description,

                topics:
                    task.topics,

                estimatedMinutes:
                    task.estimatedMinutes,

                status:
                    task.status,

                type:
                    task.type,

                completedAt:
                    task.completedAt ?? null,
            })),
        };
    }

    private static getWorkspaceState(
        hasAssessment: boolean,
        hasRoadmap: boolean,
        hasMission: boolean
    ): WorkspaceState {

        if (!hasAssessment) {
            return WorkspaceState.INITIAL_ASSESSMENT;
        }

        if (!hasRoadmap) {
            return WorkspaceState.ROADMAP_PENDING;
        }

        if (!hasMission) {
            return WorkspaceState.MISSION_PENDING;
        }

        return WorkspaceState.ACTIVE;
    }
}
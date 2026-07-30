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

export class WorkspaceService {

    private calculateMissionDay(
        startDate: Date,
        totalDays: number
    ) {

        const today =
            new Date();

        today.setHours(
            0,
            0,
            0,
            0
        );

        const missionStart =
            new Date(startDate);

        missionStart.setHours(
            0,
            0,
            0,
            0
        );

        const differenceInDays =
            Math.floor(
                (
                    today.getTime() -
                    missionStart.getTime()
                ) /
                (
                    1000 *
                    60 *
                    60 *
                    24
                )
            );

        const dayNumber =
            Math.min(
                Math.max(
                    differenceInDays + 1,
                    1
                ),
                totalDays
            );

        return {

            dayNumber,

            remainingDays:
                totalDays -
                dayNumber,

        };

    }

    async getWorkspace(
        userId: string
    ) {

        const userObjectId =
            new Types.ObjectId(
                userId
            );

        const user =
            await userRepository
                .findById(
                    userId
                );

        if (!user) {

            throw new AppError(
                404,
                "User not found."
            );

        }

        const careerJourney =
            await careerJourneyRepository
                .findActiveByUserId(
                    userObjectId
                );

        if (!careerJourney) {

            throw new AppError(
                404,
                "Active career journey not found."
            );

        }

        const [
            assessment,
            roadmap,
        ] = await Promise.all([

            assessmentRepository
                .findOne({

                    careerJourneyId:
                        careerJourney._id,

                    type:
                        AssessmentType.INITIAL,

                }),

            roadmapRepository
                .findByCareerJourneyId(
                    careerJourney._id
                ),

        ]);

        let lifecycleState:
            MissionLifecycleState | null =
            null;

        let activeMission =
            null;

        let nextMissionAvailableAt:
            Date | null =
            null;

        if (roadmap) {

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
                lifecycle.nextMissionAvailableAt;

        }

        const tasks =
            activeMission
                ? await dailyTaskRepository
                    .findByMissionId(
                        activeMission._id
                    )
                : [];

        let today:
            {
                dayNumber: number;
                remainingDays: number;
            } | null =
            null;

        let todayTask =
            null;

        if (activeMission) {

            const millisecondsPerDay =
                1000 *
                60 *
                60 *
                24;

            const missionDuration =
                Math.floor(
                    (
                        activeMission
                            .endDate
                            .getTime() -
                        activeMission
                            .startDate
                            .getTime()
                    ) /
                    millisecondsPerDay
                ) + 1;

            today =
                this.calculateMissionDay(
                    activeMission.startDate,
                    missionDuration
                );

            todayTask =
                await dailyTaskService
                    .getTaskByMissionAndDay(
                        activeMission._id,
                        today.dayNumber
                    );

        }

        const targetRole =
            careerJourney.roleId.name;

        const targetDomain =
            careerJourney.domainId.name;

        return WorkspaceMapper.toResponse({

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
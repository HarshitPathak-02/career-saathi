import { AppError } from '../../core/errors/app-error.js';
import { HTTP_STATUS } from '../../core/constants/http-status.constants.js';

import { DashboardResponse } from './dashboard.types.js';

import { careerJourneyRepository } from '../career-journey/career-journey.repository.js';
import { roadmapRepository } from '../roadmaps/roadmap.repository.js';
import { roadmapPhaseRepository } from '../roadmap-phase/roadmap-phase.repository.js';
import { missionRepository } from '../mission/mission.repository.js';
import { taskRepository } from '../task/task.repository.js';

import { ProgressStatus } from '../../shared/enums/progress-status.enums.js';

class DashboardService {

    async getDashboard(
        userId: string
    ): Promise<DashboardResponse> {
        const journey =
            await careerJourneyRepository
                .findActiveByUserId(userId);

        if (!journey) {

            throw new AppError(

                HTTP_STATUS.NOT_FOUND,

                'Active career journey not found.'
            );
        }

        const roadmap =
            await roadmapRepository
                .findActiveByJourneyId(
                    journey.id
                );

        if (!roadmap) {

            throw new AppError(

                HTTP_STATUS.NOT_FOUND,

                'Active roadmap not found.'
            );
        }

        const currentPhase =
            await roadmapPhaseRepository
                .findCurrentPhase(
                    roadmap.id
                );

        const currentMission =
            currentPhase
                ? await missionRepository
                    .findCurrentMission(
                        currentPhase.id
                    )
                : null;

        const currentTask =
            currentMission
                ? await taskRepository
                    .findCurrentTask(
                        currentMission.id
                    )
                : null;

        const statistics =
            await this.buildStatistics(
                roadmap.id
            );

        return {

            careerJourney: {

                id: journey.id,

                title: journey.title,
            },

            roadmap: {

                id: roadmap.id,

                title: roadmap.title,
            },

            currentPhase:
                currentPhase
                    ? {

                        id: currentPhase.id,

                        title: currentPhase.title,

                        progress:
                            currentPhase.progress,
                    }
                    : null,

            currentMission:
                currentMission
                    ? {

                        id: currentMission.id,

                        title:
                            currentMission.title,

                        progress:
                            currentMission.progress,
                    }
                    : null,

            currentTask:
                currentTask
                    ? {

                        id:
                            currentTask.id,

                        title:
                            currentTask.title,

                        progress:
                            currentTask.progress,

                        taskType:
                            currentTask.taskType,
                    }
                    : null,

            statistics,
        };
    }

    private async buildStatistics(
        roadmapId: string
    ): Promise<{

        roadmapProgress: number;

        completedTasks: number;

        totalTasks: number;

        completedMissions: number;

        totalMissions: number;

        completedPhases: number;

        totalPhases: number;
    }> {
        const phases =
            await roadmapPhaseRepository
                .findByRoadmapId(
                    roadmapId
                );

        let completedPhases = 0;

        let completedMissions = 0;

        let completedTasks = 0;

        let totalMissions = 0;

        let totalTasks = 0;

        const totalPhases =
            phases.length;

        for (const phase of phases) {

            if (
                phase.status ===
                ProgressStatus.COMPLETED
            ) {

                completedPhases++;
            }

            const missions =
                await missionRepository
                    .findByPhaseId(
                        phase.id
                    );

            totalMissions +=
                missions.length;

            for (const mission of missions) {

                if (
                    mission.status ===
                    ProgressStatus.COMPLETED
                ) {

                    completedMissions++;
                }

                const tasks =
                    await taskRepository
                        .findByMissionId(
                            mission.id
                        );

                totalTasks +=
                    tasks.length;

                for (const task of tasks) {

                    if (
                        task.status ===
                        ProgressStatus.COMPLETED
                    ) {

                        completedTasks++;
                    }
                }
            }
        }

        const roadmapProgress =

            totalPhases === 0

                ? 0

                : Math.round(

                    (
                        completedPhases /

                        totalPhases
                    ) * 100
                );

        return {

            roadmapProgress,

            completedTasks,

            totalTasks,

            completedMissions,

            totalMissions,

            completedPhases,

            totalPhases,
        };
    }


}

export const dashboardService =
    new DashboardService();
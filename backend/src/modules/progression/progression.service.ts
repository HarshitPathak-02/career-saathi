import {
    ClientSession,
} from 'mongoose';

import {
    AppError,
} from '../../core/errors/app-error.js';

import {
    HTTP_STATUS,
} from '../../core/constants/http-status.constants.js';

import {
    ProgressStatus,
} from '../../shared/enums/progress-status.enums.js';

import {
    taskRepository,
} from '../task/task.repository.js';

import {
    missionRepository,
} from '../mission/mission.repository.js';

import {
    roadmapPhaseRepository,
} from '../roadmap-phase/roadmap-phase.repository.js';

class ProgressionService {

    async handleTaskCompletion(
        taskId: string,
        session?: ClientSession
    ): Promise<void> {

        const task =
            await taskRepository.findById(
                taskId,
                session
            );

        if (!task) {

            throw new AppError(
                HTTP_STATUS.NOT_FOUND,
                'Task not found.'
            );
        }

        await this.unlockNextTask(
            task.missionId.toString(),
            task.order,
            session
        );

        await this.updateMissionProgress(
            task.missionId.toString(),
            session
        );
    }

    async handlePhaseAssessmentPassed(
        phaseId: string,
        session?: ClientSession
    ): Promise<void> {

        const phase =
            await roadmapPhaseRepository.findById(
                phaseId,
                session
            );

        if (!phase) {

            throw new AppError(
                HTTP_STATUS.NOT_FOUND,
                'Roadmap phase not found.'
            );
        }

        if (
            phase.status ===
            ProgressStatus.COMPLETED
        ) {

            return;
        }

        if (
            phase.status !==
            ProgressStatus.ASSESSMENT_PENDING
        ) {

            throw new AppError(
                HTTP_STATUS.BAD_REQUEST,
                'Phase assessment is not pending.'
            );
        }

        const completedPhase =
            await roadmapPhaseRepository.updateById(
                phase.id,
                {
                    status:
                        ProgressStatus.COMPLETED,

                    progress:
                        100,

                    completedAt:
                        new Date(),
                },
                session
            );

        if (!completedPhase) {

            throw new AppError(
                HTTP_STATUS.INTERNAL_SERVER_ERROR,
                'Failed to complete roadmap phase.'
            );
        }

        const nextPhase =
            await this.unlockNextPhase(
                phase.roadmapId.toString(),
                phase.order,
                session
            );

        if (!nextPhase) {

            return;
        }

        await this.initializePhase(
            nextPhase.id,
            session
        );
    }

    private async updateMissionProgress(
        missionId: string,
        session?: ClientSession
    ): Promise<void> {

        const completedTasks =
            await taskRepository.findCompletedTasks(
                missionId,
                session
            );

        const allTasks =
            await taskRepository.findByMissionId(
                missionId,
                session
            );

        const progress =
            this.calculateProgress(
                completedTasks.length,
                allTasks.length
            );

        const mission =
            await missionRepository.updateById(
                missionId,
                {
                    completedTaskCount:
                        completedTasks.length,

                    taskCount:
                        allTasks.length,

                    progress,
                },
                session
            );

        if (!mission) {

            throw new AppError(
                HTTP_STATUS.NOT_FOUND,
                'Mission not found.'
            );
        }

        if (
            progress === 100
        ) {

            await this.completeMission(
                mission.id,
                session
            );
        }
    }

    private async completeMission(
        missionId: string,
        session?: ClientSession
    ): Promise<void> {

        const mission =
            await missionRepository.findById(
                missionId,
                session
            );

        if (!mission) {

            throw new AppError(
                HTTP_STATUS.NOT_FOUND,
                'Mission not found.'
            );
        }

        if (
            mission.status ===
            ProgressStatus.COMPLETED
        ) {

            return;
        }

        const completedMission =
            await missionRepository.updateById(
                mission.id,
                {
                    status:
                        ProgressStatus.COMPLETED,

                    progress:
                        100,

                    completedAt:
                        new Date(),
                },
                session
            );

        if (!completedMission) {

            throw new AppError(
                HTTP_STATUS.INTERNAL_SERVER_ERROR,
                'Failed to complete mission.'
            );
        }

        const nextMission =
            await this.unlockNextMission(
                mission.roadmapPhaseId.toString(),
                mission.order,
                session
            );

        if (nextMission) {

            await this.unlockFirstTask(
                nextMission.id,
                session
            );
        }

        await this.updatePhaseProgress(
            mission.roadmapPhaseId.toString(),
            session
        );
    }

    private async updatePhaseProgress(
        phaseId: string,
        session?: ClientSession
    ): Promise<void> {

        const completedMissions =
            await missionRepository.findCompletedMissions(
                phaseId,
                session
            );

        const allMissions =
            await missionRepository.findByPhaseId(
                phaseId,
                session
            );
        const progress =
            this.calculateProgress(
                completedMissions.length,
                allMissions.length
            );

        const phase =
            await roadmapPhaseRepository.updateById(
                phaseId,
                {
                    completedMissionCount:
                        completedMissions.length,

                    missionCount:
                        allMissions.length,

                    progress,
                },
                session
            );

        if (!phase) {

            throw new AppError(
                HTTP_STATUS.NOT_FOUND,
                'Roadmap phase not found.'
            );
        }

        if (
            progress !== 100 ||
            phase.status ===
            ProgressStatus.ASSESSMENT_PENDING ||
            phase.status ===
            ProgressStatus.COMPLETED
        ) {

            return;
        }

        const pendingPhase =
            await roadmapPhaseRepository.updateById(
                phase.id,
                {
                    status:
                        ProgressStatus.ASSESSMENT_PENDING,

                    progress:
                        100,
                },
                session
            );

        if (!pendingPhase) {

            throw new AppError(
                HTTP_STATUS.INTERNAL_SERVER_ERROR,
                'Failed to mark phase assessment as pending.'
            );
        }
    }

    private async unlockNextTask(
        missionId: string,
        currentOrder: number,
        session?: ClientSession
    ): Promise<void> {

        const nextTask =
            await taskRepository.findByOrder(
                missionId,
                currentOrder + 1,
                session
            );

        if (
            !nextTask ||
            nextTask.status !==
            ProgressStatus.LOCKED
        ) {

            return;
        }

        const updatedTask =
            await taskRepository.updateById(
                nextTask.id,
                {
                    status:
                        ProgressStatus.AVAILABLE,

                    unlockedAt:
                        new Date(),
                },
                session
            );

        if (!updatedTask) {

            throw new AppError(
                HTTP_STATUS.INTERNAL_SERVER_ERROR,
                'Failed to unlock next task.'
            );
        }
    }

    private async unlockNextMission(
        phaseId: string,
        currentOrder: number,
        session?: ClientSession
    ) {

        const nextMission =
            await missionRepository.findByOrder(
                phaseId,
                currentOrder + 1,
                session
            );

        if (!nextMission) {

            return null;
        }

        if (
            nextMission.status !==
            ProgressStatus.LOCKED
        ) {

            return nextMission;
        }

        const updatedMission =
            await missionRepository.updateById(
                nextMission.id,
                {
                    status:
                        ProgressStatus.AVAILABLE,

                    unlockedAt:
                        new Date(),
                },
                session
            );

        if (!updatedMission) {

            throw new AppError(
                HTTP_STATUS.INTERNAL_SERVER_ERROR,
                'Failed to unlock next mission.'
            );
        }

        return updatedMission;
    }

    private async unlockNextPhase(
        roadmapId: string,
        currentOrder: number,
        session?: ClientSession
    ) {

        const nextPhase =
            await roadmapPhaseRepository.findByOrder(
                roadmapId,
                currentOrder + 1,
                session
            );

        if (!nextPhase) {

            return null;
        }

        if (
            nextPhase.status !==
            ProgressStatus.LOCKED
        ) {

            return nextPhase;
        }

        const updatedPhase =
            await roadmapPhaseRepository.updateById(
                nextPhase.id,
                {
                    status:
                        ProgressStatus.AVAILABLE,

                    unlockedAt:
                        new Date(),
                },
                session
            );

        if (!updatedPhase) {

            throw new AppError(
                HTTP_STATUS.INTERNAL_SERVER_ERROR,
                'Failed to unlock next phase.'
            );
        }

        return updatedPhase;
    }

    async initializePhase(
        phaseId: string,
        session?: ClientSession
    ): Promise<void> {

        const firstMission =
            await missionRepository.findFirstMission(
                phaseId,
                session
            );

        if (!firstMission) {

            return;
        }

        let mission =
            firstMission;

        if (
            firstMission.status ===
            ProgressStatus.LOCKED
        ) {

            const updatedMission =
                await missionRepository.updateById(
                    firstMission.id,
                    {
                        status:
                            ProgressStatus.AVAILABLE,

                        unlockedAt:
                            new Date(),
                    },
                    session
                );

            if (!updatedMission) {

                throw new AppError(
                    HTTP_STATUS.INTERNAL_SERVER_ERROR,
                    'Failed to unlock first mission.'
                );
            }

            mission =
                updatedMission;
        }

        await this.unlockFirstTask(
            mission.id,
            session
        );
    }

    private async unlockFirstTask(
        missionId: string,
        session?: ClientSession
    ): Promise<void> {

        const firstTask =
            await taskRepository.findFirstTask(
                missionId,
                session
            );

        if (
            !firstTask ||
            firstTask.status !==
            ProgressStatus.LOCKED
        ) {

            return;
        }

        const updatedTask =
            await taskRepository.updateById(
                firstTask.id,
                {
                    status:
                        ProgressStatus.AVAILABLE,

                    unlockedAt:
                        new Date(),
                },
                session
            );

        if (!updatedTask) {

            throw new AppError(
                HTTP_STATUS.INTERNAL_SERVER_ERROR,
                'Failed to unlock first task.'
            );
        }
    }

    private calculateProgress(
        completedCount: number,
        totalCount: number
    ): number {

        if (
            totalCount === 0
        ) {

            return 0;
        }

        return Math.round(
            (
                completedCount /
                totalCount
            ) * 100
        );
    }
}

export const progressionService =
    new ProgressionService();
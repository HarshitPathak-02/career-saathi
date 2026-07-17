import {
    ClientSession,
    Types,
} from 'mongoose';

import {
    HTTP_STATUS,
} from '../../core/constants/http-status.constants.js';

import {
    AppError,
} from '../../core/errors/app-error.js';

import {
    ProgressStatus,
} from '../../shared/enums/progress-status.enums.js';

import {
    missionService,
} from '../mission/mission.service.js';

import {
    GeneratedTask,
} from '../roadmaps/roadmap.types.js';

import {
    taskRepository,
} from './task.repository.js';

import {
    TaskDocument,
    TaskResponse,
} from './task.types.js';

import {
    toTaskResponse,
} from './task.mapper.js';
import { progressionService } from '../progression/progression.service.js';

class TaskService {

    async getMissionTasks(
        missionId: string
    ): Promise<TaskResponse[]> {

        const tasks =
            await taskRepository.findByMissionId(
                missionId
            );

        return tasks.map(
            toTaskResponse
        );
    }

    async getCurrentTask(
        missionId: string
    ): Promise<TaskDocument | null> {

        return taskRepository.findCurrentTask(
            missionId
        );
    }

    async unlockFirstTask(
        missionId: string,
        session?: ClientSession
    ): Promise<TaskDocument> {

        const firstTask =
            await taskRepository.findFirstTask(
                missionId,
                session
            );

        if (!firstTask) {

            throw new AppError(
                HTTP_STATUS.NOT_FOUND,
                'No tasks found.'
            );
        }

        if (
            firstTask.status !==
            ProgressStatus.LOCKED
        ) {

            return firstTask;
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
                'Failed to unlock task.'
            );
        }

        return updatedTask;
    }

    async updateProgress(
        taskId: string,
        progress: number
    ): Promise<TaskDocument> {

        if (
            progress < 0 ||
            progress > 100
        ) {

            throw new AppError(
                HTTP_STATUS.BAD_REQUEST,
                'Task progress must be between 0 and 100.'
            );
        }

        if (
            progress === 100
        ) {

            return this.completeTask(
                taskId
            );
        }

        const task =
            await taskRepository.updateById(
                taskId,
                {
                    progress,
                }
            );

        if (!task) {

            throw new AppError(
                HTTP_STATUS.NOT_FOUND,
                'Task not found.'
            );
        }

        return task;
    }

    async completeTask(
        taskId: string,
        session?: ClientSession
    ): Promise<TaskDocument> {

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

        if (
            task.status ===
            ProgressStatus.COMPLETED
        ) {

            return task;
        }

        const completedTask =
            await taskRepository.updateById(
                task.id,
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

        if (!completedTask) {

            throw new AppError(
                HTTP_STATUS.INTERNAL_SERVER_ERROR,
                'Failed to complete task.'
            );
        }

        await progressionService.handleTaskCompletion(
            completedTask.id,
            session
        );

        return completedTask;
    }

    async createFromGeneratedTasks(
        userId: string,
        roadmapId: string,
        roadmapPhaseId: string,
        missionId: string,
        tasks: GeneratedTask[],
        session: ClientSession
    ): Promise<TaskDocument[]> {

        const taskData =
            tasks.map(
                (task) => ({

                    userId:
                        new Types.ObjectId(
                            userId
                        ),

                    roadmapId:
                        new Types.ObjectId(
                            roadmapId
                        ),

                    roadmapPhaseId:
                        new Types.ObjectId(
                            roadmapPhaseId
                        ),

                    missionId:
                        new Types.ObjectId(
                            missionId
                        ),

                    title:
                        task.title,

                    description:
                        task.description,

                    order:
                        task.order,

                    estimatedHours:
                        task.estimatedHours,

                    taskType:
                        task.taskType,

                    completionType:
                        task.completionType,

                    skillCode:
                        task.skillCode,

                    topicCodes:
                        task.topicCodes,

                    status:
                        ProgressStatus.LOCKED,

                    progress:
                        0,

                    optional:
                        task.optional,

                    resources:
                        task.resources,
                })
            );

        return taskRepository.createMany(
            taskData,
            session
        );
    }

    async getById(
        taskId: string
    ): Promise<TaskResponse> {

        const task =
            await taskRepository.findById(
                taskId
            );

        if (!task) {

            throw new AppError(
                HTTP_STATUS.NOT_FOUND,
                'Task not found.'
            );
        }

        return toTaskResponse(
            task
        );
    }

    async markAssessmentPending(
        taskId: string,
        session?: ClientSession
    ): Promise<TaskDocument> {

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

        if (
            task.status ===
            ProgressStatus.ASSESSMENT_PENDING
        ) {

            return task;
        }

        if (
            task.status ===
            ProgressStatus.COMPLETED
        ) {

            return task;
        }

        const updatedTask =
            await taskRepository.updateById(
                task.id,
                {
                    status:
                        ProgressStatus.ASSESSMENT_PENDING,

                    progress:
                        100,
                },
                session
            );

        if (!updatedTask) {

            throw new AppError(
                HTTP_STATUS.INTERNAL_SERVER_ERROR,
                'Failed to mark task assessment as pending.'
            );
        }

        return updatedTask;
    }
}

export const taskService =
    new TaskService();
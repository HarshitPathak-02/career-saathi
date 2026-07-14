import { ClientSession, Types } from "mongoose";
import { HTTP_STATUS } from "../../core/constants/http-status.constants.js";
import { AppError } from "../../core/errors/app-error.js";
import { ProgressStatus } from "../../shared/enums/progress-status.enums.js";
import { missionService } from "../mission/mission.service.js";
import { GeneratedTask } from "../roadmaps/roadmap.types.js";
import { taskRepository } from "./task.repository.js";
import { TaskDocument, TaskResponse } from "./task.types.js";
import { toTaskResponse } from "./task.mapper.js";

class TaskService {

    async getMissionTasks(
        missionId: string
    ): Promise<TaskResponse[]> {

        return taskRepository.findByMissionId(
            missionId
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

        if (progress === 100) {

            await this.completeTask(
                task.id
            );
        }

        return task;
    }

    private async completeTask(
        taskId: string
    ): Promise<void> {

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

        await taskRepository.updateById(
            task.id,
            {
                status:
                    ProgressStatus.COMPLETED,

                progress: 100,

                completedAt:
                    new Date(),
            }
        );

        await this.unlockNextTask(
            task.missionId.toString(),
            task.order
        );

        const completedTasks =
            await taskRepository.findCompletedTasks(
                task.missionId.toString()
            );

        const allTasks =
            await taskRepository.findByMissionId(
                task.missionId.toString()
            );

        await missionService.updateProgress(
            task.missionId.toString(),
            completedTasks.length,
            allTasks.length
        );
    }

    private async unlockNextTask(
        missionId: string,
        currentOrder: number
    ): Promise<void> {

        const nextTask =
            await taskRepository.findByOrder(
                missionId,
                currentOrder + 1
            );

        if (!nextTask) {
            return;
        }

        if (
            nextTask.status !==
            ProgressStatus.LOCKED
        ) {
            return;
        }

        await taskRepository.updateById(
            nextTask.id,
            {
                status:
                    ProgressStatus.AVAILABLE,

                unlockedAt:
                    new Date(),
            }
        );
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
            tasks.map(task => ({
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

                status:
                    ProgressStatus.LOCKED,

                progress: 0,

                optional:
                    task.optional,

                resources:
                    task.resources,
            }));

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
}

export const taskService =
    new TaskService();
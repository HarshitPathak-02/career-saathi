import { ClientSession, Types } from 'mongoose';

import { TaskModel } from './task.model.js';

import {
    CreateTaskData,
    TaskDocument,
    UpdateTaskData,
} from './task.types.js';

import { ProgressStatus } from '../../shared/enums/progress-status.enums.js';

class TaskRepository {

    async create(
        data: CreateTaskData,
        session?: ClientSession
    ): Promise<TaskDocument> {

        if (session) {

            const [task] =
                await TaskModel.create(
                    [data],
                    { session }
                );

            return task;
        }

        return TaskModel.create(data);
    }

    async createMany(
        data: CreateTaskData[],
        session?: ClientSession
    ): Promise<TaskDocument[]> {

        return TaskModel.insertMany(
            data,
            {
                session,
            }
        );
    }

    async findById(
        id: string,
        session?: ClientSession
    ): Promise<TaskDocument | null> {

        const query =
            TaskModel.findById(id);

        if (session) {
            query.session(session);
        }

        return query;
    }

    async findByMissionId(
        missionId: string,
        session?: ClientSession
    ): Promise<TaskDocument[]> {

        const query =
            TaskModel.find({

                missionId,

            }).sort({

                order: 1,
            });

        if (session) {
            query.session(session);
        }

        return query;
    }

    async findCurrentTask(
        missionId: string,
        session?: ClientSession
    ): Promise<TaskDocument | null> {

        const query =
            TaskModel.findOne({

                missionId,

                status: {
                    $in: [
                        ProgressStatus.AVAILABLE,
                        ProgressStatus.IN_PROGRESS,
                    ],
                },
            }).sort({

                order: 1,
            });

        if (session) {
            query.session(session);
        }

        return query;
    }

    async findFirstTask(
        missionId: string,
        session?: ClientSession
    ): Promise<TaskDocument | null> {

        const query =
            TaskModel.findOne({

                missionId,

            }).sort({

                order: 1,
            });

        if (session) {
            query.session(session);
        }

        return query;
    }

    async findByOrder(
        missionId: string,
        order: number,
        session?: ClientSession
    ): Promise<TaskDocument | null> {

        const query =
            TaskModel.findOne({

                missionId,

                order,
            });

        if (session) {
            query.session(session);
        }

        return query;
    }

    async findCompletedTasks(
        missionId: string,
        session?: ClientSession
    ): Promise<TaskDocument[]> {

        const query =
            TaskModel.find({

                missionId,

                status:
                    ProgressStatus.COMPLETED,
            });

        if (session) {
            query.session(session);
        }

        return query;
    }

    async updateById(
        id: string,
        data: UpdateTaskData,
        session?: ClientSession
    ): Promise<TaskDocument | null> {

        const query = TaskModel.findByIdAndUpdate(

            id,

            data,

            {

                new: true,

                runValidators: true,

                session,
            }
        );
        if (session) {
            query.session(session);
        }

        return query;
    }

    async deleteById(
        id: string,
        session?: ClientSession
    ) {

        return TaskModel.findByIdAndDelete(
            id,
            {
                session,
            }
        );
    }
    async countByMissionId(
        missionId: string,
        session?: ClientSession
    ): Promise<number> {

        const query =
            TaskModel.countDocuments({
                missionId,
            });

        if (session) {
            query.session(session);
        }

        return query;
    }

    async findCompletedTasksBetweenDates(
        userId: string,
        startDate: Date,
        endDate: Date
    ): Promise<TaskDocument[]> {

        return TaskModel.find({

            userId,

            status: ProgressStatus.COMPLETED,

            completedAt: {

                $gte: startDate,

                $lte: endDate,
            },
        });
    }

    async countTasksForUser(
        userId: string
    ): Promise<number> {

        console.log("User ID:", userId);

        const count = await TaskModel.countDocuments({
            userId: new Types.ObjectId(userId),
        });

        console.log("Task count:", count);

        return count;
    }
}

export const taskRepository =
    new TaskRepository();
import { HydratedDocument, Types } from 'mongoose';

import { ProgressStatus } from '../../shared/enums/progress-status.enums.js';

import {
    CompletionType,
    TaskType,
} from './task.enums.js';

import { ResourceType } from '../roadmaps/roadmap.enums.js';

export interface ITask {

    userId: Types.ObjectId;

    roadmapId: Types.ObjectId;

    roadmapPhaseId: Types.ObjectId;

    missionId: Types.ObjectId;

    title: string;

    description: string;

    order: number;

    estimatedHours: number;

    taskType: TaskType;

    completionType: CompletionType;

    status: ProgressStatus;

    progress: number;

    optional: boolean;

    resources: TaskResource[];

    unlockedAt?: Date;

    startedAt?: Date;

    completedAt?: Date;

    createdAt: Date;

    updatedAt: Date;
}

export interface TaskResource {

    type: ResourceType;

    title: string;

    url?: string;

    platform?: string;

    author?: string;

    estimatedMinutes?: number;
}

export type TaskDocument =
    HydratedDocument<ITask>;

export interface CreateTaskData {

    userId: Types.ObjectId;

    roadmapId: Types.ObjectId;

    roadmapPhaseId: Types.ObjectId;

    missionId: Types.ObjectId;

    title: string;

    description: string;

    order: number;

    estimatedHours: number;

    taskType: TaskType;

    completionType: CompletionType;

    status: ProgressStatus;

    progress: number;

    optional: boolean;

    resources: TaskResource[];

    unlockedAt?: Date;

    startedAt?: Date;

    completedAt?: Date;
}

export interface UpdateTaskData
    extends Partial<
        Omit<
            CreateTaskData,
            'missionId'
        >
    > { }

export interface TaskResponse {

    id: string;

    title: string;

    description: string;

    order: number;

    estimatedHours: number;

    taskType: TaskType;

    completionType: CompletionType;

    status: ProgressStatus;

    progress: number;

    optional: boolean;

    resources: TaskResource[];

    unlockedAt?: Date;

    startedAt?: Date;

    completedAt?: Date;

    createdAt: Date;

    updatedAt: Date;
}
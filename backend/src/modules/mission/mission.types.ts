import {
    HydratedDocument,
    ObjectId,
    Types,
} from "mongoose";

import {
    ProgressStatus,
} from "../../shared/enums/progress-status.enums.js";

export interface IMission {

    userId: ObjectId;

    roadmapId: ObjectId;

    weekNumber: number;

    title: string;

    description: string;

    weekStart?: Date;

    weekEnd?: Date;

    status: ProgressStatus;

    progress: number;

    completedTaskCount: number;

    taskCount: number;

    unlockedAt?: Date;

    startedAt?: Date;

    completedAt?: Date;

    createdAt: Date;

    updatedAt: Date;
}

export type MissionDocument =
    HydratedDocument<IMission>;

export interface CreateMissionData {

    userId: Types.ObjectId;

    roadmapId: Types.ObjectId;

    weekNumber: number;

    title: string;

    description: string;

    weekStart?: Date;

    weekEnd?: Date;

    status: ProgressStatus;

    progress: number;

    completedTaskCount: number;

    taskCount: number;

    unlockedAt?: Date;

    startedAt?: Date;

    completedAt?: Date;
}

export interface UpdateMissionData
    extends Partial<
        Omit<
            CreateMissionData,
            | "userId"
            | "roadmapId"
        >
    > {}

export interface MissionResponse {

    id: string;

    weekNumber: number;

    title: string;

    description: string;

    weekStart?: Date;

    weekEnd?: Date;

    status: ProgressStatus;

    progress: number;

    completedTaskCount: number;

    taskCount: number;

    unlockedAt?: Date;

    startedAt?: Date;

    completedAt?: Date;

    createdAt: Date;

    updatedAt: Date;
}
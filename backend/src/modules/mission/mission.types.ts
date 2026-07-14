import { HydratedDocument, Types } from "mongoose";
import { ProgressStatus } from "../../shared/enums/progress-status.enums.js";

export interface IMission {

    userId: Types.ObjectId;

    roadmapId: Types.ObjectId;

    roadmapPhaseId: Types.ObjectId;

    title: string;

    description: string;

    order: number;

    estimatedDurationDays: number;

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

    roadmapPhaseId: Types.ObjectId;

    title: string;

    description: string;

    order: number;

    estimatedDurationDays: number;

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
            'roadmapPhaseId'
        >
    > { }

export interface MissionResponse {

    id: string;

    title: string;

    description: string;

    order: number;

    estimatedDurationDays: number;

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
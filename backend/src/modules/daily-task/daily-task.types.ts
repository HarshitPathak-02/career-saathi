import { Types } from "mongoose";

import {
    RoadmapItemDocument,
} from "../roadmap/roadmap-item.schema.js";

import {
    DailyTaskStatus,
    DailyTaskType,
} from "./daily-task.enums.js";

export interface CreateDailyTaskDTO {

    missionId: Types.ObjectId;

    dayNumber: number;

    title: string;

    description?: string;

    topics: string[];

    estimatedMinutes: number;

}

export interface UpdateDailyTaskDTO {

    status?: DailyTaskStatus;

    completedAt?: Date;

}

export interface DailyTaskFilter {

    missionId?: Types.ObjectId;

    roadmapItemId?: Types.ObjectId;

    dayNumber?: number;

    status?: DailyTaskStatus;

}

export interface DailyTaskGenerationInput {

    missionId: Types.ObjectId;

    roadmapItems: RoadmapItemDocument[];

}

export interface GeneratedDailyTask {

    missionId: Types.ObjectId;

    dayNumber: number;

    title: string;

    description?: string;

    topics: string[];

    estimatedMinutes: number;

}

export interface DailyTaskGenerationResult {

    tasks: GeneratedDailyTask[];

}

export interface DailyTaskOutput {
    dayNumber: number;
    type?: DailyTaskType;
    title: string;
    description: string;
    topics: string[];
    estimatedMinutes: number;
}

export type DailyTaskGenerationOutput =
    DailyTaskOutput[];
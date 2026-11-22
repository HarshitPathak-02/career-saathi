import { Types } from "mongoose";

import {
    RoadmapItemDocument,
} from "../roadmap/roadmap-item.model.js";

import {
    DailyTaskStatus,
    DailyTaskType,
    TaskResourceType,
} from "./daily-task.enums.js";

export interface TaskResource {
    title: string;
    url: string;
    type: TaskResourceType;
    provider: string;
    description?: string;
    isCareerSaathiOfficial?: boolean;
    isPartner?: boolean;
    partnerName?: string;
    estimatedMinutes?: number;
}

export interface CreateDailyTaskDTO {

    missionId: Types.ObjectId;

    roadmapItemIds: Types.ObjectId[];

    revisionSkillIds?: Types.ObjectId[];

    dayNumber: number;

    title: string;

    description?: string;

    topics: string[];

    estimatedMinutes: number;

    resources?: TaskResource[];

}

export interface UpdateDailyTaskDTO {

    status?: DailyTaskStatus;

    completedAt?: Date;

}

export interface DailyTaskFilter {

    missionId?: Types.ObjectId;

    roadmapItemId?: Types.ObjectId;

    revisionSkillIds?: Types.ObjectId[];

    dayNumber?: number;

    status?: DailyTaskStatus;

}

export interface DailyTaskGenerationInput {

    missionId: Types.ObjectId;

    roadmapItems: RoadmapItemDocument[];

}

export interface GeneratedDailyTask {

    missionId: Types.ObjectId;

    roadmapItemIds: Types.ObjectId[];

    revisionSkillIds: Types.ObjectId[];

    dayNumber: number;

    title: string;

    description?: string;

    topics: string[];

    estimatedMinutes: number;

    resources?: TaskResource[];

}

export interface DailyTaskGenerationResult {

    tasks: GeneratedDailyTask[];

}

export interface DailyTaskOutput {
    dayNumber: number;
    roadmapItemIds?: string[];
    revisionSkillIds?: string[];
    type?: DailyTaskType;
    title: string;
    description: string;
    topics: string[];
    estimatedMinutes: number;
    resources?: TaskResource[];
}

export type DailyTaskGenerationOutput =
    DailyTaskOutput[];

export interface MissionProgress {

    totalDays: number;

    completedDays: number;

    progressPercentage: number;

}

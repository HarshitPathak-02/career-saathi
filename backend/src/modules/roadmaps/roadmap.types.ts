import { HydratedDocument, Types } from 'mongoose';

import {
    ResourceType,
    RoadmapGeneratedBy,
    RoadmapStatus,
} from './roadmap.enums.js';
import { CompletionType, TaskType } from '../task/task.enums.js';

export interface IRoadmap {

    userId: Types.ObjectId;

    careerJourneyId: Types.ObjectId;

    assessmentId: Types.ObjectId;

    title: string;

    description: string;

    status: RoadmapStatus;

    generatedBy: RoadmapGeneratedBy;

    version: number;

    createdAt: Date;

    updatedAt: Date;
}

export type RoadmapDocument =
    HydratedDocument<IRoadmap>;

export interface CreateRoadmapData {

    userId: Types.ObjectId;

    careerJourneyId: Types.ObjectId;

    assessmentId: Types.ObjectId;

    title: string;

    description: string;

    status: RoadmapStatus;

    generatedBy: RoadmapGeneratedBy;

    version: number;
}

export interface UpdateRoadmapData
    extends Partial<
        Omit<
            CreateRoadmapData,
            | 'userId'
            | 'careerJourneyId'
            | 'assessmentId'
        >
    > { }

export interface RoadmapResponse {

    id: string;

    careerJourneyId: string;

    assessmentId: string;

    title: string;

    description: string;

    status: RoadmapStatus;

    generatedBy: RoadmapGeneratedBy;

    version: number;

    createdAt: Date;

    updatedAt: Date;
}


export interface RoadmapGenerationInput {

    userId: string;

    careerJourneyId: string;

    assessmentId: string;
}

export interface GeneratedRoadmap {

    title: string;

    description: string;

    phases: GeneratedPhase[];
}


export interface GeneratedPhase {

    title: string;

    description: string;

    order: number;

    estimatedWeeks: number;

    missions: GeneratedMission[];
}

export interface GeneratedMission {

    title: string;

    description: string;

    order: number;

    tasks: GeneratedTask[];
}

export interface GeneratedTask {

    skillCode: string;

    topicCodes: string[];

    title: string;

    description: string;

    order: number;

    estimatedHours: number;

    taskType: TaskType;

    completionType: CompletionType;

    resources: GeneratedResource[];

    optional: boolean;
}

export interface GeneratedResource {

    type: ResourceType;

    title: string;

    url?: string;

    platform?: string;

    author?: string;

    estimatedMinutes?: number;
}
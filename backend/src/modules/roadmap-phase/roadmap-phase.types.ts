import { HydratedDocument, Types } from 'mongoose';

import { PhaseStatus } from './roadmap-phase.enums.js';
import { ProgressStatus } from '../../shared/enums/progress-status.enums.js';

export interface IRoadmapPhase {

    userId: Types.ObjectId;

    roadmapId: Types.ObjectId;

    title: string;

    description: string;

    order: number;

    estimatedDurationWeeks: number;

    status: ProgressStatus;

    progress: number;

    completedMissionCount: number;

    missionCount: number;

    unlockedAt?: Date;

    startedAt?: Date;

    completedAt?: Date;

    createdAt: Date;

    updatedAt: Date;
}

export type RoadmapPhaseDocument =
    HydratedDocument<IRoadmapPhase>;

export interface CreateRoadmapPhaseData {

    userId: Types.ObjectId;

    roadmapId: Types.ObjectId;

    title: string;

    description: string;

    order: number;

    estimatedDurationWeeks: number;

    status: ProgressStatus;

    progress: number;

    completedMissionCount: number;

    missionCount: number;

    unlockedAt?: Date;

    startedAt?: Date;

    completedAt?: Date;
}

export interface UpdateRoadmapPhaseData
    extends Partial<
        Omit<
            CreateRoadmapPhaseData,
            'roadmapId'
        >
    > {}

    export interface RoadmapPhaseResponse {

    id: string;

    title: string;

    description: string;

    order: number;

    estimatedDurationWeeks: number;

    status: ProgressStatus;

    progress: number;

    completedMissionCount: number;

    missionCount: number;

    unlockedAt?: Date;

    startedAt?: Date;

    completedAt?: Date;

    createdAt: Date;

    updatedAt: Date;
}
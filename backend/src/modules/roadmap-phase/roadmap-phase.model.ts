import mongoose, { Schema } from 'mongoose';

import { IRoadmapPhase } from './roadmap-phase.types.js';
import { PhaseStatus } from './roadmap-phase.enums.js';
import { ProgressStatus } from '../../shared/enums/progress-status.enums.js';

const roadmapPhaseSchema =
    new Schema<IRoadmapPhase>(
        {
            userId: {
                type: Schema.Types.ObjectId,
                ref: 'User',
                required: true,
                index: true,
            },

            roadmapId: {
                type: Schema.Types.ObjectId,
                ref: 'Roadmap',
                required: true,
                index: true,
            },

            title: {
                type: String,
                required: true,
                trim: true,
            },

            description: {
                type: String,
                required: true,
                trim: true,
            },

            order: {
                type: Number,
                required: true,
                min: 1,
            },

            estimatedDurationWeeks: {
                type: Number,
                required: true,
                min: 1,
            },

            status: {
                type: String,
                enum: Object.values(ProgressStatus),
                default: ProgressStatus.LOCKED,
            },

            progress: {
                type: Number,
                default: 0,
                min: 0,
                max: 100,
            },

            completedMissionCount: {
                type: Number,
                default: 0,
                min: 0,
            },

            missionCount: {
                type: Number,
                default: 0,
                min: 0,
            },

            unlockedAt: Date,

            startedAt: Date,

            completedAt: Date,
        },
        {
            timestamps: true,
        }
    );


roadmapPhaseSchema.index(
    {
        roadmapId: 1,
        order: 1,
    },
    {
        unique: true,
    }
);

roadmapPhaseSchema.index(
    {
        roadmapId: 1,
        userId: 1,
    },
);

export const RoadmapPhaseModel =
    mongoose.model<IRoadmapPhase>(
        'RoadmapPhase',
        roadmapPhaseSchema
    );
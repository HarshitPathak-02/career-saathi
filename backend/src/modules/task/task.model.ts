import mongoose, { Schema } from 'mongoose';

import { ProgressStatus } from '../../shared/enums/progress-status.enums.js';

import {
    CompletionType,
    TaskType,
} from './task.enums.js';

import { ResourceType } from '../roadmaps/roadmap.enums.js';

import { ITask } from './task.types.js';

const TaskResourceSchema =
    new Schema(
        {



            type: {
                type: String,
                enum: Object.values(
                    ResourceType
                ),
                required: true,
            },

            title: {
                type: String,
                required: true,
                trim: true,
            },

            url: String,

            platform: String,

            author: String,

            estimatedMinutes: Number,
        },
        {
            _id: false,
        }
    );

const TaskSchema =
    new Schema<ITask>(
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
            },

            roadmapPhaseId: {
                type: Schema.Types.ObjectId,
                ref: 'RoadmapPhase',
                required: true,
            },

            missionId: {
                type:
                    Schema.Types.ObjectId,

                ref: 'Mission',

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
            },

            estimatedHours: {
                type: Number,

                required: true,

                default: 1,
            },

            taskType: {
                type: String,

                enum:
                    Object.values(
                        TaskType
                    ),

                required: true,
            },

            completionType: {
                type: String,

                enum:
                    Object.values(
                        CompletionType
                    ),

                required: true,
            },

            status: {
                type: String,

                enum:
                    Object.values(
                        ProgressStatus
                    ),

                default:
                    ProgressStatus.LOCKED,
            },

            progress: {
                type: Number,

                default: 0,

                min: 0,

                max: 100,
            },

            optional: {
                type: Boolean,

                default: false,
            },

            resources: {
                type:
                    [TaskResourceSchema],

                default: [],
            },

            unlockedAt: Date,

            startedAt: Date,

            completedAt: Date,
        },
        {
            timestamps: true,
        }
    );

TaskSchema.index({

    missionId: 1,

    order: 1,
});

TaskSchema.index({

    userId: 1,

    completedAt: 1,
});

TaskSchema.index({

    missionId: 1,

    order: 1,
});

export const TaskModel =
    mongoose.model<ITask>(
        'Task',
        TaskSchema
    );
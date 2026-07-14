import { Schema, model } from 'mongoose';

import {
    IRoadmap,
} from './roadmap.types.js';

import {
    RoadmapGeneratedBy,
    RoadmapStatus,
} from './roadmap.enums.js';

const roadmapSchema =
    new Schema<IRoadmap>(
        {

            userId: {
                type: Schema.Types.ObjectId,
                ref: 'User',
                required: true,
                index: true,
            },

            careerJourneyId: {
                type: Schema.Types.ObjectId,
                ref: 'CareerJourney',
                required: true,
                index: true,
            },

            assessmentId: {
                type: Schema.Types.ObjectId,
                ref: 'Assessment',
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

            status: {
                type: String,
                enum: Object.values(
                    RoadmapStatus
                ),
                required: true,
                default:
                    RoadmapStatus.DRAFT,
                index: true,
            },

            generatedBy: {
                type: String,
                enum: Object.values(
                    RoadmapGeneratedBy
                ),
                required: true,
            },

            version: {
                type: Number,
                required: true,
                default: 1,
            },
        },
        {
            timestamps: true,
        }
    );

roadmapSchema.index({
    careerJourneyId: 1,
    version: -1,
});

roadmapSchema.index({
    userId: 1,
    status: 1,
});

export const RoadmapModel =
    model<IRoadmap>(
        'Roadmap',
        roadmapSchema
    );
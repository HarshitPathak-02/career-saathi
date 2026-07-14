import { Schema, model } from 'mongoose';

import {
    IAssessment,
} from './assessment.types.js';

import {
    AssessmentStatus,
} from './assessment.enums.js';
import { ProficiencyLevel } from '../../shared/enums/proficiency-level.enum.js';

const assessmentSchema =
    new Schema<IAssessment>(
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

            status: {
                type: String,
                enum: Object.values(
                    AssessmentStatus
                ),
                default:
                    AssessmentStatus.IN_PROGRESS,
            },

            overallScore: {
                type: Number,
                default: 0,
                min: 0,
                max: 100,
            },

            overallLevel: {
                type: String,
                enum: Object.values(
                    ProficiencyLevel
                ),
                default:
                    ProficiencyLevel.BEGINNER,
            },

            startedAt: {
                type: Date,
                required: true,
            },

            completedAt: {
                type: Date,
            },
        },
        {
            timestamps: true,
        }
    );


assessmentSchema.index({
    status: 1,
});

export const AssessmentModel =
    model<IAssessment>(
        'Assessment',
        assessmentSchema
    );
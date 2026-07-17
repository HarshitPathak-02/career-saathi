import {
    Schema,
    model,
} from 'mongoose';

import {
    IAssessment,
} from './assessment.types.js';

import {
    AssessmentContextType,
    AssessmentStatus,
} from './assessment.enums.js';

import {
    ProficiencyLevel,
} from '../../shared/enums/proficiency-level.enum.js';

const assessmentSchema =
    new Schema<IAssessment>(
        {
            userId: {
                type:
                    Schema.Types.ObjectId,

                ref:
                    'User',

                required:
                    true,

                index:
                    true,
            },

            careerJourneyId: {
                type:
                    Schema.Types.ObjectId,

                ref:
                    'CareerJourney',

                required:
                    true,

                index:
                    true,
            },

            contextType: {
                type:
                    String,

                enum:
                    Object.values(
                        AssessmentContextType
                    ),

                required:
                    true,

                index:
                    true,
            },

            contextId: {
                type:
                    Schema.Types.ObjectId,

                required:
                    false,
                default: null,

                index:
                    true,
            },

            questionIds: [
                {
                    type:
                        Schema.Types.ObjectId,

                    ref:
                        'AssessmentQuestion',

                    required:
                        true,
                },
            ],

            status: {
                type:
                    String,

                enum:
                    Object.values(
                        AssessmentStatus
                    ),

                default:
                    AssessmentStatus.IN_PROGRESS,

                required:
                    true,
            },

            passingScore: {
                type:
                    Number,

                required:
                    true,

                min:
                    0,

                max:
                    100,
            },

            passed: {
                type:
                    Boolean,

                required:
                    true,

                default:
                    false,
            },

            overallScore: {
                type:
                    Number,

                default:
                    0,

                min:
                    0,

                max:
                    100,
            },

            overallLevel: {
                type:
                    String,

                enum:
                    Object.values(
                        ProficiencyLevel
                    ),

                default:
                    ProficiencyLevel.BEGINNER,
            },

            startedAt: {
                type:
                    Date,

                required:
                    true,
            },

            completedAt: {
                type:
                    Date,
            },
        },
        {
            timestamps:
                true,
        }
    );

assessmentSchema.index({
    status: 1,
});

assessmentSchema.index({
    careerJourneyId: 1,

    contextType: 1,

    contextId: 1,

    status: 1,
});

assessmentSchema.index({
    userId: 1,

    contextType: 1,

    createdAt: -1,
});

export const AssessmentModel =
    model<IAssessment>(
        'Assessment',
        assessmentSchema
    );
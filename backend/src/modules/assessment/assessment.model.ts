import {
    HydratedDocument,
    InferSchemaType,
    Schema,
    Types,
    model,
} from "mongoose";
import { AssessmentStatus, AssessmentType } from "./assessment.enums.js";
import { AssessmentDeliveryMode } from "./assessment-engine.enums.js";
import { ASSESSMENT_COLLECTION, ASSESSMENT_MODEL } from "./assessment.constants.js";


const AssessmentSchema = new Schema(
    {
        careerJourneyId: {
            type: Types.ObjectId,
            ref: "CareerJourney",
            required: true,
            index: true,
        },

        type: {
            type: String,
            enum: Object.values(
                AssessmentType
            ),
            required: true,
        },

        weekNumber: {
            type: Number,
            required: true,
            min: 0,
        },

        title: {
            type: String,
            required: true,
            trim: true,
        },

        description: {
            type: String,
            trim: true,
            default: "",
        },

        skillCatalogIds: {
            type: [
                {
                    type: Types.ObjectId,
                    ref: "SkillCatalog",
                },
            ],
            default: [],
        },

        deliveryMode: {
            type: String,
            enum: Object.values(
                AssessmentDeliveryMode
            ),
            default:
                AssessmentDeliveryMode.INTERNAL,
        },

        status: {
            type: String,
            enum: Object.values(
                AssessmentStatus
            ),
            default:
                AssessmentStatus.PENDING,
            index: true,
        },

        sectionCount: {
            type: Number,
            default: 0,
            min: 0,
        },

        completedSectionCount: {
            type: Number,
            default: 0,
            min: 0,
        },

        startedAt: {
            type: Date,
            default: null,
        },

        completedAt: {
            type: Date,
            default: null,
        },

        isDeleted: {
            type: Boolean,
            default: false,
            index: true,
        },

        deletedAt: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true,
        versionKey: false,
        strict: "throw",
        collection:
            ASSESSMENT_COLLECTION,
    }
);

AssessmentSchema.index({
    careerJourneyId: 1,
    weekNumber: 1,
});

AssessmentSchema.index(
    {
        careerJourneyId: 1,
        type: 1,
        weekNumber: 1,
    },
    {
        unique: true,

        partialFilterExpression: {
            isDeleted: false,
        },
    }
);

export type Assessment =
    InferSchemaType<
        typeof AssessmentSchema
    >;

export type AssessmentDocument =
    HydratedDocument<Assessment>;

export const AssessmentModel =
    model<Assessment>(
        ASSESSMENT_MODEL,
        AssessmentSchema
    );
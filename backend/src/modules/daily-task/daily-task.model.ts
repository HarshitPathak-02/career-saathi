import {
    HydratedDocument,
    InferSchemaType,
    Schema,
    model,
} from "mongoose";

import {
    DAILY_TASK_COLLECTION,
    DAILY_TASK_MODEL,
} from "./daily-task.constants.js";

import {
    DailyTaskStatus,
    DailyTaskType,
    TaskResourceType,
} from "./daily-task.enums.js";

import {
    ROADMAP_ITEM_MODEL,
} from "../roadmap/roadmap-item.constants.js";

import {
    MISSION_MODEL,
} from "../mission/mission.constants.js";

import {
    SKILL_CATALOG_MODEL,
} from "../../master-data/skill-catalog/skill-catalog.constants.js";

const TaskResourceSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        url: {
            type: String,
            required: true,
            trim: true,
        },
        type: {
            type: String,
            enum: Object.values(TaskResourceType),
            required: true,
        },
        provider: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            trim: true,
            default: "",
        },
        isCareerSaathiOfficial: {
            type: Boolean,
            default: false,
        },
        isPartner: {
            type: Boolean,
            default: false,
        },
        partnerName: {
            type: String,
            trim: true,
            default: "",
        },
        estimatedMinutes: {
            type: Number,
            min: 1,
        },
    },
    { _id: false }
);

const DailyTaskSchema =
    new Schema(
        {

            missionId: {
                type: Schema.Types.ObjectId,
                ref: MISSION_MODEL,
                required: true,
            },

            roadmapItemIds: [
                {
                    type: Schema.Types.ObjectId,
                    ref: ROADMAP_ITEM_MODEL,
                },
            ],

            revisionSkillIds: [
                {
                    type: Schema.Types.ObjectId,
                    ref: SKILL_CATALOG_MODEL,
                },
            ],

            dayNumber: {
                type: Number,
                required: true,
                min: 1,
                max: 7,
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

            topics: [
                {
                    type: String,
                    trim: true,
                    required: true,
                },
            ],

            estimatedMinutes: {
                type: Number,
                required: true,
                min: 1,
            },

            status: {
                type: String,
                enum: Object.values(
                    DailyTaskStatus
                ),
                default:
                    DailyTaskStatus.PENDING,
            },

            type: {
                type: String,
                enum: Object.values(
                    DailyTaskType
                ),
                default:
                    DailyTaskType.STUDY,
            },

            resources: {
                type: [TaskResourceSchema],
                default: [],
            },

            completedAt: {
                type: Date,
                default: null,
            },

        },
        {
            timestamps: true,
            versionKey: false,
            strict: "throw",
            collection:
                DAILY_TASK_COLLECTION,
        }
    );

DailyTaskSchema.index({
    missionId: 1,
});

DailyTaskSchema.index(
    {
        missionId: 1,
        dayNumber: 1,
    },
    {
        unique: true,
    }
);

DailyTaskSchema.index({
    status: 1,
});

DailyTaskSchema.index({
    roadmapItemIds: 1,
});

DailyTaskSchema.index({
    revisionSkillIds: 1,
});

export type DailyTask =
    InferSchemaType<
        typeof DailyTaskSchema
    >;

export type DailyTaskDocument =
    HydratedDocument<DailyTask>;

export const DailyTaskModel =
    model<DailyTask>(
        DAILY_TASK_MODEL,
        DailyTaskSchema
    );

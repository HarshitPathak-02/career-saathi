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
} from "./daily-task.enums.js";

const DailyTaskSchema = new Schema(
    {

        missionId: {
            type: Schema.Types.ObjectId,
            ref: "MissionModel",
            required: true,
        },

        dayNumber: {
            type: Number,
            required: true,
            min: 1,
            max: 6,
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
            enum: Object.values(DailyTaskStatus),
            default: DailyTaskStatus.PENDING,
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
        collection: DAILY_TASK_COLLECTION,
    }
);

DailyTaskSchema.index({
    missionId: 1,
});

DailyTaskSchema.index({
    missionId: 1,
    dayNumber: 1,
}, {
    unique: true,
});

DailyTaskSchema.index({
    status: 1,
});

export type DailyTask =
    InferSchemaType<typeof DailyTaskSchema>;

export type DailyTaskDocument =
    HydratedDocument<DailyTask>;

export const DailyTaskModel =
    model<DailyTask>(
        DAILY_TASK_MODEL,
        DailyTaskSchema
    );
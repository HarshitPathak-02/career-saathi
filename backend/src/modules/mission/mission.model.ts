import mongoose, {
    Schema,
} from "mongoose";

import {
    IMission,
} from "./mission.types.js";

import {
    ProgressStatus,
} from "../../shared/enums/progress-status.enums.js";

const missionSchema =
    new Schema<IMission>(
        {
            userId: {
                type: Schema.Types.ObjectId,
                ref: "User",
                required: true,
                index: true,
            },

            roadmapId: {
                type: Schema.Types.ObjectId,
                ref: "Roadmap",
                required: true,
                index: true,
            },

            weekNumber: {
                type: Number,
                required: true,
                min: 1,
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

            weekStart: {
                type: Date,
            },

            weekEnd: {
                type: Date,
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

            completedTaskCount: {
                type: Number,
                default: 0,
                min: 0,
            },

            taskCount: {
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

missionSchema.index(
    {
        roadmapId: 1,
        weekNumber: 1,
    },
    {
        unique: true,
    }
);

missionSchema.index({
    userId: 1,
    roadmapId: 1,
});

missionSchema.index({
    roadmapId: 1,
    status: 1,
});

export const MissionModel =
    mongoose.model<IMission>(
        "Mission",
        missionSchema
    );
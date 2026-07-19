import {
    HydratedDocument,
    InferSchemaType,
    Schema,
    model,
} from "mongoose";


import {
    CAREER_JOURNEY_MODEL,
} from "../career-journey/career-journey.constants.js";

import {
    ROADMAP_MODEL,
} from "../roadmap/roadmap.constants.js";

import {
    ROADMAP_ITEM_MODEL,
} from "../roadmap/roadmap-item.constants.js";


import {
    MissionStatus,
} from "./mission.enums.js";

const MissionSchema = new Schema(
    {

        careerJourneyId: {
            type: Schema.Types.ObjectId,
            ref: CAREER_JOURNEY_MODEL,
            required: true,
        },

        roadmapId: {
            type: Schema.Types.ObjectId,
            ref: ROADMAP_MODEL,
            required: true,
        },

        missionNumber: {
            type: Number,
            required: true,
            min: 1,
        },

        plannedRoadmapItemIds: [
            {
                type: Schema.Types.ObjectId,
                ref: ROADMAP_ITEM_MODEL,
                required: true,
            },
        ],

        startDate: {
            type: Date,
            required: true,
        },

        endDate: {
            type: Date,
            required: true,
        },

        status: {
            type: String,
            enum: Object.values(MissionStatus),
            default: MissionStatus.UPCOMING,
        },

    },
    {
        timestamps: true,
        versionKey: false,
        strict: "throw",
        collection: "missions",
    }
);

MissionSchema.index(
    {
        careerJourneyId: 1,
        missionNumber: 1,
    },
    {
        unique: true,
    }
);

MissionSchema.index({
    careerJourneyId: 1,
    status: 1,
});

MissionSchema.index({
    roadmapId: 1,
});

export type Mission =
    InferSchemaType<typeof MissionSchema>;

export type MissionDocument =
    HydratedDocument<Mission>;

export const MissionModel =
    model<Mission>(
        "MissionModel",
        MissionSchema
    );
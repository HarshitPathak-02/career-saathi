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
    SKILL_CATALOG_MODEL,
} from "../../master-data/skill-catalog/skill-catalog.constants.js";

import {
    MISSION_COLLECTION,
    MISSION_MODEL,
} from "./mission.constants.js";

import {
    MissionStatus,
} from "./mission.enums.js";

const MissionSchema =
    new Schema(
        {
            careerJourneyId: {
                type:
                    Schema.Types.ObjectId,

                ref:
                    CAREER_JOURNEY_MODEL,

                required:
                    true,
            },

            roadmapId: {
                type:
                    Schema.Types.ObjectId,

                ref:
                    ROADMAP_MODEL,

                required:
                    true,
            },

            missionNumber: {
                type: Number,
                required: true,
                min: 1,
            },

            plannedRoadmapItemIds: [
                {
                    type:
                        Schema.Types.ObjectId,

                    ref:
                        ROADMAP_ITEM_MODEL,

                    required:
                        true,
                },
            ],

            revisionPlans: [
                {
                    skillCatalogId: {
                        type:
                            Schema.Types.ObjectId,

                        ref:
                            SKILL_CATALOG_MODEL,

                        required:
                            true,
                    },

                    skillName: {
                        type: String,
                        required: true,
                        trim: true,
                    },

                    percentage: {
                        type: Number,
                        required: true,
                        min: 0,
                        max: 100,
                    },

                    revisionTopics: [
                        {
                            type: String,
                            required: true,
                            trim: true,
                        },
                    ],
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

                enum:
                    Object.values(
                        MissionStatus
                    ),

                default:
                    MissionStatus.ACTIVE,
            },
        },
        {
            timestamps: true,

            versionKey: false,

            strict: "throw",

            collection:
                MISSION_COLLECTION,
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
    roadmapId: 1,
});

MissionSchema.index(
    {
        careerJourneyId: 1,
        status: 1,
    },
    {
        unique: true,

        partialFilterExpression: {
            status:
                MissionStatus.ACTIVE,
        },
    }
);

export type Mission =
    InferSchemaType<
        typeof MissionSchema
    >;

export type MissionDocument =
    HydratedDocument<Mission>;

export const MissionModel =
    model<Mission>(
        MISSION_MODEL,
        MissionSchema
    );
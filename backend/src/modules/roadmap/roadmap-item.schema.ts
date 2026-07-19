import {
    HydratedDocument,
    InferSchemaType,
    Schema,
    model,
} from "mongoose";

import {
    ROADMAP_ITEM_COLLECTION,
    ROADMAP_ITEM_MODEL,
} from "./roadmap-item.constants.js";

import { ROADMAP_MODEL } from "./roadmap.constants.js";

import { SKILL_CATALOG_MODEL } from "../../master-data/skill-catalog/skill-catalog.constants.js"

import {
    RoadmapItemStatus,
    RoadmapItemType,
} from "./roadmap.enums.js";

const RoadmapItemSchema = new Schema(
    {
        roadmapId: {
            type: Schema.Types.ObjectId,
            ref: ROADMAP_MODEL,
            required: true,
        },

        order: {
            type: Number,
            required: true,
            min: 1,
        },

        type: {
            type: String,
            enum: Object.values(RoadmapItemType),
            required: true,
        },

        skillId: {
            type: Schema.Types.ObjectId,
            ref: SKILL_CATALOG_MODEL,
            default: null,
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

        estimatedHours: {
            type: Number,
            required: true,
            min: 1,
        },

        status: {
            type: String,
            enum: Object.values(RoadmapItemStatus),
            default: RoadmapItemStatus.PENDING,
        },

        aiReason: {
            type: String,
            default: "",
            trim: true,
        },

        metadata: {
            type: Schema.Types.Mixed,
            default: {},
        },
    },
    {
        timestamps: true,
        versionKey: false,
        strict: "throw",
        collection: ROADMAP_ITEM_COLLECTION,
    }
);

RoadmapItemSchema.index(
    {
        roadmapId: 1,
        order: 1,
    },
    {
        unique: true,
    }
);

RoadmapItemSchema.index({
    roadmapId: 1,
});

RoadmapItemSchema.index({
    status: 1,
});

RoadmapItemSchema.index({
    skillId: 1,
});

export type RoadmapItem =
    InferSchemaType<typeof RoadmapItemSchema>;

export type RoadmapItemDocument =
    HydratedDocument<RoadmapItem>;

export const RoadmapItemModel =
    model<RoadmapItem>(
        ROADMAP_ITEM_MODEL,
        RoadmapItemSchema
    );
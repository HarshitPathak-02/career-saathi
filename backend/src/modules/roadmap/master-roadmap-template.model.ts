import {
    HydratedDocument,
    InferSchemaType,
    Schema,
    Types,
    model,
} from "mongoose";

import {
    RoadmapItemType,
} from "./roadmap.enums.js";

const TemplateItemSchema = new Schema(
    {
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
        skillSlug: {
            type: String,
            trim: true,
            lowercase: true,
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
        aiReason: {
            type: String,
            required: true,
            trim: true,
        },
    },
    { _id: false }
);

const MasterRoadmapTemplateSchema = new Schema(
    {
        roleId: {
            type: Types.ObjectId,
            ref: "CareerRole",
            index: true,
        },
        roleSlug: {
            type: String,
            required: true,
            lowercase: true,
            trim: true,
            index: true,
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
        version: {
            type: Number,
            default: 1,
        },
        isActive: {
            type: Boolean,
            default: true,
            index: true,
        },
        roadmapItems: {
            type: [TemplateItemSchema],
            required: true,
        },
    },
    {
        timestamps: true,
        versionKey: false,
        strict: "throw",
        collection: "master_roadmap_templates",
    }
);

MasterRoadmapTemplateSchema.index(
    { roleSlug: 1, version: 1 },
    { unique: true }
);

export type MasterRoadmapTemplate = InferSchemaType<
    typeof MasterRoadmapTemplateSchema
>;

export type MasterRoadmapTemplateDocument =
    HydratedDocument<MasterRoadmapTemplate>;

export const MasterRoadmapTemplateModel =
    model<MasterRoadmapTemplate>(
        "MasterRoadmapTemplate",
        MasterRoadmapTemplateSchema
    );

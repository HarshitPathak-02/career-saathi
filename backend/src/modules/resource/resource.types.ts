import { ResourceType } from "../roadmaps/roadmap.enums.js";

export interface ResourceResponse {

    type: ResourceType;

    title: string;

    url?: string;

    platform?: string;

    author?: string;

    estimatedMinutes?: number;
}
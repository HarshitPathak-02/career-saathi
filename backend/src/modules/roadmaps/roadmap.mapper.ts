import {
    RoadmapDocument,
    RoadmapResponse,
} from './roadmap.types.js';

export function toRoadmapResponse(
    roadmap: RoadmapDocument
): RoadmapResponse {

    return {

        id: roadmap.id,

        title:
            roadmap.title,

        description:
            roadmap.description,

        status:
            roadmap.status,

        generatedBy:
            roadmap.generatedBy,

        version:
            roadmap.version,

        createdAt:
            roadmap.createdAt,

        updatedAt:
            roadmap.updatedAt,
    };
}
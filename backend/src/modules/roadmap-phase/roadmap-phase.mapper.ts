import {
    RoadmapPhaseDocument,
    RoadmapPhaseResponse,
} from './roadmap-phase.types.js';

export function toRoadmapPhaseResponse(
    phase: RoadmapPhaseDocument
): RoadmapPhaseResponse {

    return {

        id: phase.id,

        title: phase.title,

        description: phase.description,

        order: phase.order,

        estimatedDurationWeeks:
            phase.estimatedDurationWeeks,

        status: phase.status,

        progress: phase.progress,

        completedMissionCount:
            phase.completedMissionCount,

        missionCount:
            phase.missionCount,

        unlockedAt:
            phase.unlockedAt,

        startedAt:
            phase.startedAt,

        completedAt:
            phase.completedAt,

        createdAt:
            phase.createdAt,

        updatedAt:
            phase.updatedAt,
    };
}
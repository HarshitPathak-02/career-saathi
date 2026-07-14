import {
    MissionDocument,
    MissionResponse,
} from './mission.types.js';

export function toMissionResponse(
    mission: MissionDocument
): MissionResponse {

    return {

        id:
            mission.id,

        title:
            mission.title,

        description:
            mission.description,

        order:
            mission.order,

        estimatedDurationDays:
            mission.estimatedDurationDays,

        status:
            mission.status,

        progress:
            mission.progress,

        completedTaskCount:
            mission.completedTaskCount,

        taskCount:
            mission.taskCount,

        unlockedAt:
            mission.unlockedAt,

        startedAt:
            mission.startedAt,

        completedAt:
            mission.completedAt,

        createdAt:
            mission.createdAt,

        updatedAt:
            mission.updatedAt,
    };
}

export function toMissionResponseList(
    missions: MissionDocument[]
): MissionResponse[] {

    return missions.map(
        toMissionResponse
    );
}
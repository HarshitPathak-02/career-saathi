export const MissionStatus = {
    ACTIVE: "ACTIVE",
    COMPLETED: "COMPLETED",
    SKIPPED: "SKIPPED",
} as const;

export type MissionStatus =
    typeof MissionStatus[keyof typeof MissionStatus];

export interface Mission {
    _id: string;

    careerJourneyId: string;

    roadmapId: string;

    missionNumber: number;

    plannedRoadmapItemIds: string[];

    startDate: string;

    endDate: string;

    status: MissionStatus;

    createdAt: string;

    updatedAt: string;
}

export interface MissionSummary {

    id: string;

    missionNumber: number;

    status: MissionStatus;

    startDate: string;

    endDate: string;

    totalDays: number;

    completedDays: number;

    progressPercentage: number;

}

export interface MissionDetails
    extends MissionSummary {

    roadmapItemIds: string[];

    currentMissionDay: number;

}
import {
    MissionStatus,
} from "./mission.enums.js";

export interface MissionSummaryDto {

    id: string;

    missionNumber: number;

    status: MissionStatus;

    startDate: Date;

    endDate: Date;

    totalDays: number;

    completedDays: number;

    progressPercentage: number;

}

export interface MissionDetailsDto
    extends MissionSummaryDto {

    roadmapItemIds: string[];

    currentMissionDay: number;


}
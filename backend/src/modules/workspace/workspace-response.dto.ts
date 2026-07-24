import {
    DailyTaskStatus,
    DailyTaskType,
} from "../daily-task/daily-task.enums.js";

import {
    WorkspaceState,
} from "./workspace.enums.js";

export interface WorkspaceUserDto {
    id: string;
    firstName: string;
}

export interface WorkspaceCareerJourneyDto {
    id: string;

    targetRole: string;

    targetDomain: string;

    targetCompany: string;

    targetDurationMonths: number;

    dailyStudyHours: number;
}

export interface WorkspaceMissionDto {
    id: string;

    missionNumber: number;

    startDate: Date;

    endDate: Date;

    status: string;
}

export interface WorkspaceDailyTaskDto {
    id: string;

    dayNumber: number;

    title: string;

    description: string;

    topics: string[];

    estimatedMinutes: number;

    status: DailyTaskStatus;

    type: DailyTaskType;

    completedAt: Date | null;
}

export interface WorkspaceOverviewDto {
    currentMission: number;

    currentWeek: number;

    completedTasks: number;

    totalTasks: number;

    progressPercentage: number;

    streak: number;
}

export interface WorkspaceActionsDto {
    canStartAssessment: boolean;

    canGenerateRoadmap: boolean;

    canStartJourney: boolean;
}

export interface WorkspaceResponseDto {
    workspaceState: WorkspaceState;

    user: WorkspaceUserDto;

    careerJourney: WorkspaceCareerJourneyDto;

    overview: WorkspaceOverviewDto;

    actions: WorkspaceActionsDto;

    activeMission: WorkspaceMissionDto | null;

    tasks: WorkspaceDailyTaskDto[];
}
import { WorkspaceState } from "./workspace.enums.js";

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
}
export const WorkspaceState = {
    INITIAL_ASSESSMENT: "initial_assessment",

    ROADMAP_PENDING: "roadmap_pending",

    MISSION_PENDING: "mission_pending",

    ACTIVE: "active",
} as const;

export type WorkspaceState =
    typeof WorkspaceState[keyof typeof WorkspaceState];


/*
|--------------------------------------------------------------------------
| Daily Task
|--------------------------------------------------------------------------
*/

export const DailyTaskStatus = {
    PENDING: "PENDING",

    COMPLETED: "COMPLETED",

    SKIPPED: "SKIPPED",
} as const;

export type DailyTaskStatus =
    typeof DailyTaskStatus[keyof typeof DailyTaskStatus];


export const DailyTaskType = {
    STUDY: "STUDY",

    REVIEW: "REVIEW",
} as const;

export type DailyTaskType =
    typeof DailyTaskType[keyof typeof DailyTaskType];


/*
|--------------------------------------------------------------------------
| User
|--------------------------------------------------------------------------
*/

export interface WorkspaceUser {
    id: string;

    firstName: string;
}


/*
|--------------------------------------------------------------------------
| Career Journey
|--------------------------------------------------------------------------
*/

export interface WorkspaceCareerJourney {
    id: string;

    roleId: string;
    domainId: string;

    targetRole: string;

    targetDomain: string;

    targetCompany: string;

    targetDurationMonths: number;

    dailyStudyHours: number;
}


/*
|--------------------------------------------------------------------------
| Active Mission
|--------------------------------------------------------------------------
*/

export interface WorkspaceActiveMission {
    id: string;

    missionNumber: number;

    startDate: string;

    endDate: string;

    status: string;
}


/*
|--------------------------------------------------------------------------
| Daily Task
|--------------------------------------------------------------------------
*/

export interface WorkspaceDailyTask {
    id: string;

    dayNumber: number;

    title: string;

    description: string;

    topics: string[];

    estimatedMinutes: number;

    status: DailyTaskStatus;

    type: DailyTaskType;

    completedAt: string | null;
}


/*
|--------------------------------------------------------------------------
| Overview
|--------------------------------------------------------------------------
*/

export interface WorkspaceOverview {
    currentMission: number;

    currentWeek: number;

    completedTasks: number;

    totalTasks: number;

    progressPercentage: number;

    streak: number;
}


/*
|--------------------------------------------------------------------------
| Actions
|--------------------------------------------------------------------------
*/

export interface WorkspaceActions {
    canStartAssessment: boolean;

    canGenerateRoadmap: boolean;

    canStartJourney: boolean;
}


/*
|--------------------------------------------------------------------------
| Workspace
|--------------------------------------------------------------------------
*/

export interface Workspace {
    workspaceState: WorkspaceState;

    user: WorkspaceUser;

    careerJourney: WorkspaceCareerJourney;

    overview: WorkspaceOverview;

    actions: WorkspaceActions;

    activeMission: WorkspaceActiveMission | null;

    tasks: WorkspaceDailyTask[];
}
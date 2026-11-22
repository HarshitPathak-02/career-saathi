export const DailyTaskStatus = {
    PENDING: "PENDING",
    COMPLETED: "COMPLETED",
    SKIPPED: "SKIPPED",
} as const;

export type DailyTaskStatus =
    typeof DailyTaskStatus[keyof typeof DailyTaskStatus];

export const TaskResourceType = {
    VIDEO: "VIDEO",
    DOCUMENTATION: "DOCUMENTATION",
    ARTICLE: "ARTICLE",
    PDF: "PDF",
    CHEATSHEET: "CHEATSHEET",
    PRACTICE: "PRACTICE",
    COURSE: "COURSE",
} as const;

export type TaskResourceType =
    typeof TaskResourceType[keyof typeof TaskResourceType];

export interface TaskResource {
    title: string;
    url: string;
    type: TaskResourceType;
    provider: string;
    description?: string;
    isCareerSaathiOfficial?: boolean;
    isPartner?: boolean;
    partnerName?: string;
    estimatedMinutes?: number;
}

export interface DailyTask {

    taskId: string;

    missionId: string;

    dayNumber: number;

    title: string;

    description: string;

    topics: string[];

    estimatedMinutes: number;

    status: DailyTaskStatus;

    resources?: TaskResource[];

    completedAt: string | null;

    createdAt: string;

    updatedAt: string;

}

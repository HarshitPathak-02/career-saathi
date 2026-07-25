export const DailyTaskStatus = {
    PENDING: "PENDING",
    COMPLETED: "COMPLETED",
    SKIPPED: "SKIPPED",
} as const;

export type DailyTaskStatus =
    typeof DailyTaskStatus[keyof typeof DailyTaskStatus];

export interface DailyTask {

    taskId: string;

    missionId: string;

    dayNumber: number;

    title: string;

    description: string;

    topics: string[];

    estimatedMinutes: number;

    status: DailyTaskStatus;

    completedAt: string | null;

    createdAt: string;

    updatedAt: string;

}
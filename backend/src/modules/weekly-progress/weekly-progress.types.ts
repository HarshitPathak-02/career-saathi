export interface DailyProgressResponse {

    date: string;

    completedTasks: number;

    studyHours: number;
}

export interface WeeklyProgressResponse {

    weekStart: Date;

    weekEnd: Date;

    completedTasks: number;

    totalTasks: number;

    studyHours: number;

    completionRate: number;

    streak: number;

    dailyProgress: DailyProgressResponse[];
}
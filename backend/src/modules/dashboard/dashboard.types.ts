import { TaskType } from '../task/task.enums.js';

export interface DashboardResponse {
    careerJourney: {

        id: string;

        title: string;
    };

    roadmap: {

        id: string;

        title: string;

    };

    currentPhase: {

        id: string;

        title: string;

        progress: number;
    } | null;

    currentMission: {

        id: string;

        title: string;

        progress: number;
    } | null;

    currentTask: {

        id: string;

        title: string;

        progress: number;

        taskType: TaskType;
    } | null;

    statistics: {

        roadmapProgress: number;

        completedTasks: number;

        totalTasks: number;

        completedMissions: number;

        totalMissions: number;

        completedPhases: number;

        totalPhases: number;
    };
}
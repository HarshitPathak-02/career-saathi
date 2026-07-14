import { taskRepository } from '../task/task.repository.js';

import {
    WeeklyProgressResponse,
    DailyProgressResponse,
} from './weekly-progress.types.js';

import { getCurrentWeekRange } from '../../shared/utils/date.utils.js';
import { TaskDocument } from '../task/task.types.js';

class WeeklyProgressService {

    async getWeeklyProgress(
        userId: string
    ): Promise<WeeklyProgressResponse> {

        const {
            weekStart,
            weekEnd,
        } = getCurrentWeekRange();

        const completedTasks =
            await taskRepository.findCompletedTasksBetweenDates(
                userId,
                weekStart,
                weekEnd
            );

        const totalTasks =
            await taskRepository.countTasksForUser(
                userId
            );

        const studyHours =
            completedTasks.reduce(
                (total, task) =>
                    total + task.estimatedHours,
                0
            );

        const completionRate =
            totalTasks === 0
                ? 0
                : Math.round(
                    (completedTasks.length /
                        totalTasks) * 100
                );

        const dailyProgress =
            this.buildDailyProgress(
                completedTasks
            );

        return {

            weekStart,

            weekEnd,

            completedTasks:
                completedTasks.length,

            totalTasks,

            studyHours,

            completionRate,

            streak: 0,

            dailyProgress,
        };
    }

    private buildDailyProgress(
        tasks: TaskDocument[]
    ): DailyProgressResponse[] {

        const progressMap =
            new Map<
                string,
                DailyProgressResponse
            >();

        for (const task of tasks) {

            if (!task.completedAt) {
                continue;
            }

            const date =
                task.completedAt
                    .toISOString()
                    .split('T')[0];

            if (!progressMap.has(date)) {

                progressMap.set(date, {

                    date,

                    completedTasks: 0,

                    studyHours: 0,
                });
            }

            const progress =
                progressMap.get(date)!;

            progress.completedTasks++;

            progress.studyHours +=
                task.estimatedHours;
        }

        return Array.from(
            progressMap.values()
        ).sort(
            (a, b) =>
                a.date.localeCompare(b.date)
        );
    }
}

export const weeklyProgressService =
    new WeeklyProgressService();
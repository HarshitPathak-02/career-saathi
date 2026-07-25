import {
    baseApi,
} from "../../../shared/api/baseApi";
import type { DailyTask } from "../types/daily-task.types";

export const dailyTaskApi =
    baseApi.injectEndpoints({
        endpoints: (builder) => ({

            completeDailyTask:
                builder.mutation<
                    void,
                    string
                >({
                    query: (dailyTaskId) => ({
                        url: `/daily-tasks/${dailyTaskId}/complete`,

                        method: "PATCH",
                    }),

                    invalidatesTags: [
                        "Workspace",
                        "Mission"
                    ],
                }),

            markDailyTaskPending:
                builder.mutation<
                    void,
                    string
                >({
                    query: (dailyTaskId) => ({
                        url: `/daily-tasks/${dailyTaskId}/pending`,

                        method: "PATCH",
                    }),

                    invalidatesTags: [
                        "Workspace",
                        "Mission",
                    ],
                }),

            skipDailyTask:
                builder.mutation<
                    void,
                    string
                >({
                    query: (dailyTaskId) => ({
                        url: `/daily-tasks/${dailyTaskId}/skip`,

                        method: "PATCH",
                    }),

                    invalidatesTags: [
                        "Workspace",
                        "Mission",
                    ],
                }),

            getMissionDailyTasks:
                builder.query<
                    DailyTask[],
                    string
                >({
                    query: (missionId) => ({
                        url: `/daily-tasks/mission/${missionId}`,
                        method: "GET",
                    }),

                    providesTags: [
                        "Mission",
                    ],
                }),

        }),
    });

export const {

    useCompleteDailyTaskMutation,

    useMarkDailyTaskPendingMutation,

    useSkipDailyTaskMutation,

    useGetMissionDailyTasksQuery

} = dailyTaskApi;
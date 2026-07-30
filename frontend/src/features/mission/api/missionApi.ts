import {
    baseApi,
} from "../../../shared/api/baseApi";
import type { ApiResponse } from "../../../shared/types/api.types";

import type {
    Mission,
    MissionDetails,
    MissionSummary,
} from "../types/mission.types";

export const missionApi =
    baseApi.injectEndpoints({
        endpoints: (builder) => ({

            /*
            |--------------------------------------------------------------
            | Create Initial Mission
            |--------------------------------------------------------------
            */

            createInitialMission:
                builder.mutation<
                    MissionSummary,
                    string
                >({
                    query: (
                        careerJourneyId
                    ) => ({
                        url:
                            `/missions/${careerJourneyId}`,

                        method: "POST",
                    }),

                    invalidatesTags: [
                        "CareerJourney",
                        "Mission",
                    ],
                }),

            /*
            |--------------------------------------------------------------
            | Current Mission
            |--------------------------------------------------------------
            */

            getCurrentMission:
                builder.query<
                    MissionSummary | null,
                    string
                >({
                    query: (
                        careerJourneyId
                    ) => ({
                        url:
                            `/missions/career-journey/${careerJourneyId}/current`,

                        method: "GET",
                    }),

                    providesTags: [
                        "Mission",
                    ],
                }),

            /*
            |--------------------------------------------------------------
            | Latest Mission
            |--------------------------------------------------------------
            */

            getLatestMission:
                builder.query<
                    Mission | null,
                    string
                >({
                    query: (
                        careerJourneyId
                    ) => ({
                        url:
                            `/missions/career-journey/${careerJourneyId}/latest`,

                        method: "GET",
                    }),

                    providesTags: [
                        "Mission",
                    ],
                }),

            /*
            |--------------------------------------------------------------
            | Mission History
            |--------------------------------------------------------------
            */

            getMissionHistory:
                builder.query<
                    ApiResponse<MissionSummary[]>,
                    string
                >({
                    query: (
                        careerJourneyId
                    ) => ({
                        url:
                            `/missions/career-journey/${careerJourneyId}/history`,

                        method: "GET",
                    }),

                    providesTags: [
                        "Mission",
                    ],
                }),

            /*
            |--------------------------------------------------------------
            | Mission By Id
            |--------------------------------------------------------------
            */

            getMission:
                builder.query<
                    MissionDetails,
                    string
                >({
                    query: (
                        missionId
                    ) => ({
                        url:
                            `/missions/${missionId}`,

                        method: "GET",
                    }),

                    providesTags: [
                        "Mission",
                    ],
                }),
        }),
    });

export const {
    useCreateInitialMissionMutation,
    useGetCurrentMissionQuery,
    useGetLatestMissionQuery,
    useGetMissionHistoryQuery,
    useGetMissionQuery,
} = missionApi;
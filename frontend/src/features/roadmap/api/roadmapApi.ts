import {
    baseApi,
} from "../../../shared/api/baseApi";

import type {
    GenerateRoadmapRequest,
    GenerateRoadmapResponse,
    Roadmap,
    RoadmapItem,
} from "../types/roadmap.types";

export const roadmapApi =
    baseApi.injectEndpoints({
        endpoints: (builder) => ({

            generateRoadmap:
                builder.mutation<
                    GenerateRoadmapResponse,
                    GenerateRoadmapRequest
                >({
                    query: (data) => ({
                        url: "/roadmaps/generate",

                        method: "POST",

                        data,
                    }),

                    invalidatesTags: [
                        "CareerJourney",
                        "Roadmap",
                    ],
                }),

            getRoadmapByCareerJourney:
                builder.query<
                    Roadmap,
                    string
                >({
                    query: (
                        careerJourneyId
                    ) => ({
                        url:
                            `/roadmaps/career-journey/${careerJourneyId}`,

                        method: "GET",
                    }),

                    providesTags: [
                        "Roadmap",
                    ],
                }),

            getRoadmapItems:
                builder.query<
                    RoadmapItem[],
                    string
                >({
                    query: (
                        roadmapId
                    ) => ({
                        url:
                            `/roadmaps/${roadmapId}/items`,

                        method: "GET",
                    }),

                    providesTags: [
                        "Roadmap",
                    ],
                }),

        }),
    });

export const {
    useGenerateRoadmapMutation,
    useGetRoadmapByCareerJourneyQuery,
    useGetRoadmapItemsQuery,
} = roadmapApi;
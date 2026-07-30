import {
    baseApi,
} from "../../../shared/api/baseApi";

import type {
    ApiResponse,
} from "../../../shared/types/api.types";

import type {
    GenerateRoadmapRequest,
    Roadmap,
    RoadmapItem,
} from "../types/roadmap.types";


export const roadmapApi =
    baseApi.injectEndpoints({
        endpoints: (builder) => ({

            /*
            |--------------------------------------------------------------------------
            | Generate Roadmap
            |--------------------------------------------------------------------------
            */

            generateRoadmap:
                builder.mutation<
                    ApiResponse<Roadmap>,
                    GenerateRoadmapRequest
                >({

                    query: (data) => ({

                        url:
                            "/roadmaps/generate",

                        method:
                            "POST",

                        data,

                    }),

                    invalidatesTags: [
                        "CareerJourney",
                        "Roadmap",
                    ],

                }),

            /*
            |--------------------------------------------------------------------------
            | Get Roadmap By Career Journey
            |--------------------------------------------------------------------------
            */

            getRoadmapByCareerJourney:
                builder.query<
                    ApiResponse<Roadmap>,
                    string
                >({

                    query: (
                        careerJourneyId
                    ) => ({

                        url:
                            `/roadmaps/career-journey/${careerJourneyId}`,

                        method:
                            "GET",

                    }),

                    providesTags: [
                        "Roadmap",
                    ],

                }),

            /*
            |--------------------------------------------------------------------------
            | Get Roadmap Items
            |--------------------------------------------------------------------------
            */

            getRoadmapItems:
                builder.query<
                    ApiResponse<RoadmapItem[]>,
                    string
                >({

                    query: (
                        roadmapId
                    ) => ({

                        url:
                            `/roadmaps/${roadmapId}/items`,

                        method:
                            "GET",

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
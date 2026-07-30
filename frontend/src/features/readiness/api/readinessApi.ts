import {
    baseApi,
} from "../../../shared/api/baseApi";

import type {
    CreateMockInterviewInput,
    MockInterviewResponse,
    MockInterviewsResponse,
    ReadinessResponse,
} from "../types/readiness.types";


export const readinessApi =
    baseApi.injectEndpoints({

        endpoints:
            (builder) => ({


                /*
                |--------------------------------------------------------------------------
                | Get Current Readiness State
                |--------------------------------------------------------------------------
                |
                | Query-only.
                |
                | Does not perform or persist
                | a new readiness evaluation.
                |
                */

                getReadinessState:
                    builder.query<
                        ReadinessResponse,
                        string
                    >({

                        query:
                            (
                                careerJourneyId
                            ) => ({

                                url:
                                    `/readiness/${careerJourneyId}`,

                                method:
                                    "GET",

                            }),

                        providesTags:
                            ["Readiness"],

                    }),


                /*
                |--------------------------------------------------------------------------
                | Perform Readiness Evaluation
                |--------------------------------------------------------------------------
                |
                | Explicit command triggered by
                | the user after enough mock
                | interviews are available.
                |
                */

                evaluateReadiness:
                    builder.mutation<
                        ReadinessResponse,
                        string
                    >({

                        query:
                            (
                                careerJourneyId
                            ) => ({

                                url:
                                    `/readiness/${careerJourneyId}/evaluate`,

                                method:
                                    "POST",

                            }),

                        invalidatesTags:
                            [
                                "Readiness",
                                "CareerJourney",
                                "Workspace",
                            ],

                    }),


                /*
                |--------------------------------------------------------------------------
                | Mock Interview History
                |--------------------------------------------------------------------------
                */

                getMockInterviews:
                    builder.query<
                        MockInterviewsResponse,
                        string
                    >({

                        query:
                            (
                                careerJourneyId
                            ) => ({

                                url:
                                    `/mock-interviews/career-journeys/${careerJourneyId}`,

                                method:
                                    "GET",

                            }),

                        providesTags:
                            ["MockInterview"],

                    }),


                /*
                |--------------------------------------------------------------------------
                | Record Mock Interview
                |--------------------------------------------------------------------------
                */

                createMockInterview:
                    builder.mutation<
                        MockInterviewResponse,
                        CreateMockInterviewInput
                    >({

                        query:
                            (
                                body
                            ) => ({

                                url:
                                    "/mock-interviews",

                                method:
                                    "POST",

                                body,

                            }),

                        invalidatesTags:
                            [
                                "MockInterview",
                                "Readiness",
                            ],

                    }),

            }),

    });


export const {

    useGetReadinessStateQuery,

    useEvaluateReadinessMutation,

    useGetMockInterviewsQuery,

    useCreateMockInterviewMutation,

} = readinessApi;
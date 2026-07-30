import {
    baseApi,
} from "../../../shared/api/baseApi";

import type {
    CreateMockInterviewInput,
    MockInterviewResponse,
    MockInterviewsResponse,
} from "../types/mock-interview.types";


export const mockInterviewApi =
    baseApi.injectEndpoints({

        endpoints:
            builder => ({


                /*
                |--------------------------------------------------------------------------
                | Create Mock Interview
                |--------------------------------------------------------------------------
                */

                createMockInterview:
                    builder.mutation<
                        MockInterviewResponse,
                        CreateMockInterviewInput
                    >({

                        query:
                            data => ({

                                url:
                                    "/mock-interviews",

                                method:
                                    "POST",

                                data,

                            }),

                        invalidatesTags: [
                            "MockInterview",
                            "Readiness",
                        ],

                    }),


                /*
                |--------------------------------------------------------------------------
                | Mock Interview History
                |--------------------------------------------------------------------------
                */

                getMockInterviewHistory:
                    builder.query<
                        MockInterviewsResponse,
                        string
                    >({

                        query:
                            careerJourneyId => ({

                                url:
                                    `/mock-interviews/career-journeys/${careerJourneyId}`,

                                method:
                                    "GET",

                            }),

                        providesTags: [
                            "MockInterview",
                        ],

                    }),

            }),

    });


export const {

    useCreateMockInterviewMutation,

    useGetMockInterviewHistoryQuery,

} = mockInterviewApi;
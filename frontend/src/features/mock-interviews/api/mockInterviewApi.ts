import {
    baseApi,
} from "../../../shared/api/baseApi";
import type { ApiResponse } from "../../../shared/types/api.types";
import type { InterviewSessionDto } from "../../practice/types/practice.types";

import type {
    CreateMockInterviewInput,
    MockInterviewResponse,
    MockInterviewsResponse,
    ReadinessBatteryResponse,
    StartOfficialMockInterviewRequest,
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

                /*
                |--------------------------------------------------------------------------
                | Readiness Battery
                |--------------------------------------------------------------------------
                */
                getReadinessBattery:
                    builder.query<
                        ApiResponse<ReadinessBatteryResponse>,
                        string
                    >({
                        query: (careerJourneyId) => ({
                            url: "/mock-interviews/readiness-battery",
                            method: "GET",
                            params: { careerJourneyId },
                        }),
                        providesTags: ["MockInterview", "Readiness"],
                    }),

                /*
                |--------------------------------------------------------------------------
                | Start Official Mock Interview
                |--------------------------------------------------------------------------
                */
                startOfficialMockInterview:
                    builder.mutation<
                        ApiResponse<InterviewSessionDto>,
                        StartOfficialMockInterviewRequest
                    >({
                        query: (data) => ({
                            url: "/mock-interviews/start-official",
                            method: "POST",
                            data,
                        }),
                        invalidatesTags: ["MockInterview", "Practice", "Readiness"],
                    }),

            }),

    });


export const {

    useCreateMockInterviewMutation,

    useGetMockInterviewHistoryQuery,

    useGetReadinessBatteryQuery,

    useStartOfficialMockInterviewMutation,

} = mockInterviewApi;
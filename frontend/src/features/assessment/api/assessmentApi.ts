import {
    baseApi,
} from "../../../shared/api/baseApi";

import type {
    ApiResponse,
} from "../../../shared/types/api.types";

import type {
    AssessmentDetail,
    AssessmentHistoryItem,
} from "../types/assessment.types";

export const assessmentApi =
    baseApi.injectEndpoints({
        endpoints: (builder) => ({

            /*
            |--------------------------------------------------------------------------
            | Assessment History
            |--------------------------------------------------------------------------
            */

            getAssessmentHistory:
                builder.query<
                    ApiResponse<
                        AssessmentHistoryItem[]
                    >,
                    string
                >({
                    query: (
                        careerJourneyId
                    ) => ({
                        url:
                            `/assessments/career-journey/${careerJourneyId}`,

                        method: "GET",
                    }),

                    providesTags: [
                        "Assessment",
                    ],
                }),

            /*
            |--------------------------------------------------------------------------
            | Assessment Details
            |--------------------------------------------------------------------------
            */

            getAssessmentDetails:
                builder.query<
                    ApiResponse<
                        AssessmentDetail
                    >,
                    string
                >({
                    query: (
                        assessmentId
                    ) => ({
                        url:
                            `/assessments/${assessmentId}/details`,

                        method: "GET",
                    }),

                    providesTags: (
                        _result,
                        _error,
                        assessmentId
                    ) => [
                            {
                                type:
                                    "Assessment",
                                id:
                                    assessmentId,
                            },
                        ],
                }),
        }),
    });

export const {
    useGetAssessmentHistoryQuery,
    useGetAssessmentDetailsQuery,
} = assessmentApi;
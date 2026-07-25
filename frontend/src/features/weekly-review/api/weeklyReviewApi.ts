import {
    baseApi,
} from "../../../shared/api/baseApi";

import type {
    SubmitWeeklyReviewRequest,
    WeeklyReviewPreparationResponse,
} from "../types/weekly-review.types";

export const weeklyReviewApi =
    baseApi.injectEndpoints({

        endpoints: (builder) => ({

            /*
            |--------------------------------------------------------------------------
            | Current Weekly Review
            |--------------------------------------------------------------------------
            */

            getCurrentWeeklyReview:
                builder.query<
                    WeeklyReviewPreparationResponse,
                    void
                >({

                    query: () => ({

                        url:
                            "/weekly-reviews/current",

                        method:
                            "GET",

                    }),

                    providesTags: [
                        "Mission",
                    ],

                }),

            /*
            |--------------------------------------------------------------------------
            | Submit Weekly Review
            |--------------------------------------------------------------------------
            */

            submitWeeklyReview:
                builder.mutation<
                    unknown,
                    SubmitWeeklyReviewRequest
                >({

                    query: (body) => ({

                        url:
                            "/weekly-reviews/submit",

                        method:
                            "POST",

                        body,

                    }),

                    invalidatesTags: [
                        "Mission",
                        "Workspace",
                    ],

                }),

        }),

    });

export const {

    useGetCurrentWeeklyReviewQuery,

    useSubmitWeeklyReviewMutation,

} = weeklyReviewApi;
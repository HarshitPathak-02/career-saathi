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

            submitWeeklyReview:
                builder.mutation<
                    unknown,
                    SubmitWeeklyReviewRequest
                >({

                    query: (data) => ({

                        url:
                            "/weekly-reviews/submit",

                        method:
                            "POST",

                        data,

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
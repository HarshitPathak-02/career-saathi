import {
    baseApi,
} from "../../../shared/api/baseApi";

import type {
    MonthlyReportDueStatusResponse,
    MonthlyReportResponse,
    MonthlyReportsResponse,
} from "../types/monthly-report.types";


export const monthlyReportApi =
    baseApi.injectEndpoints({

        endpoints: (
            builder
        ) => ({

            /*
            |--------------------------------------------------------------------------
            | Monthly Report History
            |--------------------------------------------------------------------------
            */

            getMonthlyReports:
                builder.query<
                    MonthlyReportsResponse,
                    string
                >({

                    query: (
                        careerJourneyId
                    ) => ({

                        url:
                            `/monthly-reports/${careerJourneyId}/history`,

                        method:
                            "GET",
                    }),

                    providesTags:
                        ["MonthlyReport"],
                }),


            /*
            |--------------------------------------------------------------------------
            | Monthly Report Details
            |--------------------------------------------------------------------------
            */

            getMonthlyReportDetails:
                builder.query<
                    MonthlyReportResponse,
                    {
                        careerJourneyId: string;
                        reportNumber: number;
                    }
                >({

                    query: ({
                        careerJourneyId,
                        reportNumber,
                    }) => ({

                        url:
                            `/monthly-reports/${careerJourneyId}/${reportNumber}`,

                        method:
                            "GET",

                    }),

                    providesTags:
                        ["MonthlyReport"],

                }),


            /*
            |--------------------------------------------------------------------------
            | Monthly Report Due Status
            |--------------------------------------------------------------------------
            */

            getMonthlyReportDueStatus:
                builder.query<
                    MonthlyReportDueStatusResponse,
                    string
                >({

                    query: (
                        careerJourneyId
                    ) => ({

                        url:
                            `/monthly-reports/${careerJourneyId}/due-status`,

                        method:
                            "GET",
                    }),

                    providesTags:
                        ["MonthlyReport"],
                }),


            /*
            |--------------------------------------------------------------------------
            | Generate Monthly Report
            |--------------------------------------------------------------------------
            */

            generateMonthlyReport:
                builder.mutation<
                    MonthlyReportResponse,
                    string
                >({

                    query: (
                        careerJourneyId
                    ) => ({

                        url:
                            `/monthly-reports/${careerJourneyId}/generate`,

                        method:
                            "POST",
                    }),

                    invalidatesTags:
                        ["MonthlyReport"],
                }),



        }),

    });


export const {

    useGetMonthlyReportsQuery,

    useGetMonthlyReportDetailsQuery,

    useGetMonthlyReportDueStatusQuery,

    useGenerateMonthlyReportMutation,

} = monthlyReportApi;
import {
    baseApi,
} from "../../../shared/api/baseApi";

import type {
    WeeklyReportDetailsResponse,
    WeeklyReportResponse,
    WeeklyReportsResponse,
} from "../types/weekly-report.types";

export const weeklyReportApi =
    baseApi.injectEndpoints({

        endpoints: (builder) => ({

            /*
            |--------------------------------------------------------------------------
            | Weekly Report History
            |--------------------------------------------------------------------------
            */

            getWeeklyReports:
                builder.query<
                    WeeklyReportsResponse,
                    string
                >({

                    query: (
                        careerJourneyId
                    ) => ({

                        url:
                            `/weekly-reports/${careerJourneyId}`,

                        method:
                            "GET",

                    }),

                    providesTags:
                        ["WeeklyReport"],

                }),

            /*
            |--------------------------------------------------------------------------
            | Latest Weekly Report
            |--------------------------------------------------------------------------
            */

            getLatestWeeklyReport:
                builder.query<
                    WeeklyReportResponse,
                    string
                >({

                    query: (
                        careerJourneyId
                    ) => ({

                        url:
                            `/weekly-reports/${careerJourneyId}/latest`,

                        method:
                            "GET",

                    }),

                    providesTags:
                        ["WeeklyReport"],

                }),

            /*
            |--------------------------------------------------------------------------
            | Weekly Report Details
            |--------------------------------------------------------------------------
            */

            getWeeklyReportDetails:
                builder.query<
                    WeeklyReportDetailsResponse,
                    string
                >({

                    query: (
                        reportId
                    ) => ({

                        url:
                            `/weekly-reports/report/${reportId}`,

                        method:
                            "GET",

                    }),

                }),

        }),

    });

export const {

    useGetWeeklyReportsQuery,

    useGetLatestWeeklyReportQuery,

    useGetWeeklyReportDetailsQuery,

} = weeklyReportApi;
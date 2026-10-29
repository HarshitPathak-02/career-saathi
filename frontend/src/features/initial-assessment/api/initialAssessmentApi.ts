import { baseApi } from "../../../shared/api/baseApi";

import type {
    ApiResponse,
} from "../../../shared/types/api.types";

import type {
    Assessment,
    InitializeUserSkillsRequest,
    StartInitialAssessmentRequest,
    StartResumeAssessmentRequest,
    SubmitInitialAssessmentRequest,
    UserSkill,
} from "../types/initialAssessment.types";

export const initialAssessmentApi =
    baseApi.injectEndpoints({
        endpoints: (builder) => ({
            initializeUserSkills: builder.mutation<
                ApiResponse<null>,
                InitializeUserSkillsRequest
            >({
                query: ({
                    careerJourneyId,
                    selectedSkillCatalogIds,
                }) => ({
                    url:
                        `/user-skills/career-journeys/${careerJourneyId}`,

                    method: "POST",

                    data: {
                        selectedSkillCatalogIds,
                    },
                }),

                invalidatesTags: ["UserSkill"],
            }),

            /*
             * Get initialized UserSkills for
             * the Career Journey.
             */
            getUserSkills: builder.query<
                ApiResponse<UserSkill[]>,
                string
            >({
                query: (careerJourneyId) => ({
                    url:
                        `/user-skills/career-journeys/${careerJourneyId}`,

                    method: "GET",
                }),

                providesTags: ["UserSkill"],
            }),

            /*
             * Create INITIAL assessment record.
             */
            startInitialAssessment: builder.mutation<
                ApiResponse<Assessment>,
                StartInitialAssessmentRequest
            >({
                query: (data) => ({
                    url:
                        "/assessments/initial/start",

                    method: "POST",

                    data,
                }),
            }),

            /*
             * Submit assessment scores.
             */
            submitInitialAssessment: builder.mutation<
                ApiResponse<Assessment>,
                SubmitInitialAssessmentRequest
            >({
                query: (data) => ({
                    url:
                        "/assessments/initial/submit",

                    method: "POST",

                    data,
                }),

                invalidatesTags: [
                    "CareerJourney",
                    "UserSkill",
                    "Workspace"
                ],
            }),

            startResumeAssessment: builder.mutation<
                ApiResponse<Assessment>,
                StartResumeAssessmentRequest
            >({
                query: (data) => ({
                    url:
                        "/assessments/resume/start",

                    method: "POST",

                    data,
                }),
            }),

            submitResumeAssessment: builder.mutation<
                ApiResponse<Assessment>,
                SubmitInitialAssessmentRequest
            >({
                query: (data) => ({
                    url:
                        "/assessments/resume/submit",

                    method: "POST",

                    data,
                }),

                invalidatesTags: [
                    "Assessment",
                    "UserSkill",
                    "Workspace"
                ],
            }),
        }),
    });

export const {
    useInitializeUserSkillsMutation,
    useGetUserSkillsQuery,
    useStartInitialAssessmentMutation,
    useSubmitInitialAssessmentMutation,
    useStartResumeAssessmentMutation,
    useSubmitResumeAssessmentMutation,
} = initialAssessmentApi;
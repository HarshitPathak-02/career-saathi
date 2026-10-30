import { baseApi } from "../../../shared/api/baseApi";

import type {
    ApiResponse,
} from "../../../shared/types/api.types";

import type {
    AssessmentSectionView,
    AutosaveAttemptRequest,
    InitializeUserSkillsRequest,
    StartInitialAssessmentRequest,
    StartInitialAssessmentResponse,
    StartSectionAttemptResponse,
    SubmitAttemptRequest,
    SubmitAttemptResponse,
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
             * Create the INITIAL assessment campaign
             * with one section per selected skill.
             */
            startInitialAssessment: builder.mutation<
                ApiResponse<StartInitialAssessmentResponse>,
                StartInitialAssessmentRequest
            >({
                query: (data) => ({
                    url:
                        "/assessments/initial/start",

                    method: "POST",

                    data,
                }),

                invalidatesTags: [
                    "Assessment",
                    "Workspace",
                ],
            }),

            getAssessmentSections: builder.query<
                ApiResponse<AssessmentSectionView[]>,
                string
            >({
                query: (assessmentId) => ({
                    url:
                        `/assessments/${assessmentId}/sections`,

                    method: "GET",
                }),

                providesTags: ["Assessment"],
            }),

            startSectionAttempt: builder.mutation<
                ApiResponse<StartSectionAttemptResponse>,
                string
            >({
                query: (sectionId) => ({
                    url:
                        `/assessment-sections/${sectionId}/attempts`,

                    method: "POST",
                }),

                invalidatesTags: ["Assessment"],
            }),

            autosaveAttempt: builder.mutation<
                ApiResponse<{ saved: number }>,
                AutosaveAttemptRequest
            >({
                query: ({
                    attemptId,
                    answers,
                }) => ({
                    url:
                        `/assessment-attempts/${attemptId}/answers`,

                    method: "PATCH",

                    data: {
                        answers,
                    },
                }),
            }),

            submitAssessmentAttempt: builder.mutation<
                ApiResponse<SubmitAttemptResponse>,
                SubmitAttemptRequest
            >({
                query: ({
                    attemptId,
                    answers,
                }) => ({
                    url:
                        `/assessment-attempts/${attemptId}/submit`,

                    method: "POST",

                    data: {
                        answers,
                    },
                }),

                invalidatesTags: [
                    "Assessment",
                    "CareerJourney",
                    "UserSkill",
                    "Workspace",
                ],
            }),
        }),
    });

export const {
    useInitializeUserSkillsMutation,
    useGetUserSkillsQuery,
    useStartInitialAssessmentMutation,
    useGetAssessmentSectionsQuery,
    useStartSectionAttemptMutation,
    useAutosaveAttemptMutation,
    useSubmitAssessmentAttemptMutation,
} = initialAssessmentApi;
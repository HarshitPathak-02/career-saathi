import { baseApi } from "../../../shared/api/baseApi";
import type { ApiResponse } from "../../../shared/types/api.types";
import type {
  ChallengeDetailResponse,
  EvaluateChallengeRequest,
  EvaluateChallengeResponse,
  OptInAttemptRequest,
  OptInAttemptResponse,
  PracticeHubResponse,
} from "../types/practice.types";

export const practiceApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPracticeHub: builder.query<ApiResponse<PracticeHubResponse>, string>({
      query: (careerJourneyId) => ({
        url: "/practice/hub",
        params: { careerJourneyId },
      }),
      providesTags: ["Practice"],
    }),

    getChallenge: builder.query<
      ApiResponse<ChallengeDetailResponse>,
      { slug: string; careerJourneyId: string }
    >({
      query: ({ slug, careerJourneyId }) => ({
        url: `/practice/challenges/${slug}`,
        params: { careerJourneyId },
      }),
      providesTags: (_result, _error, { slug }) => [{ type: "Practice", id: slug }],
    }),

    evaluateChallenge: builder.mutation<
      ApiResponse<EvaluateChallengeResponse>,
      { slug: string; body: EvaluateChallengeRequest }
    >({
      query: ({ slug, body }) => ({
        url: `/practice/challenges/${slug}/evaluate`,
        method: "POST",
        data: body,
      }),
      invalidatesTags: ["Practice"],
    }),

    optInAttempt: builder.mutation<
      ApiResponse<OptInAttemptResponse>,
      OptInAttemptRequest
    >({
      query: ({ attemptId, optIn }) => ({
        url: `/practice/attempts/${attemptId}/opt-in`,
        method: "POST",
        data: { optIn },
      }),
      invalidatesTags: ["Practice"],
    }),
  }),
});

export const {
  useGetPracticeHubQuery,
  useGetChallengeQuery,
  useEvaluateChallengeMutation,
  useOptInAttemptMutation,
} = practiceApi;

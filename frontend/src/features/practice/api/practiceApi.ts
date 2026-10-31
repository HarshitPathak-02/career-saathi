import { baseApi } from "../../../shared/api/baseApi";
import type { ApiResponse } from "../../../shared/types/api.types";
import type {
  ChallengeDetailResponse,
  EvaluateChallengeRequest,
  EvaluateChallengeResponse,
  InterviewSessionDto,
  OptInAttemptRequest,
  OptInAttemptResponse,
  OptInInterviewRequest,
  OptInInterviewResponse,
  PracticeHubResponse,
  StartInterviewRequest,
  SubmitInterviewAnswerRequest,
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

    startInterview: builder.mutation<
      ApiResponse<InterviewSessionDto>,
      StartInterviewRequest
    >({
      query: (body) => ({
        url: "/practice/interviews/start",
        method: "POST",
        data: body,
      }),
      invalidatesTags: ["Practice"],
    }),

    getInterview: builder.query<
      ApiResponse<InterviewSessionDto>,
      { sessionId: string; careerJourneyId: string }
    >({
      query: ({ sessionId, careerJourneyId }) => ({
        url: `/practice/interviews/${sessionId}`,
        params: { careerJourneyId },
      }),
      providesTags: (_res, _err, { sessionId }) => [
        { type: "Practice", id: sessionId },
      ],
    }),

    submitInterviewAnswer: builder.mutation<
      ApiResponse<InterviewSessionDto>,
      { sessionId: string; body: SubmitInterviewAnswerRequest }
    >({
      query: ({ sessionId, body }) => ({
        url: `/practice/interviews/${sessionId}/answer`,
        method: "POST",
        data: body,
      }),
      invalidatesTags: (_res, _err, { sessionId }) => [
        { type: "Practice", id: sessionId },
        "Practice",
      ],
    }),

    optInInterview: builder.mutation<
      ApiResponse<OptInInterviewResponse>,
      OptInInterviewRequest
    >({
      query: ({ sessionId, optIn }) => ({
        url: `/practice/interviews/${sessionId}/opt-in`,
        method: "POST",
        data: { optIn },
      }),
      invalidatesTags: (_res, _err, { sessionId }) => [
        { type: "Practice", id: sessionId },
        "Practice",
      ],
    }),
  }),
});

export const {
  useGetPracticeHubQuery,
  useGetChallengeQuery,
  useEvaluateChallengeMutation,
  useOptInAttemptMutation,
  useStartInterviewMutation,
  useGetInterviewQuery,
  useSubmitInterviewAnswerMutation,
  useOptInInterviewMutation,
} = practiceApi;

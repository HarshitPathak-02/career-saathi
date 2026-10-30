import { baseApi } from "../../../shared/api/baseApi";

import type { ApiResponse } from "../../../shared/types/api.types";

import type {
  AddDiscoveryAnswerRequest,
  CreateDiscoverySessionRequest,
  DiscoveryAnswer,
  DiscoveryCandidate,
  DiscoveryMessage,
  DiscoverySession,
  SelectDiscoveryCandidateRequest,
  SelectDiscoveryCandidateResponse,
} from "../types/discovery.types";

export const discoveryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getLatestDiscovery: builder.query<
      ApiResponse<DiscoverySession | null>,
      void
    >({
      query: () => ({
        url: "/discovery/latest",
        method: "GET",
      }),

      providesTags: ["Discovery"],
    }),

    startDiscovery: builder.mutation<
      ApiResponse<DiscoverySession>,
      CreateDiscoverySessionRequest
    >({
      query: (data) => ({
        url: "/discovery",
        method: "POST",
        data,
      }),

      invalidatesTags: ["Discovery"],
    }),

    getDiscoverySession: builder.query<ApiResponse<DiscoverySession>, string>({
      query: (discoveryId) => ({
        url: `/discovery/${discoveryId}`,
        method: "GET",
      }),

      providesTags: ["Discovery"],
    }),

    getDiscoveryMessages: builder.query<
      ApiResponse<DiscoveryMessage[]>,
      string
    >({
      query: (discoveryId) => ({
        url: `/discovery/${discoveryId}/messages`,
        method: "GET",
      }),

      providesTags: ["Discovery"],
    }),

    getDiscoveryCandidates: builder.query<
      ApiResponse<DiscoveryCandidate[]>,
      string
    >({
      query: (discoveryId) => ({
        url: `/discovery/${discoveryId}/candidates`,
        method: "GET",
      }),

      providesTags: ["Discovery"],
    }),

    addDiscoveryAnswer: builder.mutation<
      ApiResponse<DiscoveryAnswer>,
      AddDiscoveryAnswerRequest
    >({
      query: ({ discoveryId, ...data }) => ({
        url: `/discovery/${discoveryId}/answers`,
        method: "POST",
        data,
      }),

      invalidatesTags: ["Discovery"],
    }),

    generateDiscoveryCandidates: builder.mutation<
      ApiResponse<DiscoverySession>,
      string
    >({
      query: (discoveryId) => ({
        url: `/discovery/${discoveryId}/generate`,
        method: "POST",
      }),

      invalidatesTags: ["Discovery"],
    }),

    selectDiscoveryCandidate: builder.mutation<
      ApiResponse<SelectDiscoveryCandidateResponse>,
      SelectDiscoveryCandidateRequest
    >({
      query: ({ discoveryId, candidateId }) => ({
        url: `/discovery/${discoveryId}/candidates/${candidateId}/select`,
        method: "PATCH",
      }),

      invalidatesTags: ["Discovery", "Workspace", "CareerJourney"],
    }),
  }),
});

export const {
  useGetLatestDiscoveryQuery,
  useStartDiscoveryMutation,
  useGetDiscoverySessionQuery,
  useGetDiscoveryMessagesQuery,
  useGetDiscoveryCandidatesQuery,
  useAddDiscoveryAnswerMutation,
  useGenerateDiscoveryCandidatesMutation,
  useSelectDiscoveryCandidateMutation,
} = discoveryApi;

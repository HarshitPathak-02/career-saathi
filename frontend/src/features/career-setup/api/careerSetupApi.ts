// features/career-setup/api/careerSetupApi.ts

import { baseApi } from "../../../shared/api/baseApi";

import type { ApiResponse } from "../../../shared/types/api.types";

import type {
  CareerDomain,
  CareerJourney,
  CareerRole,
  CareerRoleSkill,
  CreateCareerJourneyRequest,
} from "../types/careerSetup.types";

export const careerSetupApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCareerDomains: builder.query<ApiResponse<CareerDomain[]>, void>({
      query: () => ({
        url: "/lookup/career-domains",
        method: "GET",
      }),
      providesTags: ["CareerSetup"],
    }),

    getCareerRoles: builder.query<ApiResponse<CareerRole[]>, string>({
      query: (domainId) => ({
        url: `/lookup/career-domains/${domainId}/roles`,
        method: "GET",
      }),
      providesTags: ["CareerSetup"],
    }),

    getCareerRoleSkills: builder.query<ApiResponse<CareerRoleSkill[]>, string>({
      query: (roleId) => ({
        url: `/lookup/career-roles/${roleId}/skills`,
        method: "GET",
      }),
      providesTags: ["CareerSetup"],
    }),

    getActiveCareerJourney: builder.query<
      ApiResponse<CareerJourney | null>,
      void
    >({
      query: () => ({
        url: "/career-journeys/active",
        method: "GET",
      }),
      providesTags: ["CareerJourney"],
    }),

    createCareerJourney: builder.mutation<
      ApiResponse<CareerJourney>,
      CreateCareerJourneyRequest
    >({
      query: (data) => ({
        url: "/career-journeys",
        method: "POST",
        data,
      }),
      invalidatesTags: ["CareerJourney"],
    }),
  }),
});

export const {
  useGetCareerDomainsQuery,
  useGetCareerRolesQuery,
  useGetCareerRoleSkillsQuery,
  useGetActiveCareerJourneyQuery,
  useCreateCareerJourneyMutation,
} = careerSetupApi;
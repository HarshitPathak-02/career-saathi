import { baseApi } from "../../../shared/api/baseApi";

import type {
  ApiResponse,
} from "../../../shared/types/api.types";

import type {
  ConfirmResumeSkillsRequest,
  Resume,
  UploadResumeRequest,
} from "../types/resume.types";

export const resumeApi =
  baseApi.injectEndpoints({
    endpoints: (builder) => ({
      getResumeByCareerJourney:
        builder.query<
          ApiResponse<Resume>,
          string
        >({
          query: (careerJourneyId) => ({
            url:
              `/resume/career-journey/${careerJourneyId}`,

            method: "GET",
          }),

          providesTags: ["Resume"],
        }),

      uploadResume: builder.mutation<
        ApiResponse<Resume>,
        UploadResumeRequest
      >({
        query: ({
          careerJourneyId,
          file,
        }) => {
          const formData = new FormData();

          formData.append(
            "careerJourneyId",
            careerJourneyId
          );

          formData.append(
            "resume",
            file
          );

          return {
            url: "/resume",
            method: "POST",
            data: formData,
          };
        },

        invalidatesTags: ["Resume"],
      }),

      analyzeResume: builder.mutation<
        ApiResponse<Resume>,
        string
      >({
        query: (resumeId) => ({
          url:
            `/resume/${resumeId}/analyze`,

          method: "POST",
        }),

        invalidatesTags: ["Resume"],
      }),

      confirmResumeSkills:
        builder.mutation<
          ApiResponse<Resume>,
          ConfirmResumeSkillsRequest
        >({
          query: ({
            resumeId,
            skillCatalogIds,
          }) => ({
            url:
              `/resume/${resumeId}/skills/confirm`,

            method: "POST",

            data: {
              skillCatalogIds,
            },
          }),

          invalidatesTags: [
            "Resume",
            "UserSkill",
          ],
        }),
    }),
  });

export const {
  useGetResumeByCareerJourneyQuery,
  useUploadResumeMutation,
  useAnalyzeResumeMutation,
  useConfirmResumeSkillsMutation,
} = resumeApi;

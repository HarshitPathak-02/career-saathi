import { baseApi } from "../../../shared/api/baseApi";
import type { ApiResponse } from "../../../shared/types/api.types";
import type { User } from "../../auth/types/auth.types";
import type {
  CompetencyPassportResponse,
  CareerJourneyListItem,
  NotificationsResponse,
  NotificationItem,
} from "../types/profile.types";

export interface UpdateProfileInput {
  fullName?: string;
  phoneNumber?: string;
  headline?: string;
  bio?: string;
  githubUrl?: string;
  linkedinUrl?: string;
}

export interface ChangePasswordInput {
  currentPassword: string;
  newPassword: string;
}

export const profileApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCompetencyPassport: builder.query<
      ApiResponse<CompetencyPassportResponse>,
      string
    >({
      query: (careerJourneyId) => ({
        url: `/user-skills/career-journeys/${careerJourneyId}/passport`,
        method: "GET",
      }),
      providesTags: ["UserSkill", "Assessment", "Practice"],
    }),

    getAllCareerJourneys: builder.query<
      ApiResponse<CareerJourneyListItem[]>,
      void
    >({
      query: () => ({
        url: "/career-journeys",
        method: "GET",
      }),
      providesTags: ["CareerJourney"],
    }),

    switchActiveCareerJourney: builder.mutation<
      ApiResponse<CareerJourneyListItem>,
      string
    >({
      query: (careerJourneyId) => ({
        url: `/career-journeys/${careerJourneyId}/switch-active`,
        method: "POST",
      }),
      invalidatesTags: ["CareerJourney", "Workspace", "UserSkill", "Roadmap", "Mission"],
    }),

    updateUserProfile: builder.mutation<ApiResponse<User>, UpdateProfileInput>({
      query: (body) => ({
        url: "/auth/me",
        method: "PATCH",
        data: body,
      }),
      invalidatesTags: ["Auth"],
    }),

    changeUserPassword: builder.mutation<ApiResponse<null>, ChangePasswordInput>({
      query: (body) => ({
        url: "/auth/change-password",
        method: "POST",
        data: body,
      }),
    }),

    getNotifications: builder.query<ApiResponse<NotificationsResponse>, void>({
      query: () => ({
        url: "/notifications",
        method: "GET",
      }),
      providesTags: ["Notification"],
    }),

    markNotificationRead: builder.mutation<ApiResponse<NotificationItem>, string>({
      query: (notificationId) => ({
        url: `/notifications/${notificationId}/read`,
        method: "PATCH",
      }),
      invalidatesTags: ["Notification"],
    }),

    markAllNotificationsRead: builder.mutation<ApiResponse<null>, void>({
      query: () => ({
        url: "/notifications/mark-all-read",
        method: "POST",
      }),
      invalidatesTags: ["Notification"],
    }),
  }),
});

export const {
  useGetCompetencyPassportQuery,
  useGetAllCareerJourneysQuery,
  useSwitchActiveCareerJourneyMutation,
  useUpdateUserProfileMutation,
  useChangeUserPasswordMutation,
  useGetNotificationsQuery,
  useMarkNotificationReadMutation,
  useMarkAllNotificationsReadMutation,
} = profileApi;

import { baseApi } from "../../../shared/api/baseApi";
import type { ApiResponse } from "../../../shared/types/api.types";

import {
    type LoginRequest,
    type RegisterRequest,
    type AuthResponse,
    type User,
    type UpdateProfileDto,
    type RefreshResponse,
} from "../types/auth.types";

export const authApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({

        login: builder.mutation<ApiResponse<AuthResponse>, LoginRequest>({
            query: (body) => ({
                url: "/auth/login",
                method: "POST",
                data: body,
            }),
        }),

        register: builder.mutation<ApiResponse<AuthResponse>, RegisterRequest>({
            query: (body) => ({
                url: "/auth/register",
                method: "POST",
                data: body,
            }),
        }),

        refresh: builder.mutation<ApiResponse<RefreshResponse>, void>({
            query: () => ({
                url: "/auth/refresh",
                method: "POST",
            }),
        }),

        logout: builder.mutation<void, void>({
            query: () => ({
                url: "/auth/logout",
                method: "POST",
            }),
        }),

        me: builder.query<ApiResponse<User>, void>({
            query: () => ({
                url: "/auth/me",
                method: "GET",
            }),
        }),

        updateProfile: builder.mutation<
            ApiResponse<User>,
            UpdateProfileDto
        >({
            query: (body) => ({
                url: "/auth/me",
                method: "PATCH",
                data: body,
            }),

            async onQueryStarted(
                _,
                {
                    dispatch,
                    queryFulfilled,
                }
            ) {
                try {

                    const { data } =
                        await queryFulfilled;

                    dispatch(
                        authApi.util.updateQueryData(
                            "me",
                            undefined,
                            (draft) => {
                                draft.data = data.data;
                            }
                        )
                    );

                } catch {
                    // handled by RTK Query
                }
            },
        }),

    }),
});

export const {
    useLoginMutation,
    useRegisterMutation,
    useRefreshMutation,
    useLogoutMutation,
    useLazyMeQuery,
    useMeQuery,
    useUpdateProfileMutation
} = authApi;
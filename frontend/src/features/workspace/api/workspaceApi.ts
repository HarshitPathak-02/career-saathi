import { baseApi } from "../../../shared/api/baseApi";

import type { ApiResponse } from "../../../shared/types/api.types";

import type {
    Workspace,
} from "../types/workspace.types";

export const workspaceApi =
    baseApi.injectEndpoints({
        endpoints: (builder) => ({
            getWorkspace: builder.query<
                ApiResponse<Workspace>,
                void
            >({
                query: () => ({
                    url: "/workspace",
                    method: "GET",
                }),

                providesTags: ["CareerJourney"],
            }),
        }),
    });

export const {
    useGetWorkspaceQuery,
} = workspaceApi;
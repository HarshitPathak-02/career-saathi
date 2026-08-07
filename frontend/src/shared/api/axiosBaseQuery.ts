import type {
  BaseQueryFn,
} from "@reduxjs/toolkit/query";

import type {
  AxiosError,
  AxiosRequestConfig,
} from "axios";

import { api } from "./api";

import type {
  ApiBaseResponse,
  ApiError,
} from "../types/api.types";

type AxiosBaseQueryArgs = {
  url: string;
  method?: AxiosRequestConfig["method"];
  data?: unknown;
  params?: unknown;
};

export const axiosBaseQuery =
  (): BaseQueryFn<
    AxiosBaseQueryArgs,
    unknown,
    ApiError
  > =>
    async ({
      url,
      method = "GET",
      data,
      params,
    }) => {
      try {
        const result = await api({
          url,
          method,
          data,
          params,
        });

        return {
          data: result.data,
        };
      } catch (axiosError) {
        const error =
          axiosError as AxiosError<ApiBaseResponse>;

        return {
          error: {
            status:
              error.response?.status,
            data:
              error.response?.data,
          },
        };
      }
    };
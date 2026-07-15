import { AxiosError } from "axios";

interface ErrorResponse {
  message?: string;
}

export const getApiErrorMessage = (
  error: unknown
): string => {
  if (error instanceof AxiosError) {
    return (
      error.response?.data?.message ??
      "Something went wrong."
    );
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Something went wrong.";
};
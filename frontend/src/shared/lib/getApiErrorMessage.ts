import type {
  ApiError,
} from "../types/api.types";

export const getApiErrorMessage = (
  error: unknown
): string => {

  if (
    typeof error === "object" &&
    error !== null &&
    "data" in error
  ) {
    const apiError =
      error as ApiError;

    return (
      apiError.data?.message ??
      "Something went wrong."
    );
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Something went wrong.";
};
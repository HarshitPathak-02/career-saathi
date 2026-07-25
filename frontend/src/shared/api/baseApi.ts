import { createApi } from "@reduxjs/toolkit/query/react";

import { axiosBaseQuery } from "./axiosBaseQuery";

export const baseApi = createApi({
  reducerPath: "api",

  baseQuery: axiosBaseQuery(),

  tagTypes: [
    "Auth",
    "CareerSetup",
    "CareerJourney",
    "Roadmap",
    "Mission",
    "DailyTask",
    "Assessment",
    "Workspace"
  ],

  endpoints: () => ({}),
});
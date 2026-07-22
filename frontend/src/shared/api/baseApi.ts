import { createApi } from "@reduxjs/toolkit/query/react";

import { axiosBaseQuery } from "./axiosBaseQuery";

export const baseApi = createApi({
  reducerPath: "api",

  baseQuery: axiosBaseQuery(),

  tagTypes: [
    "Auth",
    "Dashboard",
    "Roadmap",
    "Mission",
    "Task",
    "Assessment",
    "WeeklyProgress",
    "CareerJourney",
    "CareerRole",
    "UserSkill"
  ],

  endpoints: () => ({}),
});
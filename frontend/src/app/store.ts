import { configureStore } from "@reduxjs/toolkit";

import { baseApi } from "../shared/api/baseApi";
import authReducer from "../features/auth/slice/authSlice";
import careerSetupReducer from "../features/career-setup/slice/careerSetupSlice";
import initialAssessmentReducer from "../features/initial-assessment/slice/initialAssessmentSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    careerSetup: careerSetupReducer,
    initialAssessment:
      initialAssessmentReducer,

    [baseApi.reducerPath]: baseApi.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
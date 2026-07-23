import { configureStore } from "@reduxjs/toolkit";

import { baseApi } from "../shared/api/baseApi";
import authReducer from "../features/auth/slice/authSlice";
import careerSetupReducer from "../features/career-setup/slice/careerSetupSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    careerSetup: careerSetupReducer,

    [baseApi.reducerPath]: baseApi.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
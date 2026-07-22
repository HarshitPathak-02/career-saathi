import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import { type User } from "../types/auth.types";

interface AuthState {
  accessToken: string | null;

  user: User | null;
  isInitialized: boolean;
}

const initialState: AuthState = {
  accessToken: null,

  user: null,
  isInitialized: false
};

const authSlice = createSlice({
  name: "auth",

  initialState,

  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{
        accessToken: string;
        user?: User | null;
      }>
    ) => {
      state.accessToken = action.payload.accessToken;

      if (action.payload.user !== undefined) {
        state.user = action.payload.user;
      }
    },

    clearCredentials: (state) => {
      state.accessToken = null;

      state.user = null;
    },

    setInitialized: (
      state,
      action: PayloadAction<boolean>
    ) => {
      state.isInitialized = action.payload;
    },

    updateAccessToken(
      state,
      action: PayloadAction<string>
    ) {
      state.accessToken = action.payload;
    },

    logout: () => initialState
  },
});

export const {
  setCredentials,
  logout,
  clearCredentials,
  setInitialized,
  updateAccessToken
} = authSlice.actions;

export default authSlice.reducer;
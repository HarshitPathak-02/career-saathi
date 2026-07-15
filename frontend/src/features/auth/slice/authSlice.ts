import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import { type User } from "../types/auth.types";

interface AuthState {
  accessToken: string | null;

  user: User | null;
}

const initialState: AuthState = {
  accessToken: null,

  user: null,
};

const authSlice = createSlice({
  name: "auth",

  initialState,

  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{
        accessToken: string;
        user: User;
      }>
    ) => {
      state.accessToken = action.payload.accessToken;

      state.user = action.payload.user;

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
} = authSlice.actions;

export default authSlice.reducer;
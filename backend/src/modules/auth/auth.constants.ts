export const AUTH_MESSAGES = {
  REGISTER_SUCCESS:
    "Registration successful.",

  LOGIN_SUCCESS:
    "Login successful.",

  LOGOUT_SUCCESS:
    "Logout successful.",

  REFRESH_SUCCESS:
    "Token refreshed successfully.",

  PROFILE_FETCH_SUCCESS:
    "Profile fetched successfully.",

  EMAIL_ALREADY_EXISTS:
    "Email already exists.",

  INVALID_CREDENTIALS:
    "Invalid email or password.",

  REFRESH_TOKEN_REQUIRED:
    "Refresh token is required.",

  REFRESH_TOKEN_REVOKED:
    "Refresh token has been revoked. Please sign in again.",

  SESSION_REVOKED:
    "Session revoked successfully.",

  ALL_SESSIONS_REVOKED:
    "All sessions have been signed out.",

  USER_NOT_FOUND:
    "User not found.",

  ACCOUNT_INACTIVE:
    "Your account is inactive.",

  ACCOUNT_SUSPENDED:
    "Your account has been suspended.",

  PASSWORD_RESET_SENT:
    "Password reset email sent.",

  PASSWORD_RESET_SUCCESS:
    "Password reset successful.",
} as const;
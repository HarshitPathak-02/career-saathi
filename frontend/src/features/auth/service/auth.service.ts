import {
  loginApi,
  registerApi,
  refreshApi,
  logoutApi,
} from "../api/authApi";

import {
  type LoginRequest,
  type RegisterRequest,
} from "../types/auth.types";

class AuthService {
  login(data: LoginRequest) {
    return loginApi(data);
  }

  register(data: RegisterRequest) {
    return registerApi(data);
  }

  refresh() {
    return refreshApi();
  }

  logout() {
    return logoutApi();
  }
}

export const authService = new AuthService();
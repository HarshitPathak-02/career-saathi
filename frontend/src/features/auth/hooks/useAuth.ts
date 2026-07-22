import { useNavigate } from "react-router-dom";

import { useAppDispatch } from "../../../app/hooks";

import { setCredentials } from "../slice/authSlice";

import {
  useLoginMutation,
  useRegisterMutation,
} from "../api/authApi";

import { baseApi } from "../../../shared/api/baseApi";

import {
  showError,
  showSuccess,
} from "../../../shared/lib/toast";

import { getApiErrorMessage } from "../../../shared/lib/getApiErrorMessage";

export const useAuth = () => {
  const navigate = useNavigate();

  const dispatch = useAppDispatch();

  const [login, loginState] =
    useLoginMutation();

  const [register, registerState] =
    useRegisterMutation();

  const loginUser = async (
    email: string,
    password: string
  ) => {
    try {
      const response = await login({
        email,
        password,
      }).unwrap();

      dispatch(
        setCredentials({
          accessToken:
            response.data.accessToken,

          user: response.data.user,
        })
      );

      dispatch(
        baseApi.util.resetApiState()
      );

      showSuccess(response.message);

      navigate("/", {
        replace: true,
      });
    } catch (error) {
      showError(
        getApiErrorMessage(error)
      );

      throw error;
    }
  };

  const registerUser = async (
    fullName: string,
    email: string,
    password: string
  ) => {
    try {
      const response = await register({
        fullName,
        email,
        password,
      }).unwrap();

      dispatch(
        setCredentials({
          accessToken:
            response.data.accessToken,

          user: response.data.user,
        })
      );

      dispatch(
        baseApi.util.resetApiState()
      );

      showSuccess(response.message);

      navigate("/", {
        replace: true,
      });
    } catch (error) {
      showError(
        getApiErrorMessage(error)
      );

      throw error;
    }
  };

  return {
    loginUser,
    registerUser,

    loginState,
    registerState,
  };
};
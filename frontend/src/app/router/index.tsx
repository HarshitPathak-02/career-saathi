import {
  createBrowserRouter,
} from "react-router-dom";

import PublicLayout from "../../layouts/PublicLayout";
import ProtectedLayout from "../../layouts/ProtectedLayout";

import LoginPage from "../../features/auth/pages/LoginPage";
import RegisterPage from "../../features/auth/pages/RegisterPage";

import AppEntry from "../../features/auth/components/AppEntry";
import LandingPage from "../../features/oublic/landing/pages/LandingPage";
import WorkspacePage from "../../features/workspace/WorkspacePage";


export const router =
  createBrowserRouter([
    {
      element: <PublicLayout />,

      children: [
        {
          path: "/",
          element: <LandingPage />,
        },

        {
          path: "/login",
          element: <LoginPage />,
        },

        {
          path: "/register",
          element: <RegisterPage />,
        },
      ],
    },

    {
      element: <ProtectedLayout />,
      children: [
        {
          path: "/",
          element: <AppEntry />,
        },
        {
          path: "/workspace",
          element: <WorkspacePage />,
        },
      ],
    }
  ]);
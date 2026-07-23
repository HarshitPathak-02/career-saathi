import { createBrowserRouter } from "react-router-dom";

import PublicLayout from "../../layouts/PublicLayout";
import ProtectedLayout from "../../layouts/ProtectedLayout";
import OnboardingGuard from "../../routes/OnboardingGuard";
import WorkspaceGuard from "../../routes/WorkspaceGuard";

import LandingPage from "../../features/public/landing/pages/LandingPage";

import LoginPage from "../../features/auth/pages/LoginPage";
import RegisterPage from "../../features/auth/pages/RegisterPage";
import AppEntry from "../../features/auth/components/AppEntry";

import CareerDirectionPage from "../../features/career-setup/pages/CareerDirectionPage";
import CareerDomainPage from "../../features/career-setup/pages/CareerDomainPage";
import CareerRolePage from "../../features/career-setup/pages/CareerRolePage";
import CareerJourneyPage from "../../features/career-setup/pages/CareerJourneyPage";

import WorkspacePage from "../../features/workspace/WorkspacePage";

export const router = createBrowserRouter([
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
        path: "/app",
        element: <AppEntry />,
      },

      {
        element: <OnboardingGuard />,
        children: [
          {
            path: "/career-direction",
            element: <CareerDirectionPage />,
          },
          {
            path: "/career-domain",
            element: <CareerDomainPage />,
          },
          {
            path: "/career-role",
            element: <CareerRolePage />,
          },
          {
            path: "/career-journey",
            element: <CareerJourneyPage />,
          },
        ],
      },

      {
        element: <WorkspaceGuard />,
        children: [
          {
            path: "/workspace",
            element: <WorkspacePage />,
          },
        ],
      },
    ],
  },
]);
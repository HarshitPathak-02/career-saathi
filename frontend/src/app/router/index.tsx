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

import WorkspacePage from "../../features/workspace/pages/WorkspacePage";
import InitialAssessmentPage from "../../features/initial-assessment/pages/InitialAssessmentPage";
import RoadmapPage from "../../features/roadmap/pages/RoadmapPage";
import AssessmentsPage from "../../features/assessment/pages/AssessmentsPage";
import AssessmentDetailPage from "../../features/assessment/pages/AssessmentDetailPage";
import MissionsPage from "../../features/mission/pages/MissionsPage";
import MissionDetailsPage from "../../features/mission/pages/MissionDetailsPage";
import WeeklyReviewPage from "../../features/weekly-review/pages/WeeklyReviewPage";
import WeeklyReportsPage from "../../features/weekly-report/pages/WeeklyReportsPage";
import WeeklyReportDetailsPage from "../../features/weekly-report/pages/WeeklyReportDetailsPage";

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
          {
            path: "/initial-assessment",
            element: <InitialAssessmentPage />,
          },
          {
            path: "/roadmap",
            element: <RoadmapPage />
          },
          {
            path: "/assessments",
            element: <AssessmentsPage />,
          },

          {
            path: "/assessments/:assessmentId",
            element: <AssessmentDetailPage />,
          },
          {
            path: "/missions",
            element: <MissionsPage />,
          },
          {
            path: "/missions/:missionId",
            element: <MissionDetailsPage />,
          },
          {
            path: "/weekly-review",
            element: < WeeklyReviewPage />
          },
          {
            path: "/weekly-reports",
            element:
              <WeeklyReportsPage />
          },
          {
            path: "/weekly-reports/:reportId",
            element: <WeeklyReportDetailsPage />,
          },
        ],
      },
    ],
  },
]);
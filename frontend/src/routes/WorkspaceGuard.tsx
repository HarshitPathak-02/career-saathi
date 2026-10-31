import { Navigate, Outlet } from "react-router-dom";
import { useGetActiveCareerJourneyQuery } from "../features/career-setup/api/careerSetupApi";
import { ErrorBoundary } from "../components/ui/ErrorBoundary";

const WorkspaceGuard = () => {
  const { data, isLoading } = useGetActiveCareerJourneyQuery();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="h-9 w-9 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />
          <p className="text-sm font-medium text-slate-500">Loading your workspace...</p>
        </div>
      </div>
    );
  }

  if (!data?.data) {
    return <Navigate to="/career-direction" replace />;
  }

  return (
    <ErrorBoundary fallbackTitle="Workspace rendering error">
      <Outlet />
    </ErrorBoundary>
  );
};

export default WorkspaceGuard;

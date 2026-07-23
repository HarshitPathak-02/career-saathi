import { Navigate, Outlet } from "react-router-dom";

import { useGetActiveCareerJourneyQuery } from "../features/career-setup/api/careerSetupApi";

const WorkspaceGuard = () => {
    const { data, isLoading } = useGetActiveCareerJourneyQuery();

    if (isLoading) {
        return <>Loading...</>;
    }

    if (!data?.data) {
        return <Navigate to="/career-direction" replace />;
    }

    return <Outlet />;
};

export default WorkspaceGuard;
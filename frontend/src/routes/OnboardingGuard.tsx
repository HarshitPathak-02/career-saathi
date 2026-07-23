import { Navigate, Outlet } from "react-router-dom";

import { useGetActiveCareerJourneyQuery } from "../features/career-setup/api/careerSetupApi";

const OnboardingGuard = () => {
    const { data, isLoading } = useGetActiveCareerJourneyQuery();

    if (isLoading) {
        return <>Loading...</>;
    }

    if (data?.data) {
        return <Navigate to="/workspace" replace />;
    }

    return <Outlet />;
};

export default OnboardingGuard;
import { Navigate } from "react-router-dom";

import { useGetActiveCareerJourneyQuery } from "../../career-setup/api/careerSetupApi";

const AppEntry = () => {
  const { data, isLoading } = useGetActiveCareerJourneyQuery();

  if (isLoading) {
    return <>Loading...</>;
  }

  if (data?.data) {
    return <Navigate to="/workspace" replace />;
  }

  return <Navigate to="/career-direction" replace />;
};

export default AppEntry;
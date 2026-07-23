import { Navigate, Outlet } from "react-router-dom";

import { useAppSelector } from "../app/hooks";

const PublicLayout = () => {
  const {
    accessToken,
    user,
    isInitialized,
  } = useAppSelector((state) => state.auth);

  if (!isInitialized) {
    return <>Loading...</>;
  }

  const isAuthenticated =
    !!accessToken && !!user;

  if (isAuthenticated) {
    return <Navigate to="/app" replace />;
  }

  return <Outlet />;
};

export default PublicLayout;
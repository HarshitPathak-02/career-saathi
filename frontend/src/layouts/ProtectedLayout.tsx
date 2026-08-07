import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../app/hooks";

const ProtectedLayout = () => {
  const {
    accessToken,
    user,
    isInitialized,
  } = useAppSelector(
    (state) => state.auth
  );

  if (!isInitialized) {
    return <>Loading...</>;
  }

  const isAuthenticated =
    !!accessToken && !!user;

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  return <Outlet />;
};

export default ProtectedLayout;
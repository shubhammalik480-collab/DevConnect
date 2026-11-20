import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import Navbar from "./Navbar";

const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <h2>Loading...</h2>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Hide Navbar only on Dashboard
  const isDashboard = location.pathname === "/dashboard";

  return (
    <>
      {!isDashboard && <Navbar />}
      <Outlet />
    </>
  );
};

export default ProtectedRoute;
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "./Navbar";

const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useAuth();

  // Wait until authentication check completes
  if (loading) {
    return <h2>Loading...</h2>;
  }

  // Redirect unauthenticated users
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Show Navbar on all protected pages
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
};

export default ProtectedRoute;
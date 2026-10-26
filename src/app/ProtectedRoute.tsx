import { Navigate, useLocation, Outlet } from "react-router";
import { useAuth } from "../features/auth/AuthProvider";

export default function ProtectedRoute() {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  return <Outlet />;
}

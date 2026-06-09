import { Navigate } from "react-router-dom";
import useAuthStore from "@/store/authStore";
import type { AuthRole } from "@/store/authStore";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: AuthRole[];
}

export default function ProtectedRoute({
  children,
  allowedRoles,
}: ProtectedRouteProps) {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return (
      <Navigate to={user.role === "admin" ? "/dashboard" : "/pos"} replace />
    );
  }

  return <>{children}</>;
}

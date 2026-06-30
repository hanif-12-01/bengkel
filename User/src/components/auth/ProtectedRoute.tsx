import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: Array<"customer" | "admin" | "mechanic">;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
}) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent mx-auto"></div>
          <p className="mt-4 text-sm font-medium text-gray-600 dark:text-gray-400">
            Memuat data pengguna...
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    // Redirect ke login dengan history state redirect back
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Jika role tidak diizinkan, arahkan kembali sesuai role
    if (user.role === "admin") {
      return <Navigate to="/admin" replace />;
    } else if (user.role === "mechanic") {
      return <Navigate to="/mechanic" replace />;
    } else {
      return <Navigate to="/" replace />;
    }
  }

  return <>{children}</>;
};
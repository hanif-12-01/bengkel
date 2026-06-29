import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { SimobsProvider, useSimobs } from "./context/SimobsContext";
import AppShell from "./components/layout/AppShell";
import { LoadingSpinner } from "./components/ui";
import {
  AdminLoginPage,
  AdminRegisterPage,
  CustomerLoginPage,
  CustomerRegisterPage,
  OtpPage,
} from "./pages/AuthPages";
import {
  CustomerBookingDetailPage,
  CustomerBookingPage,
  CustomerDashboardPage,
  CustomerGarasiPage,
  CustomerHistoryPage,
  CustomerNotificationsPage,
  CustomerProfilePage,
  CustomerSettingsPage,
  CustomerSparepartCategoryPage,
  CustomerSparepartsPage,
  CustomerStatusPage,
} from "./pages/CustomerPages";
import {
  AdminBookingsPage,
  AdminCustomersPage,
  AdminDashboardPage,
  AdminListPage,
  AdminSparepartsPage,
} from "./pages/AdminPages";
import type { Role } from "./types";

function ProtectedRoute({
  role,
  children,
}: {
  role: Role;
  children: React.ReactNode;
}) {
  const { session, booting } = useSimobs();
  if (booting) return <LoadingSpinner label="Menyiapkan sesi..." />;
  if (!session || session.role !== role)
    return (
      <Navigate to={role === "admin" ? "/admin/login" : "/login"} replace />
    );
  return <>{children}</>;
}

function HomeRedirect() {
  const { session, booting } = useSimobs();
  if (booting) return <LoadingSpinner label="Menyiapkan aplikasi..." />;
  if (session?.role === "admin")
    return <Navigate to="/admin/dashboard" replace />;
  if (session?.role === "customer")
    return <Navigate to="/app/dashboard" replace />;
  return <Navigate to="/login" replace />;
}

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomeRedirect />} />
        <Route path="/login" element={<CustomerLoginPage />} />
        <Route path="/register" element={<CustomerRegisterPage />} />
        <Route path="/verify-otp" element={<OtpPage />} />
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/admin/register" element={<AdminRegisterPage />} />

        <Route
          path="/app"
          element={
            <ProtectedRoute role="customer">
              <AppShell role="customer" />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<CustomerDashboardPage />} />
          <Route path="booking" element={<CustomerBookingPage />} />
          <Route path="history" element={<CustomerHistoryPage />} />
          <Route path="status" element={<CustomerStatusPage />} />
          <Route path="bookings/:id" element={<CustomerBookingDetailPage />} />
          <Route path="notifications" element={<CustomerNotificationsPage />} />
          <Route path="profile" element={<CustomerProfilePage />} />
          <Route path="settings" element={<CustomerSettingsPage />} />
          <Route path="spareparts" element={<CustomerSparepartsPage />} />
          <Route
            path="spareparts/:slug"
            element={<CustomerSparepartCategoryPage />}
          />
          <Route path="vehicles" element={<CustomerGarasiPage />} />
        </Route>

        <Route
          path="/admin"
          element={
            <ProtectedRoute role="admin">
              <AppShell role="admin" />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboardPage />} />
          <Route path="pelanggan" element={<AdminCustomersPage />} />
          <Route path="bookings" element={<AdminBookingsPage />} />
          <Route path="spareparts" element={<AdminSparepartsPage />} />
          <Route path="admins" element={<AdminListPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default function App() {
  return (
    <SimobsProvider>
      <AppRoutes />
    </SimobsProvider>
  );
}

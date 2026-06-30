import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "sonner";
import AppShell from "./components/layout/AppShell";
import { AdminDashboard } from "./pages/AdminPages";
import {
  BookingStatusPage,
  CustomerBooking,
  CustomerHistory,
  CustomerRewards,
  CustomerServices,
  CustomerTracking,
  LandingPage,
} from "./pages/CustomerPages";
import { AuthProvider } from "./context/AuthContext";
import { LoginPage, RegisterPage, ProfilePage } from "./pages/AuthPages";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppShell>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/layanan" element={<CustomerServices />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Protected Customer Routes */}
            <Route
              path="/booking"
              element={
                <ProtectedRoute allowedRoles={["customer"]}>
                  <CustomerBooking />
                </ProtectedRoute>
              }
            />
            <Route
              path="/status"
              element={
                <ProtectedRoute allowedRoles={["customer", "admin", "mechanic"]}>
                  <BookingStatusPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/tracking"
              element={
                <ProtectedRoute allowedRoles={["customer"]}>
                  <CustomerTracking />
                </ProtectedRoute>
              }
            />
            <Route
              path="/riwayat"
              element={
                <ProtectedRoute allowedRoles={["customer"]}>
                  <CustomerHistory />
                </ProtectedRoute>
              }
            />
            <Route
              path="/rewards"
              element={
                <ProtectedRoute allowedRoles={["customer"]}>
                  <CustomerRewards />
                </ProtectedRoute>
              }
            />

            {/* Protected Admin Routes */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={["admin", "mechanic"]}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />

            <Route path="/admin/orders" element={<Navigate to="/admin" replace />} />
            <Route path="/admin/services" element={<Navigate to="/admin" replace />} />
            <Route path="/admin/inventory" element={<Navigate to="/admin" replace />} />
            <Route path="/admin/staff" element={<Navigate to="/admin" replace />} />
            <Route path="/admin/reports" element={<Navigate to="/admin" replace />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AppShell>
        <Toaster richColors position="top-right" />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;

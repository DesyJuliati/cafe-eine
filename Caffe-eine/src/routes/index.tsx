// src/routes/index.tsx
import { Routes, Route, Navigate } from "react-router-dom";
import useAuthStore from "@/store/authStore";
import ProtectedRoute from "@/component/common/ProtectedRoute";
import LoginPage from "@/pages/auth/login";
import RegisterPage from "@/pages/auth/register";
import AdminDashboard from "@/pages/dashboard/AdminDashboard";
import POSPage from "@/pages/pos/POSPage";
import PaymentPage from "@/pages/payment/PaymentPage";
import KitchenPage from "@/pages/kitchen/KitchenPage";
import ReportPage from "@/pages/report/ReportPage";
import MenuManagement from "@/pages/menu/MenuPage";
import StockPage from "@/pages/stock/StockPage";
import EmployeePage from "@/pages/employee/EmployeePage"; // ← Impor (sudah ada)

export default function AppRoutes() {
  const { isAuthenticated, user } = useAuthStore();
  return (
    <Routes>
      <Route
        path="/"
        element={
          isAuthenticated ? (
            <Navigate
              to={user?.role === "admin" ? "/dashboard" : "/pos"}
              replace
            />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* ADMIN ROUTES */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/report"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <ReportPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/menu-management"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <MenuManagement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/stock"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <StockPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/employees"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <EmployeePage />
          </ProtectedRoute>
        }
      />

      {/* KASIR & ADMIN BERSAMA */}
      <Route
        path="/pos"
        element={
          <ProtectedRoute allowedRoles={["admin", "cashier"]}>
            <POSPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/payment"
        element={
          <ProtectedRoute allowedRoles={["admin", "cashier"]}>
            <PaymentPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/kitchen"
        element={
          <ProtectedRoute allowedRoles={["admin", "cashier"]}>
            <KitchenPage />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import VerifyEmailPage from "./pages/VerifyEmailPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";

import Feedback from "./components/customer/Feedback";
import UserManagement from "./pages/AdminPages/UserManagement";
import ServiceManagement from "./pages/AdminPages/ServiceManagement";
import CustomerDashboard from "./pages/CustomerPages/Dashboard";
import StaffDashboard from "./pages/StaffPages/Dashboard";

import AdminLayout from "./components/admin/Layout/AdminLayout";
import AdminDashboard from "./pages/AdminPages/Dashboard";
import AdminPlaceholderPage from "./pages/AdminPages/AdminPlaceholderPage";
import CounterManagement from "./pages/AdminPages/CounterManagement";
import QueueManagement from "./pages/AdminPages/QueueManagement";
import StaffManagementPage from "./pages/AdminPages/StaffManagementPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public */}
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />

        {/* Customer */}
        <Route
          path="/customer"
          element={
            <ProtectedRoute role="customer">
              <CustomerDashboard />
            </ProtectedRoute>
          }
        />


        {/* Staff */}
        <Route
          path="/staff/dashboard"
          element={
            <ProtectedRoute role="staff">
              <StaffDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <ProtectedRoute role="admin">
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="/admin/staffs" element={<StaffManagementPage />} />
          <Route path="feedback" element={<Feedback />} />
          <Route path="services" element={<ServiceManagement />} />
          <Route 
              path="queue" 
              element={<QueueManagement />} 
          />
          <Route
            path="counters"
            element={<CounterManagement />}
          />
          <Route
            path="reports"
            element={
              <AdminPlaceholderPage
                title="Báo cáo"
                description="Các thống kê, biểu đồ và báo cáo vận hành sẽ được hiển thị tại đây."
              />
            }
          />
          <Route
            path="settings"
            element={
              <AdminPlaceholderPage
                title="Cài đặt"
                description="Các thiết lập hệ thống dành cho admin sẽ được hiển thị tại đây."
              />
            }
          />
        </Route>

        <Route
          path="/admin/services"
          element={
            <ProtectedRoute role="admin">
              <ServiceManagement />
            </ProtectedRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  );


}

export default App;

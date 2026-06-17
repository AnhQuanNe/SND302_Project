import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import VerifyEmailPage from "./pages/VerifyEmailPage";

import CustomerDashboard from "./pages/CustomerPages/Dashboard";
import StaffDashboard from "./pages/StaffPages/Dashboard";

import AdminLayout from "./components/admin/Layout/AdminLayout";
import AdminDashboard from "./pages/AdminPages/Dashboard";
import UserManagement from "./pages/AdminPages/UserManagement";
import ServiceManagement from "./pages/AdminPages/ServiceManagement";
import AdminPlaceholderPage from "./pages/AdminPages/AdminPlaceholderPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public */}
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />

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
        <Route path="/staff/dashboard" element={<StaffDashboard />} />

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
          <Route
            path="queue"
            element={
              <AdminPlaceholderPage
                title="Quản lý Hàng đợi"
                description="Theo dõi, lọc và điều phối hàng đợi sẽ được hiển thị tại đây."
              />
            }
          />
          <Route path="services" element={<ServiceManagement />} />
          <Route
            path="counters"
            element={
              <AdminPlaceholderPage
                title="Quản lý Quầy phục vụ"
                description="Danh sách quầy, trạng thái hoạt động và phân công nhân viên sẽ được hiển thị tại đây."
              />
            }
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

      </Routes>
    </BrowserRouter>
  );

  
}

export default App;

import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import VerifyEmailPage from "./pages/VerifyEmailPage";

import UserManagement from "./pages/AdminPages/UserManagement";
import ServiceManagement from "./pages/AdminPages/ServiceManagement";
import CustomerDashboard from "./pages/CustomerPages/Dashboard";
import GetQueue from "./pages/CustomerPages/GetQueue";

import StaffDashboard from "./pages/StaffPages/Dashboard";

import AdminDashboard from "./pages/AdminPages/Dashboard";

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

        {/* Admin */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute role="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/users"
          element={
            <ProtectedRoute role="admin">
              <UserManagement />
            </ProtectedRoute>
          }
        />

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
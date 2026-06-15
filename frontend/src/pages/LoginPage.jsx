import LoginForm from "../components/auth/LoginForm";
import { Link } from "react-router-dom";

function LoginPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center", // 🔥 THÊM: căn giữa ngang
        background: "linear-gradient(135deg, #f0f9ff, #e0f2fe)", // 🔥 THÊM nền
        fontFamily: "sans-serif",
        padding: "20px"
      }}
    >
      {/* Wrapper */}
      <div
        style={{
          width: "100%",
          maxWidth: "420px", // 🔥 CHUYỂN maxWidth vào đây
        }}
      >
        {/* Logo */}
        <div style={{ marginBottom: "2rem", textAlign: "center" }}>
          <h1
            style={{
              fontSize: "42px",
              fontWeight: 700,
              color: "#1e2937",
              margin: 0,
            }}
          >
            Queue System<span style={{ color: "#378ADD" }}>.</span>
          </h1>

          <p
            style={{
              color: "#64748b",
              marginTop: "8px",
              fontSize: "16px",
            }}
          >
            Hệ thống quản lý hàng chờ thông minh
          </p>
        </div>

        {/* Card */}
        <div
          style={{
            background: "#fff",
            borderRadius: "16px",
            boxShadow: "0 20px 40px rgba(0,0,0,0.1)", // 🔥 đẹp hơn
            padding: "2.5rem",
            border: "1px solid #e5e7eb",
          }}
        >
          {/* Title */}
          <div style={{ textAlign: "center", marginBottom: "2rem" }}>
            <h2
              style={{
                fontSize: "24px",
                fontWeight: 600,
                color: "#1e2937",
                marginBottom: "6px",
              }}
            >
              Xin chào 👋
            </h2>

            <p style={{ color: "#64748b", fontSize: "14px" }}>
              Đăng nhập để tiếp tục
            </p>
          </div>

          {/* Form */}
          <LoginForm />

          {/* Register */}
          <div
            style={{
              textAlign: "center",
              marginTop: "24px",
              fontSize: "14px",
              color: "#64748b",
            }}
          >
            Chưa có tài khoản?{" "}
            <Link
              to="/register"
              style={{
                color: "#378ADD",
                fontWeight: 600,
                textDecoration: "none",
              }}
              onMouseOver={(e) => (e.target.style.textDecoration = "underline")} // 🔥 hover nhẹ
              onMouseOut={(e) => (e.target.style.textDecoration = "none")}
            >
              Đăng ký ngay
            </Link>
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            marginTop: "1.5rem",
            textAlign: "center",
            fontSize: "13px",
            color: "#94a3b8",
          }}
        >
          © 2026 Queue Management System
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
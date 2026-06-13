import LoginForm from "../components/auth/LoginForm";
import { Link } from "react-router-dom";

function LoginPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #f8fafc 0%, #e0f2fe 100%)",
        fontFamily: "sans-serif",
        padding: "20px",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
          maxWidth: "420px",
        }}
      >
        {/* Logo */}
        <div
          style={{
            marginBottom: "2rem",
            textAlign: "center",
          }}
        >
          <h1
            style={{
              fontSize: "42px",
              fontWeight: 700,
              color: "#1e2937",
              margin: 0,
              letterSpacing: "-0.02em",
            }}
          >
            Smart Queue
            <span style={{ color: "#378ADD" }}>.</span>
          </h1>

          <p
            style={{
              color: "#64748b",
              marginTop: "8px",
              fontSize: "18px",
              fontWeight: 500,
            }}
          >
            Queue Management System
          </p>
        </div>

        {/* Card */}
        <div
          style={{
            background: "#fff",
            width: "100%",
            borderRadius: "16px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
            padding: "2.5rem",
            border: "1px solid #e5e7eb",
          }}
        >
          <div
            style={{
              textAlign: "center",
              marginBottom: "2rem",
            }}
          >
            <h2
              style={{
                fontSize: "26px",
                fontWeight: 600,
                color: "#1e2937",
                marginBottom: "8px",
              }}
            >
              Welcome Back
            </h2>

            <p
              style={{
                color: "#64748b",
                fontSize: "15px",
              }}
            >
              Sign in to continue
            </p>
          </div>

          <LoginForm />

          {/* Register */}
          <div
            style={{
              textAlign: "center",
              marginTop: "24px",
              color: "#64748b",
              fontSize: "14px",
            }}
          >
            Chưa có tài khoản?{" "}
            <Link
              to="/register"
              style={{
                color: "#378ADD",
                textDecoration: "none",
                fontWeight: 600,
              }}
            >
              Đăng ký ngay
            </Link>
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            marginTop: "1.5rem",
            color: "#94a3b8",
            fontSize: "13px",
            textAlign: "center",
          }}
        >
          © 2026 Smart Queue System. All rights reserved.
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
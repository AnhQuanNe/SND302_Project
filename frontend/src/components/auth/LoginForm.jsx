import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {FaEye, FaEyeSlash} from "react-icons/fa";
import authService from "../../services/auth.service";

function LoginForm() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await authService.login({ email, password });

      console.log(res);
      if (res.token) {
        localStorage.setItem("token", res.token);
        localStorage.setItem("user", JSON.stringify(res.user));

        const role = res.user?.role;

        if (role === "admin") {
          navigate("/admin/dashboard");
        } else if (role === "staff") {
          navigate("/staff/dashboard");
        } else {
          navigate("/customer");
        }
      } else {
        window.location.href = "/customer";
      }
    } catch (err) {
      console.error("❌ Login Error:", err.response?.data || err);
      setError(
        err.response?.data?.message ||
        "Đăng nhập thất bại. Vui lòng kiểm tra lại email và mật khẩu."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      <div style={{ marginBottom: "1rem" }}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{
            width: "100%",
            padding: "14px 2px",
            border: "1px solid #e2e8f0",
            borderRadius: "8px",
            fontSize: "16px",
            outline: "none",
            transition: "all 0.2s",
          }}
          required
        />
      </div>

      <div style={{ position: "relative" }}>
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Mật khẩu"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{
            width: "100%",
            padding: "14px 2px",
            border: "1px solid #e2e8f0",
            borderRadius: "8px",
            fontSize: "16px",
            outline: "none",
          }}
          required
        />

        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          style={{
            position: "absolute",
            right: "12px",
            top: "50%",
            transform: "translateY(-50%)",
            border: "none",
            background: "transparent",
            cursor: "pointer",
            color: "#64748b",
            fontSize: "18px"
          }}
        >
          {showPassword ? <FaEyeSlash /> : <FaEye />}
        </button>
      </div>

      {error && (
        <div style={{
          color: "#ef4444",
          fontSize: "14px",
          textAlign: "center",
          padding: "8px",
          background: "#fee2e2",
          borderRadius: "6px"
        }}>
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        style={{
          width: "100%",
          background: loading ? "#93c5fd" : "#378ADD",
          color: "white",
          padding: "14px",
          border: "none",
          borderRadius: "8px",
          fontSize: "16px",
          fontWeight: 600,
          cursor: loading ? "not-allowed" : "pointer",
          marginTop: "8px",
          transition: "all 0.2s"
        }}
      >
        {loading ? "Đang đăng nhập..." : "Đăng nhập"}
      </button>

      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px" }}>
        <label style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer" }}>
          <input type="checkbox" style={{ accentColor: "#378ADD" }} />
          <span style={{ color: "#64748b" }}>Ghi nhớ tôi</span>
        </label>
        <a href="#" style={{ color: "#378ADD", textDecoration: "none" }}>
          Quên mật khẩu?
        </a>
      </div>
    </form>
  );
}

export default LoginForm;
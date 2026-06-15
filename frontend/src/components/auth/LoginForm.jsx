import { useState } from "react";
import axios from "axios";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        { email, password }
      );

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      const role = res.data.user.role;

      if (role === "admin") {
        window.location.href = "/admin/dashboard";
      } else if (role === "staff") {
        window.location.href = "/staff/dashboard";
      } else {
        window.location.href = "/customer";
      }
    } catch (error) {
      setError(error.response?.data?.message || "Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.");
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

      <div>
        <input
          type="password"
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
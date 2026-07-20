import { useState } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../../services/auth.service.js";

function ForgotPasswordForm() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleForgotPassword = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      await authService.forgotPassword({ email });

      alert("📧 OTP đã được gửi đến email của bạn.");

      navigate("/reset-password", {
        state: { email },
      });
    } catch (err) {
        console.log(err.response);
        console.log(err.response.data);
        console.log(err.response.status);

      setError(
        err.response?.data?.message ||
          "Không thể gửi mã OTP."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleForgotPassword}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "1.25rem",
      }}
    >
      <div style={{ marginBottom: "1rem" }}>
        <input
          type="email"
          placeholder="Nhập email của bạn"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
        <div
          style={{
            color: "#ef4444",
            fontSize: "14px",
            textAlign: "center",
            padding: "8px",
            background: "#fee2e2",
            borderRadius: "6px",
          }}
        >
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
          transition: "all 0.2s",
        }}
      >
        {loading ? "Đang gửi OTP..." : "Gửi mã OTP"}
      </button>

      <button
        type="button"
        onClick={() => navigate("/")}
        style={{
          background: "transparent",
          border: "none",
          color: "#378ADD",
          cursor: "pointer",
          fontSize: "14px",
        }}
      >
        ← Quay lại đăng nhập
      </button>
    </form>
  );
}

export default ForgotPasswordForm;
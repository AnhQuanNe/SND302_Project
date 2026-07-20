import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import authService from "../../services/auth.service";

function ResetPasswordForm() {
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email || "";

  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async (e) => {
    e.preventDefault();

    setError("");

    if (newPassword !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp.");
      return;
    }

    setLoading(true);

    try {
      await authService.resetPassword({
        email,
        otp,
        password: newPassword,
      });

      alert("🎉 Đổi mật khẩu thành công!");

      navigate("/");
    } catch (err) {
      console.error(err);

      console.log(err.response.data);

      setError(
        err.response?.data?.message ||
          "Không thể đặt lại mật khẩu."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleResetPassword}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "1.25rem",
      }}
    >
      <div>
        <input
          type="email"
          value={email}
          readOnly
          style={{
            width: "100%",
            padding: "14px 2px",
            border: "1px solid #e2e8f0",
            borderRadius: "8px",
            background: "#f8fafc",
            color: "#64748b",
            fontSize: "16px",
          }}
        />
      </div>

      <div>
        <input
          type="text"
          placeholder="Nhập mã OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
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

      <div style={{ position: "relative" }}>
        <input
          type={showNewPassword ? "text" : "password"}
          placeholder="Mật khẩu mới"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
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
          onClick={() =>
            setShowNewPassword(!showNewPassword)
          }
          style={{
            position: "absolute",
            right: "12px",
            top: "50%",
            transform: "translateY(-50%)",
            border: "none",
            background: "transparent",
            cursor: "pointer",
            color: "#64748b",
            fontSize: "18px",
          }}
        >
          {showNewPassword ? (
            <FaEyeSlash />
          ) : (
            <FaEye />
          )}
        </button>
      </div>

      <div style={{ position: "relative" }}>
        <input
          type={showConfirmPassword ? "text" : "password"}
          placeholder="Xác nhận mật khẩu"
          value={confirmPassword}
          onChange={(e) =>
            setConfirmPassword(e.target.value)
          }
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
          onClick={() =>
            setShowConfirmPassword(
              !showConfirmPassword
            )
          }
          style={{
            position: "absolute",
            right: "12px",
            top: "50%",
            transform: "translateY(-50%)",
            border: "none",
            background: "transparent",
            cursor: "pointer",
            color: "#64748b",
            fontSize: "18px",
          }}
        >
          {showConfirmPassword ? (
            <FaEyeSlash />
          ) : (
            <FaEye />
          )}
        </button>
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
          cursor: loading
            ? "not-allowed"
            : "pointer",
          transition: "all 0.2s",
        }}
      >
        {loading
          ? "Đang cập nhật..."
          : "Đặt lại mật khẩu"}
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

export default ResetPasswordForm;
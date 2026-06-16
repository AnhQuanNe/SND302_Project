import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Link, useNavigate, useLocation } from "react-router-dom";
import authService from "../../../../backend/src/services/auth.service";

function VerifyEmailForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const emailFromRegister = location.state?.email;

  const [email] = useState(emailFromRegister || "");
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60); // 60 giây đếm ngược
  const [canResend, setCanResend] = useState(false);

  const inputRefs = useRef([]);

  // Đếm ngược thời gian
  useEffect(() => {
    if (!email) {
      navigate("/register");
      return;
    }

    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [timeLeft, email, navigate]);

  const handleChange = (index, value) => {
    if (isNaN(value)) return;
    const newCode = [...code];
    newCode[index] = value.slice(-1);
    setCode(newCode);

    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);
    if (/^\d+$/.test(pastedData)) {
      const newCode = pastedData.split("").concat(Array(6 - pastedData.length).fill(""));
      setCode(newCode);
    }
  };

    const handleVerify = async (e) => {
    e.preventDefault();
    const verificationCode = code.join("");

    if (verificationCode.length !== 6) {
      setError("Vui lòng nhập đủ 6 số");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      console.log("🔍 Đang verify:", { email, code: verificationCode });

      const res = await authService.verifyEmail({
        email,
        code: verificationCode
      });

      console.log("✅ Verify response:", res);

      // === PHẦN QUAN TRỌNG: Xử lý response ===
      setSuccess(res.message || "Xác thực thành công!");

      if (res.token) {
        localStorage.setItem("token", res.token);
        localStorage.setItem("user", JSON.stringify(res.user || {}));
      }

      // Chuyển trang
      setTimeout(() => {
        const targetPath = res.user?.role === "staff" 
          ? "/staff/dashboard" 
          : "/";
        navigate(targetPath);
      }, 1200);

    } catch (err) {
      console.error("❌ Full Error:", err);
      console.error("❌ Response Data:", err.response?.data);
      
      setError(
        err.response?.data?.message || 
        err.message || 
        "Xác thực thất bại. Vui lòng thử lại."
      );
    } finally {
      setLoading(false);
    }
  };

    const handleResendOTP = async () => {
    if (!canResend) return;

    setResendLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await authService.resendOTP({ email });
      setSuccess(res.message || "Mã OTP mới đã được gửi đến email của bạn!");

      // Reset countdown
      setTimeLeft(60);
      setCanResend(false);

    } catch (err) {
      console.error("❌ Resend OTP Error:", err.response?.data || err);
      setError(
        err.response?.data?.message || 
        "Không thể gửi lại OTP. Vui lòng thử lại sau."
      );
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div
      style={{
        background: "#fff",
        width: "100%",
        maxWidth: "430px",
        padding: "2.5rem",
        borderRadius: "16px",
        boxShadow: "0 10px 30px rgba(0,0,0,.08)",
        border: "1px solid #e5e7eb",
        margin: "auto"
      }}
    >
      <div style={{ textAlign: "center", marginBottom: "2rem" }}>
        <h2 style={{ fontSize: "30px", color: "#1e293b", marginBottom: "8px" }}>
          Verify Email
        </h2>
        <p style={{ color: "#64748b", fontSize: "15px" }}>
          Nhập mã xác thực đã gửi đến<br />
          <strong>{email}</strong>
        </p>
      </div>

      <form onSubmit={handleVerify} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        {/* 6 ô OTP */}
        <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
          {code.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              maxLength="1"
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={handlePaste}
              style={{
                width: "52px",
                height: "58px",
                textAlign: "center",
                fontSize: "24px",
                fontWeight: "600",
                border: "2px solid #e2e8f0",
                borderRadius: "10px",
                outline: "none",
                transition: "all 0.2s",
              }}
              onFocus={(e) => e.target.select()}
            />
          ))}
        </div>

        {error && (
          <div style={{ color: "#dc2626", background: "#fee2e2", padding: "12px", borderRadius: "8px", textAlign: "center" }}>
            {error}
          </div>
        )}
        {success && (
          <div style={{ color: "#166534", background: "#dcfce7", padding: "12px", borderRadius: "8px", textAlign: "center" }}>
            {success}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          style={{
            background: "#378ADD",
            color: "white",
            padding: "14px",
            border: "none",
            borderRadius: "8px",
            fontSize: "16px",
            fontWeight: "600",
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Đang xác thực..." : "Xác thực Email"}
        </button>
      </form>

      <div style={{ marginTop: "20px", textAlign: "center" }}>
        <button
          onClick={handleResendOTP}
          disabled={!canResend || resendLoading}
          style={{
            background: "transparent",
            border: "none",
            color: canResend ? "#378ADD" : "#94a3b8",
            cursor: canResend ? "pointer" : "not-allowed",
            fontWeight: "600",
            fontSize: "15px",
          }}
        >
          {resendLoading 
            ? "Đang gửi..." 
            : canResend 
              ? "Gửi lại mã OTP" 
              : `Gửi lại sau ${timeLeft}s`}
        </button>
      </div>

      <div style={{ marginTop: "20px", textAlign: "center", fontSize: "14px" }}>
        Quay lại{" "}
        <Link
          to="/register"
          style={{ color: "#378ADD", textDecoration: "none", fontWeight: "600" }}
        >
          Đăng ký
        </Link>
      </div>
    </div>
  );
}

export default VerifyEmailForm;
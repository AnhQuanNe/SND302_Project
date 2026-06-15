import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

function VerifyEmailForm() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [code, setCode] = useState("");

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);
    const [resendLoading, setResendLoading] = useState(false);

    const handleVerify = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/verify-email",
        {
          email,
          code,
        }
      );

      setSuccess(res.data.message);

      setTimeout(() => {
        navigate("/");
      }, 1500);

    } catch (error) {
      setError(
        error.response?.data?.message ||
        "Verification failed"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setResendLoading(true);
    setError("");
    setSuccess("");

    try {

      const res = await axios.post(
        "http://localhost:5000/api/auth/resend-otp",
        {
          email,
        }
      );

      setSuccess(res.data.message);

    } catch (error) {

      setError(
        error.response?.data?.message ||
        "Cannot resend OTP"
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
        border: "1px solid #e5e7eb"
      }}
    >
      <div style={{ textAlign: "center", marginBottom: "2rem" }}>
        <h2
          style={{
            fontSize: "30px",
            color: "#1e293b",
            marginBottom: "8px"
          }}
        >
          Verify Email
        </h2>

        <p
          style={{
            color: "#64748b",
            fontSize: "15px"
          }}
        >
          Enter the verification code sent to your email
        </p>
      </div>

      <form
        onSubmit={handleVerify}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1rem"
        }}
      >
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{
            padding: "14px 16px",
            border: "1px solid #e2e8f0",
            borderRadius: "8px",
            fontSize: "16px"
          }}
          required
        />

        <input
          type="text"
          placeholder="Verification Code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          style={{
            padding: "14px 16px",
            border: "1px solid #e2e8f0",
            borderRadius: "8px",
            fontSize: "16px"
          }}
          required
        />

        {error && (
          <div
            style={{
              color: "#dc2626",
              background: "#fee2e2",
              padding: "10px",
              borderRadius: "8px",
              textAlign: "center"
            }}
          >
            {error}
          </div>
        )}

        {success && (
          <div
            style={{
              color: "#166534",
              background: "#dcfce7",
              padding: "10px",
              borderRadius: "8px",
              textAlign: "center"
            }}
          >
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
            cursor: "pointer"
          }}
        >
          {loading ? "Verifying..." : "Verify Email"}
        </button>
      </form>

      <div
        style={{
          marginTop: "20px",
          textAlign: "center"
        }}
      >
        <button
          onClick={handleResendOTP}
          disabled={resendLoading}
          style={{
            background: "transparent",
            border: "none",
            color: "#378ADD",
            cursor: "pointer",
            fontWeight: "600"
          }}
        >
          {resendLoading
            ? "Sending..."
            : "Resend OTP"}
        </button>
      </div>

      <div
        style={{
          marginTop: "20px",
          textAlign: "center",
          fontSize: "14px"
        }}
      >
        Back to{" "}
        <Link
          to="/"
          style={{
            color: "#378ADD",
            textDecoration: "none",
            fontWeight: "600"
          }}
        >
          Login
        </Link>
      </div>
    </div>
  );
};

export default VerifyEmailForm;
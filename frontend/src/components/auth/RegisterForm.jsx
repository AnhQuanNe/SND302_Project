import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash }   from "react-icons/fa";
import authService from "../../services/auth.service";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function RegisterForm() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    gender: "",
    dob: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      await register({
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        gender: formData.gender,
        dob: formData.dob,
      });

      alert("Verification code has been sent to your email");

      navigate("/verify-email", {
        state: { email: formData.email }
      });
    } catch (error) {
      setError(
        error.response?.data?.message ||
        "Register failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
        }}
      >
        <input
          type="text"
          name="fullName"
          placeholder="Full Name"
          value={formData.fullName}
          onChange={handleChange}
          required
          style={{
            width: "100%",
            padding: "14px 16px",
            border: "1px solid #e2e8f0",
            borderRadius: "8px",
            fontSize: "16px",
            outline: "none",
          }}
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
          style={{
            width: "100%",
            padding: "14px 16px",
            border: "1px solid #e2e8f0",
            borderRadius: "8px",
            fontSize: "16px",
            outline: "none",
          }}
        />

        <input
          type="text"
          name="phone"
          placeholder="Phone Number"
          value={formData.phone}
          onChange={handleChange}
          required
          style={{
            width: "100%",
            padding: "14px 16px",
            border: "1px solid #e2e8f0",
            borderRadius: "8px",
            fontSize: "16px",
            outline: "none",
          }}
        />

        <select
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          required
          style={{
            width: "100%",
            padding: "14px 16px",
            border: "1px solid #e2e8f0",
            borderRadius: "8px",
            fontSize: "16px",
            outline: "none",
          }}
        >
          <option value="">Chọn giới tính</option>
          <option value="Nam">Nam</option>
          <option value="Nữ">Nữ</option>
          <option value="Khác">Khác</option>
        </select>

        <input
          type="date"
          name="dob"
          placeholder="Date of Birth"
          value={formData.dob}
          onChange={handleChange}
          required
          style={{
            width: "100%",
            padding: "14px 16px",
            border: "1px solid #e2e8f0",
            borderRadius: "8px",
            fontSize: "16px",
            outline: "none",
          }}
        />

        <div style={{ position: "relative", width: "100%" }}>
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            style={{
              width: "100%",
              padding: "14px 16px",
              border: "1px solid #e2e8f0",
              borderRadius: "8px",
              fontSize: "16px",
              outline: "none",
            }}
          />

          <span
            onClick={() => setShowPassword(!showPassword)}
            style={{
              position: "absolute",
              right: "15px",
              top: "50%",
              transform: "translateY(-50%)",
              cursor: "pointer",
              color: "#64748b",
              userSelect: "none",
            }}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        <div style={{ position: "relative" }}>
          <input
            type={showConfirmPassword ? "text" : "password"}
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            style={{
              width: "100%",
              padding: "14px 16px",
              paddingRight: "45px",
              border: "1px solid #e2e8f0",
              borderRadius: "8px",
              fontSize: "16px",
              outline: "none",
            }}
          />

          <span
            onClick={() =>
              setShowConfirmPassword(!showConfirmPassword)
            }
            style={{
              position: "absolute",
              right: "15px",
              top: "50%",
              transform: "translateY(-50%)",
              cursor: "pointer",
              color: "#64748b",
              userSelect: "none",
            }}
          >
            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
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
            marginTop: "8px",
            transition: "all 0.2s",
          }}
        >
          {loading ? "Creating account..." : "Register"}
        </button>
      </form>

      <div
        style={{
          textAlign: "center",
          marginTop: "20px",
          fontSize: "14px",
          color: "#64748b",
        }}
      >
        Already have an account?{" "}
        <Link
          to="/"
          style={{
            color: "#378ADD",
            fontWeight: 600,
            textDecoration: "none",
          }}
        >
          Login
        </Link>
      </div>
    </>
  );
}

export default RegisterForm;
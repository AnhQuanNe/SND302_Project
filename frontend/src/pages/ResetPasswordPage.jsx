import ResetPasswordForm from "../components/auth/ResetPasswordForm";

function ResetPasswordPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f8fafc",
        padding: "20px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "450px",
          background: "#fff",
          padding: "40px",
          borderRadius: "14px",
          boxShadow: "0 15px 35px rgba(0,0,0,.08)",
        }}
      >
        <h2
          style={{
            textAlign: "center",
            marginBottom: "10px",
            color: "#1e293b",
          }}
        >
          Đặt lại mật khẩu
        </h2>

        <p
          style={{
            textAlign: "center",
            color: "#64748b",
            marginBottom: "30px",
          }}
        >
          Nhập OTP cùng mật khẩu mới.
        </p>

        <ResetPasswordForm />
      </div>
    </div>
  );
}

export default ResetPasswordPage;
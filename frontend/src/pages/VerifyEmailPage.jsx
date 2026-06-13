import VerifyEmailForm from "../components/auth/VerifyEmailForm";

function VerifyEmailPage() {
  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      background: "linear-gradient(135deg, #f8fafc 0%, #e0f2fe 100%)"
    }}>
      <VerifyEmailForm />
    </div>
  );
}

export default VerifyEmailPage;
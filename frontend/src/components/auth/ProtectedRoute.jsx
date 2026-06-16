// import { Navigate } from "react-router-dom";

// export default function ProtectedRoute({
//   children,
// }) {
//   const token =
//     localStorage.getItem("token");

//   return token
//     ? children
//     : <Navigate to="/login" />;
// }
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, role }) {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  // chưa login
  if (!token) {
    return <Navigate to="/" />;
  }

  // sai role
  if (role && user?.role !== role) {
    return <Navigate to="/" />;
  }

  return children;
}
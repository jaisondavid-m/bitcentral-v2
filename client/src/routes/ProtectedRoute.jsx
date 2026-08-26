import { Navigate } from "react-router-dom";
import { logout } from "../Authentication/firebase.js";
import { isAllowedEmail } from "../Authentication/authRules.js";
import { useAuth } from "../context/StudentContext.jsx";
import FullScreenLoader from "../Component/FullScreenLoader.jsx";

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (user && !isAllowedEmail(user.email)) {
    logout();
    return <Navigate to="/login" replace state={{ error: "unauthorized" }} />;
  }

  if (loading) {
    return <FullScreenLoader />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;
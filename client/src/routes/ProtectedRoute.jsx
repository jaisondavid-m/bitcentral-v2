import { Navigate } from "react-router-dom";
import { logout } from "@/config/auth.js";
import { isAllowedEmail } from "@/services/authRules.js";
import { useAuth } from "@/context/StudentContext.jsx";
import FullScreenLoader from "@/components/common/FullScreenLoader.jsx";

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <FullScreenLoader />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user?.email && !isAllowedEmail(user.email)) {
    logout();
    return <Navigate to="/login" replace state={{ error: "unauthorized" }} />;
  }

  return children;
}

export default ProtectedRoute;
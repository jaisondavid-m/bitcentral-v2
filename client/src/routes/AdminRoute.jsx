import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/StudentContext.jsx";
import FullScreenLoader from "@/components/common/FullScreenLoader.jsx";

function AdminRoute({ children }) {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return <FullScreenLoader />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const role = (user?.role || profile?.role || "").toLowerCase().trim();
  const isAdmin =
    role === "admin" ||
    role === "superadmin" ||
    role === "super_admin" ||
    user?.isAdmin === true;

  if (!isAdmin) {
    return <Navigate to="/home" replace />;
  }

  return children;
}

export default AdminRoute;
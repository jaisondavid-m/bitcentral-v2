import { Navigate } from "react-router-dom";
import { useAuth } from "../context/StudentContext.jsx";
import FullScreenLoader from "../Component/FullScreenLoader.jsx";

const ADMIN_UID = import.meta.env.VITE_ADMIN_FIREBASE_UID?.trim();

function AdminRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <FullScreenLoader />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!ADMIN_UID || user.uid !== ADMIN_UID) {
    return <Navigate to="/home" replace />;
  }

  return children;
}

export default AdminRoute;
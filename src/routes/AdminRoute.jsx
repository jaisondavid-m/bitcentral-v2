import { Navigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";

import { auth } from "../Authentication/firebase.js";

const ADMIN_UID = import.meta.env.VITE_ADMIN_FIREBASE_UID?.trim();

function AdminRoute({ children }) {
  const [user, loading] = useAuthState(auth);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent" />
          <p className="mt-2 text-sm text-gray-500">Checking admin access...</p>
        </div>
      </div>
    );
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
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, logout } from "../Authentication/firebase.js";

function ProtectedRoute({ children }) {
  const [user, loading] = useAuthState(auth);
  const [shouldRedirect, setShouldRedirect] = useState(false);

  useEffect(() => {
    if (user && !user.email?.endsWith("@bitsathy.ac.in")) {
      logout();
      setShouldRedirect(true);
    }
  }, [user]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
          <p className="mt-2 text-sm text-gray-500">Checking authentication...</p>
        </div>
      </div>
    );
  }

  if (!user || shouldRedirect) {
    return <Navigate to="/login" replace state={{ error: shouldRedirect ? "unauthorized" : null }} />;
  }

  return children;
}

export default ProtectedRoute;
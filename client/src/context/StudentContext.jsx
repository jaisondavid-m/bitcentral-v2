import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { auth, logout, getStoredToken, getCurrentUser } from "@/config/auth.js";
import { getMeProfile } from "@/api/axios.js";
import {
  clearGuestSession,
  createGuestStudent,
  createGuestUser,
  readGuestSession,
  subscribeToGuestSessionChanges,
} from "@/services/guestSession.js";

const AuthContext = createContext();

const departmentMap = {
  cs: "Computer Science and Engineering",
  ad: "Artificial Intelligence & Data Science",
  al: "Artificial Intelligence & Machine Learning",
  ec: "Electronics and Communication Engineering",
  ee: "Electrical and Electronics Engineering",
  ct: "Computer Technology",
  bt: "Biotechnology",
  cb: "Computer Science and Business Systems",
  mz: "Mechatronics",
  it: "Information Technology",
};

const decodeCollegeEmail = (email) => {
  if (!email || !email.endsWith("@bitsathy.ac.in")) return null;

  const usernamePart = email.split("@")[0];
  const parts = usernamePart.split(".");          
  if (parts.length < 2) return null;

  const deptYear = parts[1];                        
  const deptCode = deptYear.slice(0, 2);           
  const yearCode = deptYear.slice(2);              

  const department = departmentMap[deptCode] || "Unknown Department";
  const startYear = 2000 + Number(yearCode);
  const endYear = startYear + 4;

  return {
    email,
    usernamePart,
    deptYear,
    yearCode,
    deptCode,
    department,
    startYear,
    endYear,
    batch: `${startYear} - ${endYear}`,
  };
};

const toProfileStudent = (studentProfile, fallbackStudent = null) => {
  if (!studentProfile) {
    return fallbackStudent;
  }

  const profileData = studentProfile.data || studentProfile;

  return {
    ...fallbackStudent,
    user_id: profileData.user_id || studentProfile.user_id || fallbackStudent?.user_id || "",
    email: studentProfile.email || fallbackStudent?.email || null,
    rollNo: studentProfile.roll_no || fallbackStudent?.rollNo || "",
    roll_no: studentProfile.roll_no || fallbackStudent?.roll_no || "",
    uid: studentProfile.uid || fallbackStudent?.uid || null,
    displayName: studentProfile.display_name || fallbackStudent?.displayName || null,
    photoURL: studentProfile.photo_url || fallbackStudent?.photoURL || null,
    creationTime: studentProfile.creation_time || fallbackStudent?.creationTime || null,
    lastSignInTime: studentProfile.last_sign_in_time || fallbackStudent?.lastSignInTime || null,
    lastSeenAt: studentProfile.last_seen_at || fallbackStudent?.lastSeenAt || null,
    phone: profileData.phone || profileData.phone_no || fallbackStudent?.phone || "",
    phone_no: profileData.phone_no || profileData.phone || fallbackStudent?.phone_no || "",
  };
};

function getPresenceRouteLabel(pathname = "") {
  const path = pathname.toLowerCase();

  if (!path || path === "/" || path === "/home") return "Home";
  if (path.startsWith("/dashboard") || path.startsWith("/profile")) return "Dashboard";
  if (path.startsWith("/semester")) return "Semester";
  if (path.startsWith("/mess")) return "Mess Menu";
  if (path.startsWith("/exam-hall")) return "Exam Hall";
  if (path.startsWith("/pcdp")) return "PCDP";
  if (path.startsWith("/rpsite")) return "RP Site";
  if (path.startsWith("/leavedetails")) return "Leave Details";
  if (path.startsWith("/privacy-policy")) return "Privacy Policy";
  if (path.startsWith("/terms")) return "Terms";
  if (path.startsWith("/login")) return "Login";
  if (path.startsWith("/admin")) return "Admin";

  return "Other";
}

export const StudentContext = ({ children }) => {
  const location = useLocation();
  const initialGuestSession = readGuestSession();
  const initialToken = getStoredToken();
  const initialUser = initialGuestSession
    ? createGuestUser(initialGuestSession)
    : initialToken
    ? getCurrentUser()
    : null;

  const [user, setUser] = useState(initialUser);
  const [student, setStudent] = useState(initialGuestSession ? createGuestStudent() : null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(Boolean(initialGuestSession || initialToken));
  const [accessDeniedMessage, setAccessDeniedMessage] = useState("");
  const currentRouteLabel = useMemo(() => getPresenceRouteLabel(location.pathname), [location.pathname]);
  const hydratedEmailRef = useRef("");

  const hydrateAuthenticatedUser = async (currentUser) => {
    if (!currentUser?.email) {
      setStudent(null);
      setProfile(null);
      hydratedEmailRef.current = "";
      return;
    }

    if (hydratedEmailRef.current === currentUser.email) {
      return;
    }

    hydratedEmailRef.current = currentUser.email;
  setAccessDeniedMessage("");

    clearGuestSession();
    const decoded = decodeCollegeEmail(currentUser.email);
    setStudent(decoded);

    try {
      const backendProfile = await getMeProfile();
      if (backendProfile?.email) {
        setProfile(backendProfile);
        setStudent((prev) => toProfileStudent(backendProfile, decoded || prev));
        const userRole = (backendProfile.role || "").toLowerCase().trim();
        setUser((prev) => ({
          ...prev,
          role: userRole || "user",
          isAdmin: userRole === "admin" || userRole === "superadmin" || userRole === "super_admin",
        }));
      } else {
        setProfile(null);
      }
    } catch (error) {
      const status = error?.response?.status;
      const message = error?.response?.data?.message || error?.message || "Failed to load profile from /me";
      if (status === 403 || error?.response?.data?.status === "blocked") {
        setAccessDeniedMessage(message);
        setUser(null);
        setStudent(null);
        setProfile(null);
        hydratedEmailRef.current = "";
        logout().catch(() => {});
        return;
      }
      setProfile(null);
      console.error("Failed to load profile from /me", error);
    }
  };

  useEffect(() => {
    let cancelled = false;

    const checkAuthState = async () => {
      const guestSession = readGuestSession();

      if (guestSession) {
        setUser(createGuestUser(guestSession));
        setStudent(createGuestStudent());
        setProfile(null);
        hydratedEmailRef.current = "";
        setLoading(false);
        return;
      }

      const currentUser = auth.currentUser;
      setUser(currentUser);

      if (currentUser?.email || currentUser?.token) {
        setLoading(true);
        try {
          const backendProfile = await getMeProfile();
          if (backendProfile?.email && !cancelled) {
            const userRole = (backendProfile.role || "").toLowerCase().trim();
            setUser((prev) => ({
              ...prev,
              uid: backendProfile.uid || prev?.uid,
              email: backendProfile.email,
              displayName: backendProfile.display_name || prev?.displayName,
              photoURL: backendProfile.photo_url || prev?.photoURL,
              role: userRole || "user",
              isAdmin: userRole === "admin" || userRole === "superadmin" || userRole === "super_admin",
            }));
            setProfile(backendProfile);
            const decoded = decodeCollegeEmail(backendProfile.email);
            setStudent(toProfileStudent(backendProfile, decoded));
            hydratedEmailRef.current = backendProfile.email;
          } else if (currentUser?.email && !cancelled) {
            const decoded = decodeCollegeEmail(currentUser.email);
            setStudent(decoded);
          }
        } catch (err) {
          const status = err?.response?.status;
          const message = err?.response?.data?.message || err?.message || "Failed to load profile from /me";
          if (status === 403 || err?.response?.data?.status === "blocked") {
            setAccessDeniedMessage(message);
            setUser(null);
            setStudent(null);
            setProfile(null);
            hydratedEmailRef.current = "";
            logout().catch(() => {});
          } else if (currentUser?.email && !cancelled) {
            const decoded = decodeCollegeEmail(currentUser.email);
            setStudent(decoded);
          }
        } finally {
          if (!cancelled) {
            setLoading(false);
          }
        }
      } else {
        setStudent(null);
        setProfile(null);
        hydratedEmailRef.current = "";
        setLoading(false);
      }
    };

    checkAuthState();

    const handleAuthChange = () => {
      checkAuthState();
    };

    window.addEventListener("auth_state_changed", handleAuthChange);
    window.addEventListener("storage", handleAuthChange);

    const unsubscribeGuest = subscribeToGuestSessionChanges(() => {
      checkAuthState();
    });

    const checkGuestExpiration = () => {
      readGuestSession();
    };

    const intervalId = setInterval(checkGuestExpiration, 60000);
    window.addEventListener("focus", checkGuestExpiration);

    return () => {
      cancelled = true;
      window.removeEventListener("auth_state_changed", handleAuthChange);
      window.removeEventListener("storage", handleAuthChange);
      unsubscribeGuest();
      clearInterval(intervalId);
      window.removeEventListener("focus", checkGuestExpiration);
    };
  }, []);



  return (
    <AuthContext.Provider value={{ user, student, profile, loading, accessDeniedMessage, setAccessDeniedMessage }}>
      {children}
    </AuthContext.Provider>
  );
};

const defaultAuthContext = {
  user: null,
  student: null,
  profile: null,
  loading: false,
  accessDeniedMessage: "",
  setAccessDeniedMessage: () => {},
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  return context || {
    ...defaultAuthContext,
    user: getCurrentUser(),
  };
};
export { decodeCollegeEmail };
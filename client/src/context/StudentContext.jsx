import { createContext, useContext, useEffect, useRef, useState } from "react";
import { auth, logout, getStoredToken, getCurrentUser } from "@/config/auth.js";
import { getMeProfile } from "@/api/axios.js";

const AuthContext = createContext();

const departmentMap = {
  cs: "Computer Science and Engineering",
  ad: "Artificial Intelligence & Data Science",
  al: "Artificial Intelligence & Machine Learning",
  ec: "Electronics and Communication Engineering",
  ee: "Electrical and Electronics Engineering",
  ei: "Electronics and Instrumentation Engineering",
  ct: "Computer Technology",
  bt: "Biotechnology",
  cb: "Computer Science and Business Systems",
  mz: "Mechatronics",
  it: "Information Technology",
  me: "Mechanical Engineering",
  ce: "Civil Engineering",
  bm: "Biomedical Engineering",
  ae: "Aeronautical Engineering",
  ag: "Agricultural Engineering",
  ft: "Fashion Technology",
  tx: "Textile Technology",
  fd: "Food Technology",
  cd: "Computer Design",
  se: "Information Science and Engineering",
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

  // Use student_details department if present; otherwise fallback to decoded email
  const department =
    profileData.dept_name ||
    profileData.department ||
    fallbackStudent?.department ||
    "";

  // Use student_details batch_name if present; otherwise fallback to decoded email
  const batch =
    profileData.batch_name ||
    profileData.batch ||
    fallbackStudent?.batch ||
    "";

  const studentName =
    profileData.student_name ||
    profileData.name ||
    profileData.display_name ||
    fallbackStudent?.displayName ||
    fallbackStudent?.usernamePart ||
    "";

  const phoneNo = profileData.phone_no || profileData.phone || fallbackStudent?.phone || "";

  return {
    ...fallbackStudent,
    user_id: profileData.user_id || profileData.roll_no || fallbackStudent?.user_id || "",
    email: profileData.email || studentProfile.email || fallbackStudent?.email || null,
    rollNo: profileData.roll_no || profileData.user_id || fallbackStudent?.rollNo || "",
    roll_no: profileData.roll_no || profileData.user_id || fallbackStudent?.roll_no || "",
    register_no: profileData.register_no || fallbackStudent?.register_no || "",
    uid: profileData.uid || studentProfile.uid || fallbackStudent?.uid || null,
    displayName: studentName || fallbackStudent?.displayName || null,
    name: studentName,
    photoURL: profileData.photo_url || studentProfile.photo_url || fallbackStudent?.photoURL || null,
    creationTime: profileData.creation_time || studentProfile.creation_time || fallbackStudent?.creationTime || null,
    lastSignInTime: profileData.last_sign_in_time || studentProfile.last_sign_in_time || fallbackStudent?.lastSignInTime || null,
    lastSeenAt: profileData.last_seen_at || studentProfile.last_seen_at || fallbackStudent?.lastSeenAt || null,
    phone: phoneNo,
    phone_no: phoneNo,
    parent_mobile: profileData.parent_mobile || fallbackStudent?.parent_mobile || "",
    dept: profileData.dept || fallbackStudent?.dept || 0,
    dept_name: department,
    department: department,
    dept_short_name: profileData.dept_short_name || fallbackStudent?.deptCode?.toUpperCase() || "",
    gender: profileData.gender || fallbackStudent?.gender || "",
    resident: profileData.resident || fallbackStudent?.resident || "",
    batch_name: batch,
    batch: batch,
    year: profileData.year || fallbackStudent?.year || "",
  };
};

export const StudentContext = ({ children }) => {
  const initialUser = getCurrentUser();
  const [user, setUser] = useState(initialUser);
  const [student, setStudent] = useState(() => (initialUser?.email ? decodeCollegeEmail(initialUser.email) : null));
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(Boolean(initialUser));
  const [accessDeniedMessage, setAccessDeniedMessage] = useState("");
  const hydratedEmailRef = useRef("");

  useEffect(() => {
    let cancelled = false;

    const checkAuthState = async () => {
      setLoading(true);
      try {
        const backendProfile = await getMeProfile();
        if (backendProfile?.email && !cancelled) {
          const userRole = (backendProfile.role || "").toLowerCase().trim();
          const isAdmin = Boolean(
            backendProfile.is_admin ||
            userRole === "admin" ||
            userRole === "superadmin" ||
            userRole === "super_admin"
          );
          const isSuper = isAdmin;
          const effectiveRole = isAdmin ? "admin" : (userRole || "user");
          setUser({
            uid: backendProfile.uid || backendProfile.google_id || backendProfile.email,
            email: backendProfile.email,
            displayName: backendProfile.display_name || backendProfile.name || backendProfile.email.split("@")[0],
            photoURL: backendProfile.photo_url || null,
            role: effectiveRole,
            isAdmin,
            isSuper,
            getIdToken: async () => getStoredToken() || "",
          });
          setProfile(backendProfile);
          const decoded = decodeCollegeEmail(backendProfile.email);
          setStudent(toProfileStudent(backendProfile, decoded));
          hydratedEmailRef.current = backendProfile.email;
        } else if (!cancelled) {
          setUser(null);
          setStudent(null);
          setProfile(null);
          hydratedEmailRef.current = "";
        }
      } catch (err) {
        if (cancelled) return;
        const status = err?.response?.status;
        const message = err?.response?.data?.message || err?.message || "Failed to load profile from /me";
        if (status === 403 || err?.response?.data?.status === "blocked") {
          setAccessDeniedMessage(message);
          setUser(null);
          setStudent(null);
          setProfile(null);
          hydratedEmailRef.current = "";
          logout().catch(() => {});
        } else {
          setUser(null);
          setStudent(null);
          setProfile(null);
          hydratedEmailRef.current = "";
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    checkAuthState();

    const handleAuthChange = () => {
      checkAuthState();
    };

    window.addEventListener("auth_state_changed", handleAuthChange);

    return () => {
      cancelled = true;
      window.removeEventListener("auth_state_changed", handleAuthChange);
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
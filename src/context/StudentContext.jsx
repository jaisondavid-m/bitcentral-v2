import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../Authentication/firebase";
import { onAuthStateChanged } from "firebase/auth";

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

export const StudentContext = ({ children }) => {
  const [user, setUser] = useState(null);
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);

      if (currentUser?.email) {
        const decoded = decodeCollegeEmail(currentUser.email);
        setStudent(decoded);
      } else {
        setStudent(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, student, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
export { decodeCollegeEmail };
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "first-auth-app-project.firebaseapp.com",
  projectId: "first-auth-app-project",
  storageBucket: "first-auth-app-project.firebasestorage.app",
  messagingSenderId: "956639761791",
  appId: "1:956639761791:web:b453f88c306ba35cba364a",
  measurementId: "G-T3C10RN98R"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth
export const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export const db = getFirestore(app);

// Google Sign-in function with email validation
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    
    // Check if email ends with @bitsathy.ac.in
    if (!user.email?.endsWith("@bitsathy.ac.in")) {
      await signOut(auth);
      throw new Error("Unauthorized email domain");
    }
    
    return result;
  } catch (error) {
    // Re-throw the error to be handled by the component
    throw error;
  }
};

// Logout function
export const logout = () => signOut(auth);
// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey:import.meta.env.VITE_FIREBASE_API_KEY,
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

// Google Sign-in function
export const signInWithGoogle = () => signInWithPopup(auth, provider);

// Logout function
export const logout = () => signOut(auth);
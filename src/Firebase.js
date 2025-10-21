// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyB9CTxOfWcNH5xMNvCXet09tikHFI21C0Q",
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

// Google Sign-in function
export const signInWithGoogle = () => signInWithPopup(auth, provider);

// Logout function
export const logout = () => signOut(auth);
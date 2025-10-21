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

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export const signInWithGoogle = () => signInWithPopup(auth, provider);

export const logout = () => signOut(auth);
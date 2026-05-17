import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { isAllowedEmail } from "./authRules.js";
import { clearGuestSession } from "./guestSession.js";

// Read and sanitize the API key from Vite env variables
const rawApiKey = import.meta.env.VITE_FIREBASE_API_KEY;
const apiKey = rawApiKey ? String(rawApiKey).replace(/^"|"$/g, '').trim() : '';

const firebaseConfig = {
  apiKey,
  authDomain: 'first-auth-app-project.firebaseapp.com',
  projectId: 'first-auth-app-project',
  storageBucket: 'first-auth-app-project.firebasestorage.app',
  messagingSenderId: '956639761791',
  appId: '1:956639761791:web:b453f88c306ba35cba364a',
  measurementId: 'G-T3C10RN98R',
};

if (!apiKey) {
  console.error('Firebase API key is missing or empty. Check .env and restart the dev server.');
}

// Initialize Firebase
let app;
try {
  app = initializeApp(firebaseConfig);
} catch (e) {
  console.error('Failed to initialize Firebase:', e);
  throw e;
}

// Initialize Auth
export const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export const db = getFirestore(app);

// Google Sign-in function with email validation
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    
    // Ensure only allowed accounts can keep the signed-in session.
    if (!isAllowedEmail(user.email)) {
      await signOut(auth);
      throw new Error("Unauthorized email domain");
    }

    clearGuestSession();
    
    return result;
  } catch (error) {
    // Re-throw the error to be handled by the component
    throw error;
  }
};

// Logout function
export const logout = async () => {
  clearGuestSession();
  return signOut(auth);
};

import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBhvS5R9k4s1zNQ7WlWw_3YwzYf-YNwmhk",
  authDomain: "farmmart-16f6b.firebaseapp.com",
  projectId: "farmmart-16f6b",
  storageBucket: "farmmart-16f6b.firebasestorage.app",
  messagingSenderId: "609685885474",
  appId: "1:609685885474:web:c7cbe35c10e245536c307b",
};

// Only initialize Firebase on the client side.
// getAuth/getFirestore/getStorage all trigger Firebase internals
// that fail during Next.js server-side prerender.
const app =
  typeof window !== "undefined"
    ? getApps().length === 0
      ? initializeApp(firebaseConfig)
      : getApp()
    : null;

export const auth = app ? getAuth(app) : null;
export const db = app ? getFirestore(app) : null;
export const storage = app ? getStorage(app) : null;

const googleProvider = app ? new GoogleAuthProvider() : null;

export const loginWithGoogle = async () => {
  if (typeof window === "undefined" || !auth || !googleProvider) return null;
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error("Firebase Google Sign-In Error:", error);
    throw error;
  }
};

export const logoutFromFirebase = async () => {
  if (typeof window === "undefined" || !auth) return;
  await signOut(auth);
};
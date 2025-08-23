"use client";

import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  signInWithPopup,
  GoogleAuthProvider,
  GithubAuthProvider,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  updateProfile,
  User,
  UserCredential,
  onAuthStateChanged,
} from "firebase/auth";
import { auth } from "./auth";
import { useState, useEffect } from "react";

// Auth providers
export const googleProvider = new GoogleAuthProvider();
export const githubProvider = new GithubAuthProvider();

// Auth functions
export const authFunctions = {
  // Email/Password Authentication
  signInWithEmail: async (email: string, password: string): Promise<UserCredential> => {
    return signInWithEmailAndPassword(auth, email, password);
  },

  signUpWithEmail: async (email: string, password: string, displayName?: string): Promise<UserCredential> => {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    if (displayName && result.user) {
      await updateProfile(result.user, { displayName });
    }
    return result;
  },

  // Social Authentication
  signInWithGoogle: async (): Promise<UserCredential> => {
    return signInWithPopup(auth, googleProvider);
  },

  signInWithGithub: async (): Promise<UserCredential> => {
    return signInWithPopup(auth, githubProvider);
  },

  // Phone Authentication
  signInWithPhone: async (phoneNumber: string, recaptchaVerifier: RecaptchaVerifier) => {
    return signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
  },

  // Sign Out
  signOut: async (): Promise<void> => {
    return firebaseSignOut(auth);
  },
};

// Custom hook for auth state
export const useFirebaseAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth,
      (user) => {
        setUser(user);
        setLoading(false);
        setError(null);
      },
      (error) => {
        setError(error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  return {
    user,
    loading,
    error,
    isAuthenticated: !!user,
  };
};

// Export auth instance
export { auth };

// Types
export type FirebaseUser = User;
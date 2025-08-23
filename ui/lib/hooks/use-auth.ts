"use client";

import { useState } from "react";
import { useFirebaseAuth, authFunctions } from "@/lib/auth-client";
import { RecaptchaVerifier } from "firebase/auth";
import type { FirebaseUser } from "@/lib/auth-client";

export function useAuth() {
  const { user, loading, error, isAuthenticated } = useFirebaseAuth();
  const [isLoading, setIsLoading] = useState(false);

  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const result = await authFunctions.signInWithEmail(email, password);
      return { data: result, error: null };
    } catch (error: any) {
      return { data: null, error: { message: error.message } };
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    setIsLoading(true);
    try {
      const result = await authFunctions.signUpWithEmail(email, password, name);
      return { data: result, error: null };
    } catch (error: any) {
      return { data: null, error: { message: error.message } };
    } finally {
      setIsLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    setIsLoading(true);
    try {
      const result = await authFunctions.signInWithGoogle();
      return { data: result, error: null };
    } catch (error: any) {
      return { data: null, error: { message: error.message } };
    } finally {
      setIsLoading(false);
    }
  };

  const signInWithGithub = async () => {
    setIsLoading(true);
    try {
      const result = await authFunctions.signInWithGithub();
      return { data: result, error: null };
    } catch (error: any) {
      return { data: null, error: { message: error.message } };
    } finally {
      setIsLoading(false);
    }
  };

  const signInWithPhone = async (phoneNumber: string, recaptchaVerifier: RecaptchaVerifier) => {
    setIsLoading(true);
    try {
      const result = await authFunctions.signInWithPhone(phoneNumber, recaptchaVerifier);
      return { data: result, error: null };
    } catch (error: any) {
      return { data: null, error: { message: error.message } };
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    setIsLoading(true);
    try {
      await authFunctions.signOut();
      return { data: true, error: null };
    } catch (error: any) {
      return { data: null, error: { message: error.message } };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    user,
    loading: loading || isLoading,
    error,
    isAuthenticated,
    signIn,
    signUp,
    signInWithGoogle,
    signInWithGithub,
    signInWithPhone,
    signOut,
  };
}

export type UseAuthReturn = ReturnType<typeof useAuth>;
export type { FirebaseUser };
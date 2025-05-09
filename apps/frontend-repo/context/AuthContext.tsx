"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth } from "../config/firebaseConfig";
import Cookies from "js-cookie";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<User>;
  signUp: (email: string, password: string) => Promise<User>;
  logout: () => Promise<void>;
  error: string | null;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signIn: async () => {
    throw new Error("Not implemented");
  },
  signUp: async () => {
    throw new Error("Not implemented");
  },
  logout: async () => {
    throw new Error("Not implemented");
  },
  error: null,
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      setLoading(false);

      if (user) {
        // Get the token and store it in a cookie
        const token = await user.getIdToken();
        Cookies.set("auth-token", token, { expires: 7 }); // expires in 7 days
      } else {
        // Remove the cookie when the user is logged out
        Cookies.remove("auth-token");
      }
    });

    return () => unsubscribe();
  }, []);

  const signIn = async (email: string, password: string): Promise<User> => {
    try {
      setError(null);
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      return userCredential.user;
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to sign in";
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const signUp = async (email: string, password: string): Promise<User> => {
    try {
      setError(null);
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      return userCredential.user;
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to sign up";
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      setError(null);
      await signOut(auth);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to sign out";
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const value = {
    user,
    loading,
    signIn,
    signUp,
    logout,
    error,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

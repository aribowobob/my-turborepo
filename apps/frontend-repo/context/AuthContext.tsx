"use client";

import React, { createContext, useContext, useEffect } from "react";
import Cookies from "js-cookie";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  login as loginAction,
  logout as logoutAction,
  setUser,
} from "@/store/actions";
import { User } from "../../../packages/shared/user";

interface AuthContextType {
  signIn: (email: string, password: string) => Promise<User>;
  signUp: () => Promise<User>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  signIn: async () => {
    throw new Error("Not implemented");
  },
  signUp: async () => {
    throw new Error("Not implemented");
  },
  logout: async () => {
    throw new Error("Not implemented");
  },
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  const { user, loading, error } = useAppSelector((state) => state.auth);

  // Return both the context functions and the Redux state
  return {
    ...context,
    user,
    loading,
    error,
  };
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();

  // Get the backend URL from environment variable
  const backendUrl =
    process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";

  useEffect(() => {
    // Check if we have a token in cookies on page load
    const token = Cookies.get("auth-token");
    if (token) {
      // If we have a token, we can fetch the current user data
      fetchUserData(token);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Function to fetch user data with the token
  const fetchUserData = async (token: string) => {
    try {
      const response = await fetch(`${backendUrl}/api/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const userData = await response.json();
        dispatch(setUser(userData));
      } else {
        // If the request fails, remove the token as it might be invalid
        Cookies.remove("auth-token");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      Cookies.remove("auth-token");
    }
  };

  const signIn = async (email: string, password: string): Promise<User> => {
    const resultAction = await dispatch(loginAction({ email, password }));

    if (loginAction.fulfilled.match(resultAction)) {
      return resultAction.payload;
    } else {
      throw new Error((resultAction.payload as string) || "Login failed");
    }
  };

  const signUp = async (): Promise<User> => {
    // This would need to be implemented with a backend registration endpoint
    throw new Error("Sign up not implemented");
  };

  const logout = async (): Promise<void> => {
    await dispatch(logoutAction());
  };

  const value = {
    signIn,
    signUp,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

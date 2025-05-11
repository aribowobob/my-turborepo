"use client";

import React, { createContext, useContext, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  getUserData,
  login as loginAction,
  logout as logoutAction,
  register as registerAction,
} from "@/store/actions";
import { User } from "../../../packages/shared/user";

interface AuthContextType {
  signIn: (email: string, password: string) => Promise<User>;
  signUp: (email: string, name: string, password: string) => Promise<User>;
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

  useEffect(() => {
    // Fetch user data when the component mounts
    dispatch(getUserData());
  }, [dispatch]);

  const signIn = async (email: string, password: string): Promise<User> => {
    const resultAction = await dispatch(loginAction({ email, password }));

    if (loginAction.fulfilled.match(resultAction)) {
      return resultAction.payload;
    } else {
      throw new Error((resultAction.payload as string) || "Login failed");
    }
  };

  const signUp = async (
    email: string,
    name: string,
    password: string
  ): Promise<User> => {
    const resultAction = await dispatch(
      registerAction({ email, name, password })
    );

    if (registerAction.fulfilled.match(resultAction)) {
      return resultAction.payload;
    } else {
      throw new Error(
        (resultAction.payload as string) || "Registration failed"
      );
    }
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

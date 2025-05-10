import { createAsyncThunk } from "@reduxjs/toolkit";
import Cookies from "js-cookie";
import { User } from "../../../packages/shared/user";

// Action Types
export const SET_USER = "auth/SET_USER";
export const SET_LOADING = "auth/SET_LOADING";
export const SET_ERROR = "auth/SET_ERROR";
export const CLEAR_ERROR = "auth/CLEAR_ERROR";

// Get the backend URL from environment variable
const backendUrl =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";

// Simple Action Creators
export const setUser = (user: User | null) => ({
  type: SET_USER,
  payload: user,
});

export const setLoading = (loading: boolean) => ({
  type: SET_LOADING,
  payload: loading,
});

export const setError = (error: string | null) => ({
  type: SET_ERROR,
  payload: error,
});

export const clearError = () => ({
  type: CLEAR_ERROR,
});

// Async Action Creators (Thunks)
export const login = createAsyncThunk(
  "auth/login",
  async (
    { email, password }: { email: string; password: string },
    { rejectWithValue, dispatch }
  ) => {
    try {
      dispatch(setLoading(true));
      dispatch(clearError());

      const response = await fetch(`${backendUrl}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        dispatch(setLoading(false));
        dispatch(setError(errorData.message || "Login failed"));
        return rejectWithValue(errorData.message || "Login failed");
      }

      const data = await response.json();

      // Set the auth token in cookies
      Cookies.set("auth-token", data.token, { expires: 7 }); // expires in 7 days

      // Update state
      dispatch(setUser(data.user));
      dispatch(setLoading(false));

      return data.user;
    } catch (error) {
      dispatch(setLoading(false));
      dispatch(setError((error as Error).message || "Login failed"));
      return rejectWithValue((error as Error).message || "Login failed");
    }
  }
);

export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue, dispatch }) => {
    try {
      dispatch(setLoading(true));

      // Remove the token from cookies
      Cookies.remove("auth-token");

      // Update state
      dispatch(setUser(null));
      dispatch(setLoading(false));
      dispatch(clearError());

      return null;
    } catch (error) {
      dispatch(setLoading(false));
      dispatch(setError((error as Error).message || "Logout failed"));
      return rejectWithValue((error as Error).message || "Logout failed");
    }
  }
);

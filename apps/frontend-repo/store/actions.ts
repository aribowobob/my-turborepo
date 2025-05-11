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
      const errorMessage =
        error instanceof Error ? error.message : "Login failed";

      dispatch(setLoading(false));
      dispatch(setError(errorMessage));

      return rejectWithValue(errorMessage);
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
      const errorMessage =
        error instanceof Error ? error.message : "Logout failed";

      dispatch(setLoading(false));
      dispatch(setError(errorMessage));

      return rejectWithValue(errorMessage);
    }
  }
);

export const getUserData = createAsyncThunk(
  "auth/getUserData",
  async (_, { rejectWithValue, dispatch }) => {
    try {
      dispatch(setLoading(true));
      dispatch(clearError());

      const token = Cookies.get("auth-token");

      if (!token) {
        dispatch(setLoading(false));
        return rejectWithValue("No authentication token found");
      }

      const response = await fetch(`${backendUrl}/api/user`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();

        if (response.status === 401 || response.status === 403) {
          Cookies.remove("auth-token");
        }

        dispatch(setLoading(false));
        dispatch(setError(errorData.message || "Failed to fetch user data"));
        return rejectWithValue(
          errorData.message || "Failed to fetch user data"
        );
      }

      const userData = await response.json();

      // Update user state in Redux
      dispatch(setUser(userData));
      dispatch(setLoading(false));

      return userData;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to fetch user data";

      dispatch(setLoading(false));
      dispatch(setError(errorMessage));

      return rejectWithValue(errorMessage);
    }
  }
);

export const updateUserData = createAsyncThunk(
  "auth/updateUserData",
  async (userData: Partial<User>, { rejectWithValue, dispatch }) => {
    try {
      dispatch(setLoading(true));
      dispatch(clearError());

      const token = Cookies.get("auth-token");

      if (!token) {
        dispatch(setLoading(false));
        dispatch(setError("No authentication token found"));
        return rejectWithValue("No authentication token found");
      }

      const response = await fetch(`${backendUrl}/api/update-user-data`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        dispatch(setLoading(false));
        dispatch(setError(errorData.message || "Failed to update user data"));
        return rejectWithValue(
          errorData.message || "Failed to update user data"
        );
      }

      const updatedUserData = await response.json();

      // Update user state in Redux
      dispatch(setUser(updatedUserData));
      dispatch(setLoading(false));

      return updatedUserData;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to update user data";

      dispatch(setLoading(false));
      dispatch(setError(errorMessage));

      return rejectWithValue(errorMessage);
    }
  }
);

export const register = createAsyncThunk(
  "auth/register",
  async (
    {
      email,
      name,
      password,
    }: { email: string; name: string; password: string },
    { rejectWithValue, dispatch }
  ) => {
    try {
      dispatch(setLoading(true));
      dispatch(clearError());

      const response = await fetch(`${backendUrl}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, name, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        dispatch(setLoading(false));
        dispatch(setError(errorData.message || "Registration failed"));
        return rejectWithValue(errorData.message || "Registration failed");
      }

      const data = await response.json();

      // Set the auth token in cookies
      Cookies.set("auth-token", data.token, { expires: 7 }); // expires in 7 days

      // Update state
      dispatch(setUser(data.user));
      dispatch(setLoading(false));

      return data.user;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Registration failed";

      dispatch(setLoading(false));
      dispatch(setError(errorMessage));

      return rejectWithValue(errorMessage);
    }
  }
);

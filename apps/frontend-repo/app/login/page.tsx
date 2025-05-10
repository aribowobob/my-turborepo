"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Typography,
  InputAdornment,
  IconButton,
  Alert,
  Box,
} from "@mui/material";
import { Visibility, VisibilityOff, Email, Lock } from "@mui/icons-material";
import { useAuth } from "../../context/AuthContext";
import { FormField } from "../../components/molecules/FormField";
import { PrimaryButton } from "../../components/atoms/Button";

import styles from "./login.module.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { signIn, loading, error } = useAuth();
  const router = useRouter();

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await signIn(email, password);
      router.push("/");
    } catch (error: Error | unknown) {
      // Error state handled by Redux
      console.error("Login error:", error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    }

    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginCard}>
        <div className={styles.loginHeader}>
          <Typography
            variant="h5"
            component="h1"
            sx={{ mt: 3, fontWeight: "bold" }}
          >
            Login to your account
          </Typography>
        </div>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <form className={styles.loginForm} onSubmit={handleLogin}>
          <FormField
            label="Email"
            name="email"
            value={email}
            onChange={handleChange}
            error={errors.email}
            type="email"
            required
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Email />
                  </InputAdornment>
                ),
              },
            }}
          />

          <FormField
            label="Password"
            name="password"
            value={password}
            onChange={handleChange}
            error={errors.password}
            type={showPassword ? "text" : "password"}
            required
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleTogglePasswordVisibility}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />

          <Box className={styles.loginButtonContainer}>
            <PrimaryButton
              type="submit"
              fullWidth
              size="large"
              disabled={loading}
              isLoading={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </PrimaryButton>
          </Box>
        </form>

        <div className={styles.loginFooter}>
          <Typography variant="body2">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              style={{ fontWeight: "bold", color: "var(--foreground)" }}
            >
              Register
            </Link>
          </Typography>
        </div>
      </div>
    </div>
  );
}

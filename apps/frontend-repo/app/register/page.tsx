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
import {
  Visibility,
  VisibilityOff,
  Email,
  Lock,
  Person,
} from "@mui/icons-material";
import { useAuth } from "@/context/AuthContext";
import { FormField } from "@/components/molecules/FormField";
import { PrimaryButton } from "@/components/atoms/Button";

import styles from "./register.module.css";

export default function Register() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [retypePassword, setRetypePassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showRetypePassword, setShowRetypePassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { signUp, loading, error } = useAuth();
  const router = useRouter();

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleToggleRetypePasswordVisibility = () => {
    setShowRetypePassword(!showRetypePassword);
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Email validation
    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Name validation
    if (!name.trim()) {
      newErrors.name = "Name is required";
    } else if (name.trim().length < 6) {
      newErrors.name = "Name must be at least 6 characters";
    }

    // Password validation
    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    // Retype password validation
    if (!retypePassword) {
      newErrors.retypePassword = "Please retype your password";
    } else if (password !== retypePassword) {
      newErrors.retypePassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await signUp(email, name, password);
      // Redirect to login page after successful registration
      router.push("/login");
    } catch (error: Error | unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "An unexpected error occurred. Please try again.";
      console.error(errorMessage);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "email") {
      setEmail(value);
    } else if (name === "name") {
      setName(value);
    } else if (name === "password") {
      setPassword(value);
    } else if (name === "retypePassword") {
      setRetypePassword(value);
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
    <div className={styles.registerContainer}>
      <div className={styles.registerCard}>
        <div className={styles.registerHeader}>
          <Typography
            variant="h5"
            component="h1"
            sx={{ mt: 3, fontWeight: "bold" }}
          >
            Create a new account
          </Typography>
        </div>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <form className={styles.registerForm} onSubmit={handleRegister}>
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
            label="Name"
            name="name"
            value={name}
            onChange={handleChange}
            error={errors.name}
            type="text"
            required
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Person />
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

          <FormField
            label="Retype Password"
            name="retypePassword"
            value={retypePassword}
            onChange={handleChange}
            error={errors.retypePassword}
            type={showRetypePassword ? "text" : "password"}
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
                      onClick={handleToggleRetypePasswordVisibility}
                      edge="end"
                    >
                      {showRetypePassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />

          <Box className={styles.registerButtonContainer}>
            <PrimaryButton
              type="submit"
              fullWidth
              size="large"
              disabled={loading}
              isLoading={loading}
            >
              {loading ? "Registering..." : "Register"}
            </PrimaryButton>
          </Box>
        </form>

        <div className={styles.registerFooter}>
          <Typography variant="body2">
            Already have an account?{" "}
            <Link
              href="/login"
              style={{ fontWeight: "bold", color: "var(--foreground)" }}
            >
              Login
            </Link>
          </Typography>
        </div>
      </div>
    </div>
  );
}

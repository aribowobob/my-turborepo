"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { FormField } from "../molecules/FormField";
import { PrimaryButton } from "../atoms/Button";
import { useAuth } from "@/context/AuthContext";

interface UpdateProfileFormData {
  name: string;
  email: string;
}

interface UpdateProfileFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: UpdateProfileFormData) => Promise<void>;
}

export const UpdateProfileForm: React.FC<UpdateProfileFormProps> = ({
  open,
  onClose,
  onSubmit,
}) => {
  const { user, loading } = useAuth();
  const [formData, setFormData] = useState<UpdateProfileFormData | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Update formData when user did updated
  useEffect(() => {
    if (user) {
      const initialData: UpdateProfileFormData = {
        name: user.name || "",
        email: user.email || "",
      };
      setFormData(initialData);
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      if (prev) {
        return {
          ...prev,
          [name]: value,
        };
      }

      return prev;
    });

    // Clear errors when user types
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Validate name
    if (formData && (!formData.name || formData.name.trim() === "")) {
      newErrors.name = "Name is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData && validateForm()) {
      await onSubmit(formData);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Update Profile</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Box sx={{ width: "100%", mt: 1 }}>
            <FormField
              label="Email"
              name="email"
              value={formData?.email || ""}
              onChange={handleChange}
              disabled={true}
              type="email"
            />

            <FormField
              label="Name"
              name="name"
              value={formData?.name || ""}
              onChange={handleChange}
              error={errors.name}
              required
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <PrimaryButton
            onClick={onClose}
            color="inherit"
            disabled={loading}
            sx={{ mr: 1 }}
          >
            Cancel
          </PrimaryButton>
          <PrimaryButton
            type="submit"
            disabled={loading}
            startIcon={
              loading ? <CircularProgress size={20} color="inherit" /> : null
            }
          >
            {loading ? "Saving..." : "Save Changes"}
          </PrimaryButton>
        </DialogActions>
      </form>
    </Dialog>
  );
};

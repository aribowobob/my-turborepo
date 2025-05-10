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

interface UpdateProfileFormData {
  name: string;
  email: string;
}

interface UpdateProfileFormProps {
  open: boolean;
  onClose: () => void;
  initialData: UpdateProfileFormData;
  onSubmit: (data: UpdateProfileFormData) => Promise<void>;
  isLoading: boolean;
}

export const UpdateProfileForm: React.FC<UpdateProfileFormProps> = ({
  open,
  onClose,
  initialData,
  onSubmit,
  isLoading,
}) => {
  const [formData, setFormData] = useState<UpdateProfileFormData>(initialData);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Update formData when initialData changes
  useEffect(() => {
    if (initialData.email || initialData.name) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

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
    if (!formData.name || formData.name.trim() === "") {
      newErrors.name = "Name is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
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
              value={formData.email}
              onChange={handleChange}
              disabled={true}
              type="email"
            />

            <FormField
              label="Name"
              name="name"
              value={formData.name}
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
            disabled={isLoading}
            sx={{ mr: 1 }}
          >
            Cancel
          </PrimaryButton>
          <PrimaryButton
            type="submit"
            disabled={isLoading}
            startIcon={
              isLoading ? <CircularProgress size={20} color="inherit" /> : null
            }
          >
            {isLoading ? "Saving..." : "Save Changes"}
          </PrimaryButton>
        </DialogActions>
      </form>
    </Dialog>
  );
};

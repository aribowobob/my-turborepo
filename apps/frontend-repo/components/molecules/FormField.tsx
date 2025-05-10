"use client";

import { Box, Typography } from "@mui/material";
import { FormTextField } from "../atoms/FormTextField";

interface FormFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  disabled?: boolean;
  type?: string;
  required?: boolean;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  name,
  value,
  onChange,
  error,
  disabled = false,
  type = "text",
  required = false,
}) => {
  return (
    <Box sx={{ mb: 2 }}>
      <Typography
        variant="subtitle2"
        component="label"
        htmlFor={name}
        sx={{ mb: 1, display: "block" }}
      >
        {label} {required && <span style={{ color: "red" }}>*</span>}
      </Typography>
      <FormTextField
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        type={type}
        disabled={disabled}
        error={!!error}
        helperText={error}
        required={required}
        InputProps={{
          sx: {
            backgroundColor: disabled ? "rgba(0, 0, 0, 0.04)" : "transparent",
          },
        }}
      />
    </Box>
  );
};

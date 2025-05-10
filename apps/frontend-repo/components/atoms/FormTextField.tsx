"use client";

import { TextField, TextFieldProps } from "@mui/material";

interface FormTextFieldProps extends Omit<TextFieldProps, "children"> {
  error?: boolean;
  helperText?: React.ReactNode;
}

export const FormTextField: React.FC<FormTextFieldProps> = ({
  error,
  helperText,
  ...props
}) => {
  return (
    <TextField
      fullWidth
      margin="normal"
      error={error}
      helperText={helperText}
      variant="outlined"
      {...props}
    />
  );
};

"use client";

import React from "react";
import {
  Alert,
  Snackbar as MuiSnackbar,
  SnackbarProps as MuiSnackbarProps,
} from "@mui/material";

interface SnackbarProps extends Omit<MuiSnackbarProps, "children"> {
  message: string;
  severity: "success" | "error" | "info" | "warning";
}

export const Snackbar: React.FC<SnackbarProps> = ({
  message,
  severity,
  open,
  onClose,
  ...props
}) => {
  const handleAlertClose = (event: React.SyntheticEvent<Element, Event>) => {
    if (onClose) {
      onClose(event, "escapeKeyDown");
    }
  };

  return (
    <MuiSnackbar
      open={open}
      autoHideDuration={6000}
      onClose={onClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      {...props}
    >
      <Alert
        onClose={handleAlertClose}
        severity={severity}
        variant="filled"
        sx={{ width: "100%" }}
      >
        {message}
      </Alert>
    </MuiSnackbar>
  );
};

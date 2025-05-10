"use client";

import { useState, useCallback } from "react";

type Severity = "success" | "error" | "info" | "warning";

interface SnackbarState {
  open: boolean;
  message: string;
  severity: Severity;
  autoHideDuration?: number;
}

export const useSnackbar = () => {
  const [snackbar, setSnackbar] = useState<SnackbarState>({
    open: false,
    message: "",
    severity: "success",
    autoHideDuration: 6000,
  });

  const showSnackbar = useCallback(
    (
      message: string,
      severity: Severity = "success",
      autoHideDuration: number = 6000
    ) => {
      setSnackbar({
        open: true,
        message,
        severity,
        autoHideDuration,
      });
    },
    []
  );

  const hideSnackbar = useCallback(() => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  }, []);

  return {
    snackbar,
    showSnackbar,
    hideSnackbar,
  };
};

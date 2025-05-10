"use client";

import React, { createContext, useContext, ReactNode } from "react";
import { useSnackbar } from "../hooks/useSnackbar";
import { Snackbar } from "../components/atoms/Snackbar";

type Severity = "success" | "error" | "info" | "warning";

interface SnackbarContextType {
  showSnackbar: (
    message: string,
    severity?: Severity,
    autoHideDuration?: number
  ) => void;
  hideSnackbar: () => void;
}

const SnackbarContext = createContext<SnackbarContextType | undefined>(
  undefined
);

export const useSnackbarContext = (): SnackbarContextType => {
  const context = useContext(SnackbarContext);
  if (!context) {
    throw new Error(
      "useSnackbarContext must be used within a SnackbarProvider"
    );
  }
  return context;
};

interface SnackbarProviderProps {
  children: ReactNode;
}

export const SnackbarProvider: React.FC<SnackbarProviderProps> = ({
  children,
}) => {
  const { snackbar, showSnackbar, hideSnackbar } = useSnackbar();

  const handleClose = (
    event: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") return;
    hideSnackbar();
  };

  return (
    <SnackbarContext.Provider value={{ showSnackbar, hideSnackbar }}>
      {children}
      <Snackbar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={handleClose}
        autoHideDuration={snackbar.autoHideDuration}
      />
    </SnackbarContext.Provider>
  );
};

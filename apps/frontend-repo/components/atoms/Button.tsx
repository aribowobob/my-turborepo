"use client";

import { Button as MuiButton, ButtonProps } from "@mui/material";

interface PrimaryButtonProps extends ButtonProps {
  isLoading?: boolean;
}

export const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  children,
  isLoading = false,
  disabled,
  ...props
}) => {
  return (
    <MuiButton variant="contained" disabled={isLoading || disabled} {...props}>
      {children}
    </MuiButton>
  );
};

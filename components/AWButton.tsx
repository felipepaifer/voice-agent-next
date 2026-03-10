"use client";

import Button, { ButtonProps } from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import IconButton from "@mui/material/IconButton";

type AWButtonProps = ButtonProps & {
  isLoading?: boolean;
  iconButton?: boolean;
};

export function AWButton({
  isLoading = false,
  iconButton = false,
  disabled,
  children,
  sx,
  variant,
  startIcon,
  endIcon,
  ...props
}: AWButtonProps) {
  if (iconButton) {
    return (
      <IconButton
        disabled={disabled || isLoading}
        sx={[
          {
            width: 56,
            height: 56,
          },
          ...(Array.isArray(sx) ? sx : [sx]),
        ]}
        {...props}
      >
        {isLoading ? <CircularProgress size={18} color="inherit" /> : children}
      </IconButton>
    );
  }

  return (
    <Button
      disabled={disabled || isLoading}
      sx={[
        {
          borderRadius: 999,
          fontWeight: 700,
          letterSpacing: 0.3,
          textTransform: "none",
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      variant={variant}
      startIcon={startIcon}
      endIcon={endIcon}
      {...props}
    >
      {isLoading ? <CircularProgress size={18} color="inherit" /> : children}
    </Button>
  );
}

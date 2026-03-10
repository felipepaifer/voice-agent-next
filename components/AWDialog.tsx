"use client";

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

type AWDialogProps = {
  open: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  actions?: React.ReactNode;
  fullWidth?: boolean;
  maxWidth?: "xs" | "sm" | "md" | "lg" | "xl";
};

export function AWDialog({
  open,
  title,
  onClose,
  children,
  actions,
  fullWidth = true,
  maxWidth = "md",
}: AWDialogProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth={fullWidth}
      maxWidth={maxWidth}
      PaperProps={{
        sx: {
          borderRadius: 2.5,
          border: "1px solid rgba(148, 163, 184, 0.28)",
          background:
            "radial-gradient(700px circle at 5% 0%, rgba(30, 64, 175, 0.28), rgba(15, 23, 42, 0.95) 40%), #020617",
          color: "#e2e8f0",
          boxShadow: "0 24px 80px rgba(2, 6, 23, 0.62)",
        },
      }}
      sx={{
        "& .MuiBackdrop-root": {
          backgroundColor: "rgba(2, 6, 23, 0.72)",
          backdropFilter: "blur(3px)",
        },
      }}
    >
      <DialogTitle
        sx={{
          color: "#e2e8f0",
          fontWeight: 700,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 1,
        }}
      >
        <span>{title}</span>
        <IconButton
          aria-label="Close dialog"
          onClick={onClose}
          size="small"
          sx={{
            color: "#cbd5e1",
            border: "1px solid rgba(148, 163, 184, 0.32)",
            backgroundColor: "rgba(15, 23, 42, 0.56)",
            "&:hover": {
              backgroundColor: "rgba(30, 41, 59, 0.82)",
            },
          }}
        >
          <CloseRoundedIcon fontSize="small" />
        </IconButton>
      </DialogTitle>
      <DialogContent
        sx={{
          "& .MuiFormLabel-root": { color: "#94a3b8" },
          "& .MuiFormLabel-root.Mui-focused": { color: "#93c5fd" },
          "& .MuiInputBase-root": {
            color: "#e2e8f0",
            backgroundColor: "rgba(15, 23, 42, 0.55)",
          },
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "rgba(148, 163, 184, 0.3)",
          },
          "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "rgba(125, 211, 252, 0.48)",
          },
          "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#60a5fa",
          },
          "& .MuiFormControlLabel-label": {
            color: "#cbd5e1",
          },
          "& .MuiCheckbox-root": {
            color: "#60a5fa",
          },
          "& .MuiCheckbox-root.Mui-checked": {
            color: "#38bdf8",
          },
        }}
      >
        {children}
      </DialogContent>
      {actions ? (
        <DialogActions sx={{ px: 3, pb: 2.5, "& .MuiButton-text": { color: "#cbd5e1" } }}>
          {actions}
        </DialogActions>
      ) : null}
    </Dialog>
  );
}

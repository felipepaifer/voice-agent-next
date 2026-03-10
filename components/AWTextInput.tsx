"use client";

import TextField, { TextFieldProps } from "@mui/material/TextField";

export function AWTextInput(props: TextFieldProps) {
  return <TextField fullWidth size="small" {...props} />;
}

"use client";

import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";

type AWCheckboxProps = {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
};

export function AWCheckbox({
  label,
  checked,
  onChange,
  disabled = false,
}: AWCheckboxProps) {
  return (
    <FormControlLabel
      control={
        <Checkbox
          checked={Boolean(checked)}
          disabled={disabled}
          onChange={(_, value) => onChange(value)}
          size="small"
        />
      }
      label={label}
    />
  );
}

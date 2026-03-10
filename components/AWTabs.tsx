"use client";

import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";

type AWTabsProps = {
  value: string;
  onChange: (value: string) => void;
  items: Array<{ label: string; value: string }>;
};

export function AWTabs({ value, onChange, items }: AWTabsProps) {
  return (
    <Tabs
      value={value}
      onChange={(_, nextValue: string) => onChange(nextValue)}
      variant="scrollable"
      scrollButtons="auto"
    >
      {items.map((item) => (
        <Tab key={item.value} value={item.value} label={item.label} />
      ))}
    </Tabs>
  );
}

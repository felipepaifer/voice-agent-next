"use client";

import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";

type AWAccordionProps = {
  expanded: boolean;
  onChange: (expanded: boolean) => void;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  children: React.ReactNode;
};

export function AWAccordion({
  expanded,
  onChange,
  title,
  subtitle,
  children,
}: AWAccordionProps) {
  const dashboardRadius = "1.25rem";

  return (
    <Accordion
      disableGutters
      square={false}
      expanded={expanded}
      onChange={(_event, nextExpanded) => onChange(nextExpanded)}
      sx={{
        borderRadius: dashboardRadius,
        border: "1px solid rgba(71, 85, 105, 0.6)",
        bgcolor: "rgba(2, 6, 23, 0.9)",
        backdropFilter: "blur(8px)",
        boxShadow: "0 -14px 40px rgba(2, 6, 23, 0.55)",
        color: "#f1f5f9",
        "&::before": { display: "none" },
        "&.MuiPaper-root": {
          borderRadius: dashboardRadius,
        },
        "&.Mui-expanded": {
          margin: 0,
          borderRadius: dashboardRadius,
        },
        overflow: "hidden",
        padding: "10px 0",
      }}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreRoundedIcon sx={{ color: "#cbd5e1" }} />}
        aria-controls="aw-accordion-content"
        id="aw-accordion-header"
        sx={{
          minHeight: 48,
          px: 2,
          "& .MuiAccordionSummary-content": {
            my: 0,
            minHeight: 48,
            display: "flex",
            alignItems: "center",
          },
        }}
      >
        <div className="w-full">
          <div className="text-sm font-semibold">{title}</div>
          {subtitle ? <div className="text-[11px] text-slate-400">{subtitle}</div> : null}
        </div>
      </AccordionSummary>
      <AccordionDetails sx={{ px: 2, pb: 2 }}>{children}</AccordionDetails>
    </Accordion>
  );
}

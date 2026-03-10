"use client"

import { AWCheckbox } from "@/components/AWCheckbox"
import { AgentTools } from "@/models/AgentSettings"

type AgentToolToggleGroupProps = {
  tools: AgentTools
  onChange: (value: AgentTools) => void
}

export function AgentToolToggleGroup({
  tools,
  onChange,
}: AgentToolToggleGroupProps) {
  // Derived values
  const schedulingDisabled = !tools.schedule_viewing

  // Methods
  const handleScheduleViewingToggle = (checked: boolean) => {
    if (!checked) {
      onChange({
        ...tools,
        schedule_viewing: false,
        check_availability: false,
        google_calendar_mcp: false,
        send_sms_confirmation: false,
      })
      return
    }
    onChange({ ...tools, schedule_viewing: true })
  }

  return (
    <div style={{ display: "grid", gap: 14 }}>
      <div>
        <div
          style={{
            fontWeight: 700,
            fontSize: 13,
            opacity: 0.9,
            marginBottom: 6,
          }}
        >
          Development Assistant
        </div>
        <div>
          <AWCheckbox
            label="Schedule Viewing"
            checked={tools.schedule_viewing}
            onChange={handleScheduleViewingToggle}
          />
        </div>
      </div>

      {tools.schedule_viewing ? (
        <div
          style={{
            border: "1px solid rgba(148, 163, 184, 0.24)",
            borderRadius: 12,
            padding: 12,
          }}
        >
          <div
            style={{
              fontWeight: 700,
              fontSize: 13,
              opacity: 0.95,
              marginBottom: 6,
            }}
          >
            Scheduling Flow
          </div>
          <div style={{ fontSize: 12, opacity: 0.72, marginBottom: 8 }}>
            Enable scheduling to unlock availability, calendar event creation, and SMS
            confirmation.
          </div>
          <div className="flex flex-col gap-1 mt-5">
            <AWCheckbox
              label="Check Availability"
              checked={tools.check_availability}
              disabled={schedulingDisabled}
              onChange={(checked) =>
                onChange({ ...tools, check_availability: checked })
              }
            />
            <AWCheckbox
              label="Create Google Calendar Event"
              checked={tools.google_calendar_mcp}
              disabled={schedulingDisabled}
              onChange={(checked) =>
                onChange({ ...tools, google_calendar_mcp: checked })
              }
            />
            <AWCheckbox
              label="Send SMS Confirmation"
              checked={tools.send_sms_confirmation}
              disabled={schedulingDisabled}
              onChange={(checked) =>
                onChange({ ...tools, send_sms_confirmation: checked })
              }
            />
          </div>
        </div>
      ) : null}
    </div>
  )
}

"use client"

import { AWButton } from "@/components/AWButton"
import { AWCard } from "@/components/AWCard"
import { UpdateAgentSettingsDialog } from "@/composedComponents/UpdateAgentSettingsDialog"
import { useAgentSettings } from "@/contexts/agentSettings/AgentSettingsContext"
import { useState } from "react"

export function AgentSettingsPanel() {
  // Contexts
  const { agentSettings } = useAgentSettings()

  // States
  const [open, setOpen] = useState(false)

  return (
    <>
      <AWCard
        title="Agent Configuration"
        subtitle="Edit system prompt, persona, and enabled tools."
      >
        <div style={{ display: "grid", gap: 8 }}>
          <div>
            <strong>Name:</strong> {agentSettings?.persona.name ?? "-"}
          </div>
          <div>
            <strong>Greeting:</strong> {agentSettings?.persona.greeting ?? "-"}
          </div>
          <div>
            <strong>Voice:</strong> {agentSettings?.persona.voice ?? "-"}
          </div>
          <div>
            <strong>Prompt:</strong> {agentSettings?.systemPrompt ?? "-"}
          </div>
          <AWButton variant="contained" onClick={() => setOpen(true)}>
            Update Settings
          </AWButton>
        </div>
      </AWCard>
      <UpdateAgentSettingsDialog open={open} onClose={() => setOpen(false)} />
    </>
  )
}

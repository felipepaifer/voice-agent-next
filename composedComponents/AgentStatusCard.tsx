"use client"

import { AWCard } from "@/components/AWCard"
import { useAgentSettings } from "@/contexts/agentSettings/AgentSettingsContext"
import { useAgentSession } from "@/contexts/agentSession/AgentSessionContext"

export function AgentStatusCard() {
  // Contexts
  const { agentSettings } = useAgentSettings()
  const { isConnected, agentSession } = useAgentSession()

  return (
    <AWCard
      title="Agent Status"
      subtitle={isConnected ? "Connected" : "Disconnected"}
    >
      <div style={{ display: "grid", rowGap: 8 }}>
        <div>
          <strong>Persona:</strong> {agentSettings?.persona.name ?? "-"}
        </div>
        <div>
          <strong>Room:</strong> {agentSession?.room ?? "-"}
        </div>
        <div>
          <strong>Identity:</strong> {agentSession?.identity ?? "-"}
        </div>
      </div>
    </AWCard>
  )
}

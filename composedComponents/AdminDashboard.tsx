"use client"

import { AgentCallPanel } from "@/composedComponents/AgentCallPanel"
import { AgentSettingsHandler } from "@/handlers/AgentSettingsHandler"
import { useAgentSettings } from "@/contexts/agentSettings/AgentSettingsContext"
import { useEffect, useMemo } from "react"

export function AdminDashboard() {
  // Contexts
  const { setAgentSettings } = useAgentSettings()

  // States
  const handler = useMemo(() => new AgentSettingsHandler(), [])

  // Methods
  const loadSettings = async () => {
    const settings = await handler.getAgentSettings()
    setAgentSettings(settings)
  }

  // Watchers
  useEffect(() => {
    void loadSettings()
  }, [handler, setAgentSettings])

  return (
    <div className="w-full min-h-screen px-1 py-1 sm:px-2 sm:py-2">
      <AgentCallPanel />
    </div>
  )
}

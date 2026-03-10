"use client"

import { AWButton } from "@/components/AWButton"
import { AWDialog } from "@/components/AWDialog"
import { AgentSettingsForm } from "@/composedComponents/AgentSettingsForm"
import { AgentSettingsHandler } from "@/handlers/AgentSettingsHandler"
import { useAgentSettings } from "@/contexts/agentSettings/AgentSettingsContext"
import { AgentSettings } from "@/models/AgentSettings"
import { useMemo, useState } from "react"

type UpdateAgentSettingsDialogProps = {
  open: boolean
  onClose: () => void
}

export function UpdateAgentSettingsDialog({
  open,
  onClose,
}: UpdateAgentSettingsDialogProps) {
  // Contexts
  const { agentSettings, setAgentSettings } = useAgentSettings()

  // States
  const [isSaving, setIsSaving] = useState(false)
  const [draftSettings, setDraftSettings] = useState<AgentSettings | null>(null)
  const handler = useMemo(() => new AgentSettingsHandler(), [])

  // Derived values
  const currentSettings = draftSettings ?? agentSettings

  // Methods
  const handleSave = async () => {
    if (!currentSettings) {
      return
    }
    setIsSaving(true)
    try {
      const saved = await handler.updateAgentSettings(currentSettings)
      setAgentSettings(saved)
      onClose()
    } finally {
      setIsSaving(false)
    }
  }

  if (!currentSettings) {
    return null
  }

  return (
    <AWDialog
      open={open}
      onClose={onClose}
      title="Update Agent Settings"
      actions={
        <>
          <AWButton variant="text" onClick={onClose}>
            Cancel
          </AWButton>
          <AWButton variant="contained" onClick={handleSave} isLoading={isSaving}>
            Save
          </AWButton>
        </>
      }
    >
      <AgentSettingsForm settings={currentSettings} onChange={setDraftSettings} />
    </AWDialog>
  )
}

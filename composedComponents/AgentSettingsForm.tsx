"use client"

import { AWStack } from "@/components/AWStack"
import { AWTextInput } from "@/components/AWTextInput"
import { AgentToolToggleGroup } from "@/composedComponents/AgentToolToggleGroup"
import { AgentSettings, AgentTools } from "@/models/AgentSettings"

type AgentSettingsFormProps = {
  settings: AgentSettings
  onChange: (value: AgentSettings) => void
}

export function AgentSettingsForm({ settings, onChange }: AgentSettingsFormProps) {
  // Methods
  const normalizeTools = (tools: AgentTools): AgentTools => {
    if (tools.schedule_viewing) {
      return tools
    }
    return {
      ...tools,
      check_availability: false,
      google_calendar_mcp: false,
      send_sms_confirmation: false,
    }
  }

  // Derived values
  const draft = new AgentSettings({
    systemPrompt: settings.systemPrompt,
    persona: settings.persona,
    tools: normalizeTools(settings.tools),
    notifications: settings.notifications,
  })

  // Methods
  const updateDraft = (value: AgentSettings) => {
    onChange(value)
  }

  return (
    <AWStack>
      <div>
        <label className="font-semibold">System Prompt</label>
        <div className="mt-2">
        <AWTextInput
          multiline
          minRows={6}
          value={draft.systemPrompt}
          onChange={(event) =>
            updateDraft(
              new AgentSettings({
                systemPrompt: event.target.value,
                persona: draft.persona,
                tools: draft.tools,
                notifications: draft.notifications,
              })
            )
          }
         />
        </div>
      </div>
 
      <div>
        <label className="font-semibold">Agent Name</label>
        <div className="mt-2">    
        <AWTextInput
          value={draft.persona.name}
          onChange={(event) =>
            updateDraft(
              new AgentSettings({
                systemPrompt: draft.systemPrompt,
                persona: {
                  ...draft.persona,
                  name: event.target.value,
                },
                tools: draft.tools,
                notifications: draft.notifications,
              })
            )
          }
        />
        </div>
        
      </div>  
      <div>
        <label className="font-semibold">Greeting</label>
        <div className="mt-2"> 
        <AWTextInput
          value={draft.persona.greeting}
          onChange={(event) =>
            updateDraft(
              new AgentSettings({
                systemPrompt: draft.systemPrompt,
                persona: {
                  ...draft.persona,
                  greeting: event.target.value,
                },
                tools: draft.tools,
                notifications: draft.notifications,
              })
            )
          }
        />
        </div>
        
      </div>

      <div>
        <label className="font-semibold">Tools</label>
        <div className="mt-2">
          <AgentToolToggleGroup
            tools={draft.tools}
            onChange={(tools) =>
              updateDraft(
                new AgentSettings({
                  systemPrompt: draft.systemPrompt,
                  persona: draft.persona,
                  tools: normalizeTools(tools),
                  notifications: draft.notifications,
                })
              )
            }
          />
        </div>
      </div>
    </AWStack>
  )
}

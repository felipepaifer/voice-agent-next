"use client";

import { AgentSettings } from "@/models/AgentSettings";
import { useState } from "react";

export default function useAgentSettingsState() {
  const [agentSettings, setAgentSettings] = useState<AgentSettings | null>(null);

  return {
    agentSettings,
    setAgentSettings,
  };
}

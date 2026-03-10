"use client";

import { AgentSettingsProvider } from "@/contexts/agentSettings/AgentSettingsContext";
import { AgentSessionProvider } from "@/contexts/agentSession/AgentSessionContext";

type ContextWrapperProps = {
  children: React.ReactNode;
};

export default function ContextWrapper({ children }: ContextWrapperProps) {
  return (
    <AgentSettingsProvider>
      <AgentSessionProvider>{children}</AgentSessionProvider>
    </AgentSettingsProvider>
  );
}

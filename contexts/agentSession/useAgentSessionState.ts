"use client";

import { AgentSession } from "@/models/AgentSession";
import { useState } from "react";

export default function useAgentSessionState() {
  const [agentSession, setAgentSession] = useState<AgentSession | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  return {
    agentSession,
    setAgentSession,
    isConnected,
    setIsConnected,
  };
}
